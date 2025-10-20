// API endpoints from IPTV-org
const API_BASE = 'https://iptv-org.github.io/api';
const CHANNELS_API = `${API_BASE}/channels.json`;
const STREAMS_API = `${API_BASE}/streams.json`;

// Global variables
let allChannels = [];
let allStreams = [];
let filteredChannels = [];
let currentPlayer = null;
let currentChannel = null;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let recentlyWatched = JSON.parse(localStorage.getItem('recentlyWatched')) || [];
let currentView = 'all'; // 'all', 'favorites', 'recent'

// DOM elements
const channelGrid = document.getElementById('channelGrid');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const categoryFilter = document.getElementById('categoryFilter');
const countryFilter = document.getElementById('countryFilter');
const languageFilter = document.getElementById('languageFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const categoryList = document.getElementById('categoryList');
const loadingSpinner = document.getElementById('loadingSpinner');
const noResults = document.getElementById('noResults');
const channelCount = document.getElementById('channelCount');
const playerContainer = document.getElementById('playerContainer');
const videoPlayer = document.getElementById('videoPlayer');
const closePlayer = document.getElementById('closePlayer');
const currentChannelName = document.getElementById('currentChannelName');
const channelInfo = document.getElementById('channelInfo');
const playerError = document.getElementById('playerError');
const loadingOverlay = document.getElementById('loadingOverlay');
const favoriteBtn = document.getElementById('favoriteBtn');
const favoriteCurrentChannel = document.getElementById('favoriteCurrentChannel');
const themeToggle = document.getElementById('themeToggle');
const showAllChannels = document.getElementById('showAllChannels');
const showFavorites = document.getElementById('showFavorites');
const showRecent = document.getElementById('showRecent');
const sortBy = document.getElementById('sortBy');
const sectionTitle = document.getElementById('sectionTitle');
const sectionSubtitle = document.getElementById('sectionSubtitle');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const retryStream = document.getElementById('retryStream');
const pictureInPicture = document.getElementById('pictureInPicture');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const streamQuality = document.getElementById('streamQuality');
const scrollToTop = document.getElementById('scrollToTop');
const toast = document.getElementById('toast');

// Initialize the application
async function init() {
    try {
        showLoading(true);
        await loadChannelsAndStreams();
        setupEventListeners();
        loadTheme();
        renderChannels();
        updateFavoritesCount();
        showLoading(false);
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Failed to load channels. Please refresh the page.', 'error');
        showLoading(false);
    }
}

// Load channels and streams data
async function loadChannelsAndStreams() {
    try {
        const [channelsResponse, streamsResponse] = await Promise.all([
            fetch(CHANNELS_API),
            fetch(STREAMS_API)
        ]);

        if (!channelsResponse.ok || !streamsResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        allChannels = await channelsResponse.json();
        allStreams = await streamsResponse.json();

        // Merge channels with their streams
        allChannels = allChannels.map(channel => {
            const channelStreams = allStreams.filter(stream => stream.channel === channel.id);
            return {
                ...channel,
                streams: channelStreams
            };
        }).filter(channel => channel.streams && channel.streams.length > 0);

        filteredChannels = [...allChannels];
        
        populateFilters();
        updateChannelCount();
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Populate filter dropdowns
function populateFilters() {
    const categories = [...new Set(allChannels.flatMap(ch => ch.categories || []))].sort();
    const countries = [...new Set(allChannels.flatMap(ch => ch.countries || []))].sort();
    const languages = [...new Set(allChannels.flatMap(ch => ch.languages || []))].sort();

    populateSelect(categoryFilter, categories);
    populateSelect(countryFilter, countries);
    populateSelect(languageFilter, languages);

    // Populate sidebar categories
    const popularCategories = categories.slice(0, 20);
    categoryList.innerHTML = '';
    popularCategories.forEach(category => {
        const li = document.createElement('li');
        li.setAttribute('data-category', category);
        li.innerHTML = `<i class="fas fa-folder"></i> ${category}`;
        li.addEventListener('click', () => {
            document.querySelectorAll('.category-list li').forEach(item => item.classList.remove('active'));
            li.classList.add('active');
            categoryFilter.value = category;
            filterChannels();
        });
        categoryList.appendChild(li);
    });
}

// Populate select dropdown
function populateSelect(selectElement, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

// Setup event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', () => {
        debounce(filterChannels, 300)();
        clearSearch.classList.toggle('hidden', !searchInput.value);
    });
    
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.classList.add('hidden');
        filterChannels();
    });
    
    categoryFilter.addEventListener('change', filterChannels);
    countryFilter.addEventListener('change', filterChannels);
    languageFilter.addEventListener('change', filterChannels);
    sortBy.addEventListener('change', filterChannels);
    
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    resetFiltersBtn.addEventListener('click', clearAllFilters);
    
    closePlayer.addEventListener('click', closeVideoPlayer);
    retryStream.addEventListener('click', () => {
        if (currentChannel) playChannel(currentChannel);
    });
    
    favoriteBtn.addEventListener('click', () => {
        currentView = 'favorites';
        updateView();
    });
    
    favoriteCurrentChannel.addEventListener('click', toggleCurrentChannelFavorite);
    themeToggle.addEventListener('click', toggleTheme);
    
    showAllChannels.addEventListener('click', () => {
        currentView = 'all';
        updateView();
    });
    
    showFavorites.addEventListener('click', () => {
        currentView = 'favorites';
        updateView();
    });
    
    showRecent.addEventListener('click', () => {
        currentView = 'recent';
        updateView();
    });
    
    pictureInPicture.addEventListener('click', togglePictureInPicture);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTop.classList.remove('hidden');
        } else {
            scrollToTop.classList.add('hidden');
        }
    });
    
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Update view based on selection
function updateView() {
    // Update active states
    document.querySelectorAll('.quick-access-list li').forEach(li => li.classList.remove('active'));
    
    if (currentView === 'all') {
        showAllChannels.classList.add('active');
        sectionTitle.textContent = 'Available Channels';
        sectionSubtitle.textContent = 'Browse all live TV channels from around the world';
        filteredChannels = [...allChannels];
    } else if (currentView === 'favorites') {
        showFavorites.classList.add('active');
        sectionTitle.textContent = 'My Favorites';
        sectionSubtitle.textContent = 'Your favorite channels in one place';
        filteredChannels = allChannels.filter(ch => favorites.includes(ch.id));
    } else if (currentView === 'recent') {
        showRecent.classList.add('active');
        sectionTitle.textContent = 'Recently Watched';
        sectionSubtitle.textContent = 'Continue where you left off';
        filteredChannels = allChannels.filter(ch => recentlyWatched.includes(ch.id))
            .sort((a, b) => recentlyWatched.indexOf(a.id) - recentlyWatched.indexOf(b.id));
    }
    
    clearAllFilters();
    renderChannels();
    updateChannelCount();
}

// Filter channels based on search and filters
function filterChannels() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const country = countryFilter.value;
    const language = languageFilter.value;
    const sort = sortBy.value;

    let baseChannels = currentView === 'all' ? allChannels :
                       currentView === 'favorites' ? allChannels.filter(ch => favorites.includes(ch.id)) :
                       allChannels.filter(ch => recentlyWatched.includes(ch.id));

    filteredChannels = baseChannels.filter(channel => {
        const matchesSearch = !searchTerm || 
            channel.name.toLowerCase().includes(searchTerm) ||
            (channel.alt_names && channel.alt_names.some(name => name.toLowerCase().includes(searchTerm)));
        
        const matchesCategory = !category || 
            (channel.categories && channel.categories.includes(category));
        
        const matchesCountry = !country || 
            (channel.countries && channel.countries.includes(country));
        
        const matchesLanguage = !language || 
            (channel.languages && channel.languages.includes(language));

        return matchesSearch && matchesCategory && matchesCountry && matchesLanguage;
    });

    // Apply sorting
    if (sort === 'name-asc') {
        filteredChannels.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
        filteredChannels.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'country-asc') {
        filteredChannels.sort((a, b) => {
            const countryA = a.countries?.[0] || '';
            const countryB = b.countries?.[0] || '';
            return countryA.localeCompare(countryB);
        });
    }

    renderChannels();
    updateChannelCount();
}

// Clear all filters
function clearAllFilters() {
    searchInput.value = '';
    clearSearch.classList.add('hidden');
    categoryFilter.value = '';
    countryFilter.value = '';
    languageFilter.value = '';
    sortBy.value = 'name-asc';
    
    document.querySelectorAll('.category-list li').forEach(item => item.classList.remove('active'));
    
    filterChannels();
}

// Render channels to the grid
function renderChannels() {
    channelGrid.innerHTML = '';

    if (filteredChannels.length === 0) {
        noResults.classList.remove('hidden');
        channelGrid.classList.add('hidden');
        return;
    }

    noResults.classList.add('hidden');
    channelGrid.classList.remove('hidden');

    filteredChannels.forEach(channel => {
        const card = createChannelCard(channel);
        channelGrid.appendChild(card);
    });
}

// Create channel card element
function createChannelCard(channel) {
    const card = document.createElement('div');
    card.className = 'channel-card';
    
    const logoDiv = document.createElement('div');
    logoDiv.className = 'channel-logo';
    
    // Favorite button
    const favBtn = document.createElement('button');
    favBtn.className = 'favorite-icon';
    if (favorites.includes(channel.id)) {
        favBtn.classList.add('active');
    }
    favBtn.innerHTML = favorites.includes(channel.id) ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(channel.id);
        favBtn.classList.toggle('active');
        favBtn.innerHTML = favorites.includes(channel.id) ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    });
    
    if (channel.logo) {
        const img = document.createElement('img');
        img.src = channel.logo;
        img.alt = channel.name;
        img.loading = 'lazy';
        img.onerror = () => {
            logoDiv.classList.add('no-logo');
            logoDiv.innerHTML = '<i class="fas fa-tv"></i>';
            logoDiv.appendChild(favBtn);
        };
        logoDiv.appendChild(img);
    } else {
        logoDiv.classList.add('no-logo');
        logoDiv.innerHTML = '<i class="fas fa-tv"></i>';
    }
    
    logoDiv.appendChild(favBtn);
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'channel-info';
    
    const name = document.createElement('div');
    name.className = 'channel-name';
    name.textContent = channel.name;
    name.title = channel.name;
    
    const meta = document.createElement('div');
    meta.className = 'channel-meta';
    
    if (channel.categories && channel.categories.length > 0) {
        const categoryTag = document.createElement('span');
        categoryTag.className = 'channel-tag';
        categoryTag.textContent = channel.categories[0];
        meta.appendChild(categoryTag);
    }
    
    if (channel.countries && channel.countries.length > 0) {
        const countryDiv = document.createElement('div');
        countryDiv.className = 'channel-country';
        const countryCode = channel.countries[0].toLowerCase();
        countryDiv.innerHTML = `
            <span class="country-flag">${getCountryFlag(countryCode)}</span>
            <span>${channel.countries[0]}</span>
        `;
        meta.appendChild(countryDiv);
    }
    
    infoDiv.appendChild(name);
    infoDiv.appendChild(meta);
    
    card.appendChild(logoDiv);
    card.appendChild(infoDiv);
    
    card.addEventListener('click', () => playChannel(channel));
    
    return card;
}

// Get country flag emoji
function getCountryFlag(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '🌐';
    
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    
    return String.fromCodePoint(...codePoints);
}

// Toggle favorite
function toggleFavorite(channelId) {
    const index = favorites.indexOf(channelId);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('Removed from favorites', 'info');
    } else {
        favorites.push(channelId);
        showToast('Added to favorites', 'success');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    
    // Update current view if in favorites mode
    if (currentView === 'favorites') {
        updateView();
    }
}

// Toggle current channel favorite
function toggleCurrentChannelFavorite() {
    if (!currentChannel) return;
    
    toggleFavorite(currentChannel.id);
    
    if (favorites.includes(currentChannel.id)) {
        favoriteCurrentChannel.classList.add('active');
        favoriteCurrentChannel.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        favoriteCurrentChannel.classList.remove('active');
        favoriteCurrentChannel.innerHTML = '<i class="far fa-heart"></i>';
    }
}

// Update favorites count
function updateFavoritesCount() {
    const count = favorites.length;
    document.querySelector('.favorites-count').textContent = count;
    document.querySelector('.badge').textContent = count;
}

// Add to recently watched
function addToRecentlyWatched(channelId) {
    recentlyWatched = recentlyWatched.filter(id => id !== channelId);
    recentlyWatched.unshift(channelId);
    recentlyWatched = recentlyWatched.slice(0, 50); // Keep only last 50
    localStorage.setItem('recentlyWatched', JSON.stringify(recentlyWatched));
}

// Play channel
function playChannel(channel) {
    if (!channel.streams || channel.streams.length === 0) {
        showToast('No streams available for this channel', 'error');
        return;
    }

    currentChannel = channel;
    addToRecentlyWatched(channel.id);

    // Get the first working stream URL
    const stream = channel.streams[0];
    const streamUrl = stream.url;

    currentChannelName.textContent = channel.name;
    
    // Update favorite button
    if (favorites.includes(channel.id)) {
        favoriteCurrentChannel.classList.add('active');
        favoriteCurrentChannel.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        favoriteCurrentChannel.classList.remove('active');
        favoriteCurrentChannel.innerHTML = '<i class="far fa-heart"></i>';
    }
    
    // Create info tags
    channelInfo.innerHTML = '';
    if (channel.countries && channel.countries.length > 0) {
        const tag = document.createElement('span');
        tag.className = 'info-tag';
        tag.innerHTML = `<i class="fas fa-globe"></i> ${channel.countries.join(', ')}`;
        channelInfo.appendChild(tag);
    }
    if (channel.languages && channel.languages.length > 0) {
        const tag = document.createElement('span');
        tag.className = 'info-tag';
        tag.innerHTML = `<i class="fas fa-language"></i> ${channel.languages.join(', ')}`;
        channelInfo.appendChild(tag);
    }
    if (channel.categories && channel.categories.length > 0) {
        const tag = document.createElement('span');
        tag.className = 'info-tag';
        tag.innerHTML = `<i class="fas fa-tag"></i> ${channel.categories.join(', ')}`;
        channelInfo.appendChild(tag);
    }

    playerContainer.classList.remove('hidden');
    playerError.classList.add('hidden');
    loadingOverlay.classList.remove('hidden');
    
    // Scroll to player
    playerContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Load stream
    loadStream(streamUrl);
}

// Load stream with HLS.js support
function loadStream(url) {
    // Clean up previous player
    if (currentPlayer) {
        currentPlayer.destroy();
        currentPlayer = null;
    }

    videoPlayer.src = '';
    videoPlayer.style.display = 'block';

    if (url.includes('.m3u8')) {
        // HLS stream
        if (Hls.isSupported()) {
            currentPlayer = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });
            
            currentPlayer.loadSource(url);
            currentPlayer.attachMedia(videoPlayer);
            
            currentPlayer.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
                loadingOverlay.classList.add('hidden');
                videoPlayer.play().catch(err => {
                    console.error('Error playing video:', err);
                });
                
                // Populate quality selector
                if (data.levels && data.levels.length > 1) {
                    populateQualitySelector(data.levels);
                }
            });

            currentPlayer.on(Hls.Events.ERROR, function(event, data) {
                if (data.fatal) {
                    console.error('HLS error:', data);
                    loadingOverlay.classList.add('hidden');
                    showPlayerError();
                }
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            videoPlayer.src = url;
            videoPlayer.addEventListener('loadeddata', () => {
                loadingOverlay.classList.add('hidden');
            });
            videoPlayer.play().catch(err => {
                console.error('Error playing video:', err);
                loadingOverlay.classList.add('hidden');
                showPlayerError();
            });
        } else {
            loadingOverlay.classList.add('hidden');
            showPlayerError();
        }
    } else {
        // Direct stream
        videoPlayer.src = url;
        videoPlayer.addEventListener('loadeddata', () => {
            loadingOverlay.classList.add('hidden');
        });
        videoPlayer.play().catch(err => {
            console.error('Error playing video:', err);
            loadingOverlay.classList.add('hidden');
            showPlayerError();
        });
    }

    videoPlayer.onerror = function() {
        loadingOverlay.classList.add('hidden');
        showPlayerError();
    };
}

// Populate quality selector
function populateQualitySelector(levels) {
    streamQuality.innerHTML = '<option value="-1">Auto</option>';
    levels.forEach((level, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${level.height}p`;
        streamQuality.appendChild(option);
    });
    
    streamQuality.addEventListener('change', () => {
        if (currentPlayer) {
            currentPlayer.currentLevel = parseInt(streamQuality.value);
        }
    });
}

// Show player error
function showPlayerError() {
    playerError.classList.remove('hidden');
    videoPlayer.style.display = 'none';
    showToast('Unable to load this channel', 'error');
}

// Close video player
function closeVideoPlayer() {
    if (currentPlayer) {
        currentPlayer.destroy();
        currentPlayer = null;
    }
    videoPlayer.pause();
    videoPlayer.src = '';
    playerContainer.classList.add('hidden');
    playerError.classList.add('hidden');
    videoPlayer.style.display = 'block';
    loadingOverlay.classList.add('hidden');
    currentChannel = null;
}

// Toggle Picture in Picture
async function togglePictureInPicture() {
    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            await videoPlayer.requestPictureInPicture();
        }
    } catch (error) {
        console.error('PiP error:', error);
        showToast('Picture in Picture not supported', 'error');
    }
}

// Toggle Fullscreen
function toggleFullscreen() {
    const wrapper = document.querySelector('.video-wrapper');
    
    if (!document.fullscreenElement) {
        wrapper.requestFullscreen().catch(err => {
            console.error('Fullscreen error:', err);
        });
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Load theme
function loadTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Update channel count
function updateChannelCount() {
    channelCount.textContent = `${filteredChannels.length} channels`;
}

// Show/hide loading spinner
function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
        channelGrid.classList.add('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
        channelGrid.classList.remove('hidden');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    
    if (type === 'success') {
        toastIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    } else if (type === 'error') {
        toastIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    } else {
        toastIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
    }
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);