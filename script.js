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
        // Hide preloader
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => preloader.remove(), 300);
            }, 500);
        }
        
        // Load essential UI first for faster perceived performance
        setupEventListeners();
        loadTheme();
        updateFavoritesCount();
        
        // Set initial section subtitle immediately
        if (sectionSubtitle) {
            sectionSubtitle.textContent = 'Browse all live TV channels from around the world';
        }
        
        // Load mock data immediately for instant UI
        loadMockData();
        updateView();
        showLoading(false);
        
        // Try to load real data in background
        setTimeout(async () => {
            try {
                console.log('Loading real channel data in background...');
                await loadChannelsAndStreams();
                updateView();
                showToast('Live channel data loaded!', 'success');
            } catch (error) {
                console.log('Using demo data - real API unavailable');
            }
        }, 2000); // Load real data after 2 seconds
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Loading demo channels...', 'info');
        loadMockData();
        updateView();
        showLoading(false);
    }
}

// Load channels and streams data
async function loadChannelsAndStreams() {
    try {
        // Add timeout to API calls
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const [channelsResponse, streamsResponse] = await Promise.all([
            fetch(CHANNELS_API, { signal: controller.signal }),
            fetch(STREAMS_API, { signal: controller.signal })
        ]);

        clearTimeout(timeoutId);

        if (!channelsResponse.ok || !streamsResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        allChannels = await channelsResponse.json();
        allStreams = await streamsResponse.json();

        // Optimize data processing - limit initial channels for faster loading
        const limitedChannels = allChannels.slice(0, 500); // Load first 500 channels for faster initial load

        // Merge channels with their streams
        allChannels = limitedChannels.map(channel => {
            const channelStreams = allStreams.filter(stream => stream.channel === channel.id);
            return {
                ...channel,
                streams: channelStreams
            };
        }).filter(channel => channel.streams && channel.streams.length > 0);

        filteredChannels = [...allChannels];
        
        populateFilters();
        updateChannelCount();
        
        showToast(`Loaded ${allChannels.length} channels successfully`, 'success');
    } catch (error) {
        console.error('Error loading data:', error);
        throw error; // Let init handle the fallback
    }
}

// Load mock data for testing when API is unavailable
function loadMockData() {
    console.log('Loading mock data for testing...');
    
    allChannels = [
        {
            id: 'mock-channel-1',
            name: 'BBC News',
            logo: null,
            categories: ['News'],
            countries: ['GB'],
            languages: ['English'],
            alt_names: ['BBC News Channel']
        },
        {
            id: 'mock-channel-2',
            name: 'CNN International',
            logo: null,
            categories: ['News'],
            countries: ['US'],
            languages: ['English'],
            alt_names: ['CNN']
        },
        {
            id: 'mock-channel-3',
            name: 'France 24',
            logo: null,
            categories: ['News'],
            countries: ['FR'],
            languages: ['French', 'English'],
            alt_names: ['France24']
        },
        {
            id: 'mock-channel-4',
            name: 'Deutsche Welle',
            logo: null,
            categories: ['News'],
            countries: ['DE'],
            languages: ['German', 'English'],
            alt_names: ['DW']
        },
        {
            id: 'mock-channel-5',
            name: 'NHK World',
            logo: null,
            categories: ['News'],
            countries: ['JP'],
            languages: ['Japanese', 'English'],
            alt_names: ['NHK World Japan']
        },
        {
            id: 'mock-channel-6',
            name: 'ESPN Sports',
            logo: null,
            categories: ['Sports'],
            countries: ['US'],
            languages: ['English'],
            alt_names: ['ESPN']
        },
        {
            id: 'mock-channel-7',
            name: 'Eurosport',
            logo: null,
            categories: ['Sports'],
            countries: ['FR'],
            languages: ['French', 'English'],
            alt_names: ['Eurosport 1']
        },
        {
            id: 'mock-channel-8',
            name: 'Sky Sports',
            logo: null,
            categories: ['Sports'],
            countries: ['GB'],
            languages: ['English'],
            alt_names: ['Sky Sports Main Event']
        },
        {
            id: 'mock-channel-9',
            name: 'RAI Sport',
            logo: null,
            categories: ['Sports'],
            countries: ['IT'],
            languages: ['Italian'],
            alt_names: ['Rai Sport']
        },
        {
            id: 'mock-channel-10',
            name: 'TV Globo',
            logo: null,
            categories: ['Entertainment'],
            countries: ['BR'],
            languages: ['Portuguese'],
            alt_names: ['Globo']
        },
        {
            id: 'mock-channel-11',
            name: 'Canal+',
            logo: null,
            categories: ['Entertainment'],
            countries: ['FR'],
            languages: ['French'],
            alt_names: ['Canal Plus']
        },
        {
            id: 'mock-channel-12',
            name: 'RTL Television',
            logo: null,
            categories: ['Entertainment'],
            countries: ['DE'],
            languages: ['German'],
            alt_names: ['RTL']
        },
        {
            id: 'mock-channel-13',
            name: 'Televisa',
            logo: null,
            categories: ['Entertainment'],
            countries: ['MX'],
            languages: ['Spanish'],
            alt_names: ['Canal de las Estrellas']
        },
        {
            id: 'mock-channel-14',
            name: 'CBC Television',
            logo: null,
            categories: ['Entertainment'],
            countries: ['CA'],
            languages: ['English', 'French'],
            alt_names: ['CBC']
        },
        {
            id: 'mock-channel-15',
            name: 'ABC Australia',
            logo: null,
            categories: ['Entertainment'],
            countries: ['AU'],
            languages: ['English'],
            alt_names: ['ABC TV']
        },
        {
            id: 'mock-channel-16',
            name: 'CCTV-4',
            logo: null,
            categories: ['News'],
            countries: ['CN'],
            languages: ['Chinese'],
            alt_names: ['China Central Television']
        },
        {
            id: 'mock-channel-17',
            name: 'Russia Today',
            logo: null,
            categories: ['News'],
            countries: ['RU'],
            languages: ['Russian', 'English'],
            alt_names: ['RT']
        },
        {
            id: 'mock-channel-18',
            name: 'Al Jazeera English',
            logo: null,
            categories: ['News'],
            countries: ['QA'],
            languages: ['English'],
            alt_names: ['Al Jazeera']
        },
        {
            id: 'mock-channel-19',
            name: 'Doordarshan',
            logo: null,
            categories: ['Entertainment'],
            countries: ['IN'],
            languages: ['Hindi', 'English'],
            alt_names: ['DD National']
        },
        {
            id: 'mock-channel-20',
            name: 'KBS World',
            logo: null,
            categories: ['Entertainment'],
            countries: ['KR'],
            languages: ['Korean'],
            alt_names: ['Korean Broadcasting System']
        }
    ];
    
    allStreams = [
        {
            channel: 'mock-channel-1',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-2',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-3',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-4',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-5',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-6',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-7',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-8',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-9',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-10',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-11',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-12',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-13',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-14',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-15',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-16',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-17',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-18',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-19',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            quality: '720p'
        },
        {
            channel: 'mock-channel-20',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            quality: '720p'
        }
    ];
    
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
    
    showToast('Using demo channels for testing', 'info');
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
        const debouncedFilter = debounce(filterChannels, 300);
        debouncedFilter();
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
        // Add visual feedback
        favoriteBtn.style.animation = 'heartBeat 0.3s ease';
        setTimeout(() => {
            favoriteBtn.style.animation = '';
        }, 300);
        
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
    
    // Enhanced scroll handling for mobile
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        // Show/hide scroll to top button
        if (window.scrollY > 500) {
            scrollToTop.classList.remove('hidden');
        } else {
            scrollToTop.classList.add('hidden');
        }
        
        // Clear timeout if it exists
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Set new timeout for lazy loading check
        scrollTimeout = setTimeout(() => {
            // Trigger lazy loading if near bottom
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
                if (window.currentScrollHandler) {
                    window.currentScrollHandler();
                }
            }
        }, 100);
    });
    
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Touch event optimizations for mobile
    let touchStartY = 0;
    let touchStartX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        // Prevent pull-to-refresh on iOS when scrolling content
        if (window.scrollY === 0 && e.touches[0].clientY > touchStartY) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Keyboard navigation support
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Handle orientation change for mobile devices
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            // Recalculate layout after orientation change
            if (window.innerWidth < 768) {
                updateMobileLayout();
            }
        }, 100);
    });
    
    // Handle resize for responsive behavior
    window.addEventListener('resize', debounce(() => {
        updateResponsiveLayout();
    }, 250));
}

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
    // ESC key closes video player
    if (e.key === 'Escape' && !playerContainer.classList.contains('hidden')) {
        closeVideoPlayer();
        e.preventDefault();
    }
    
    // Space key for play/pause (when video player is open)
    if (e.key === ' ' && !playerContainer.classList.contains('hidden') && videoPlayer) {
        if (videoPlayer.paused) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }
        e.preventDefault();
    }
    
    // F key for fullscreen
    if (e.key === 'f' && !playerContainer.classList.contains('hidden')) {
        toggleFullscreen();
        e.preventDefault();
    }
    
    // Search focus with Ctrl+F or /
    if ((e.ctrlKey && e.key === 'f') || e.key === '/') {
        searchInput.focus();
        e.preventDefault();
    }
}

// Update layout for mobile devices
function updateMobileLayout() {
    if (window.innerWidth < 768) {
        // Ensure proper video player sizing on mobile
        if (!playerContainer.classList.contains('hidden')) {
            const videoWrapper = document.querySelector('.video-wrapper');
            if (videoWrapper) {
                const aspectRatio = 16 / 9;
                const maxWidth = window.innerWidth - 40; // Account for padding
                const maxHeight = window.innerHeight * 0.4; // Max 40% of viewport height
                
                const calculatedHeight = maxWidth / aspectRatio;
                const finalHeight = Math.min(calculatedHeight, maxHeight);
                
                videoWrapper.style.height = `${finalHeight}px`;
            }
        }
    }
}

// Update responsive layout on resize
function updateResponsiveLayout() {
    updateMobileLayout();
    
    // Re-render channel grid if needed
    if (filteredChannels.length > 0) {
        renderChannels();
    }
}

// Update view based on selection
function updateView() {
    // Update active states
    document.querySelectorAll('.quick-access-list li').forEach(li => li.classList.remove('active'));
    
    if (currentView === 'all') {
        showAllChannels.classList.add('active');
        sectionTitle.textContent = 'Available Channels';
        if (sectionSubtitle) {
            sectionSubtitle.textContent = 'Browse all live TV channels from around the world';
        }
        filteredChannels = [...allChannels];
    } else if (currentView === 'favorites') {
        showFavorites.classList.add('active');
        sectionTitle.textContent = 'My Favorites';
        if (sectionSubtitle) {
            sectionSubtitle.textContent = 'Your favorite channels in one place';
        }
        filteredChannels = allChannels.filter(ch => favorites.includes(ch.id));
    } else if (currentView === 'recent') {
        showRecent.classList.add('active');
        sectionTitle.textContent = 'Recently Watched';
        if (sectionSubtitle) {
            sectionSubtitle.textContent = 'Continue where you left off';
        }
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

// Render channels to the grid with lazy loading
function renderChannels() {
    channelGrid.innerHTML = '';

    if (filteredChannels.length === 0) {
        noResults.classList.remove('hidden');
        channelGrid.classList.add('hidden');
        return;
    }

    noResults.classList.add('hidden');
    channelGrid.classList.remove('hidden');

    // Implement virtual scrolling for better performance
    const itemsPerPage = 50;
    const totalPages = Math.ceil(filteredChannels.length / itemsPerPage);
    let currentPage = 0;

    function loadPage(page) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredChannels.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const channel = filteredChannels[i];
            const card = createChannelCard(channel);
            channelGrid.appendChild(card);
        }
    }

    // Load first page immediately
    loadPage(currentPage);

    // Add scroll listener for infinite loading
    const scrollHandler = debounce(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
            if (currentPage < totalPages - 1) {
                currentPage++;
                loadPage(currentPage);
            }
        }
    }, 200);

    // Remove previous scroll listener and add new one
    window.removeEventListener('scroll', window.currentScrollHandler);
    window.currentScrollHandler = scrollHandler;
    window.addEventListener('scroll', scrollHandler);
}

// Create channel card element with optimized performance
function createChannelCard(channel) {
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    const card = document.createElement('div');
    card.className = 'channel-card';
    card.setAttribute('data-channel-id', channel.id);
    
    // Build HTML string instead of creating multiple DOM elements
    const isFavorite = favorites.includes(channel.id);
    const heartIcon = isFavorite ? 'fas fa-heart' : 'far fa-heart';
    const activeClass = isFavorite ? ' active' : '';
    
    const logoHTML = channel.logo 
        ? `<img src="${channel.logo}" alt="${channel.name}" loading="lazy" onerror="this.parentElement.classList.add('no-logo'); this.parentElement.innerHTML='<i class=\\"fas fa-tv\\"></i><button class=\\"favorite-icon${activeClass}\\" data-channel-id=\\"${channel.id}\\"><i class=\\"${heartIcon}\\"></i></button>';">`
        : '<i class="fas fa-tv"></i>';
    
    const categoryHTML = channel.categories && channel.categories.length > 0 
        ? `<span class="channel-tag">${channel.categories[0]}</span>` 
        : '';
    
    const countryHTML = channel.countries && channel.countries.length > 0 
        ? `<div class="channel-country">
            <span class="country-flag">${getCountryFlag(channel.countries[0].toLowerCase())}</span>
            <span>${channel.countries[0]}</span>
           </div>`
        : '';
    
    card.innerHTML = `
        <div class="channel-logo ${!channel.logo ? 'no-logo' : ''}">
            ${logoHTML}
            <button class="favorite-icon${activeClass}" data-channel-id="${channel.id}">
                <i class="${heartIcon}"></i>
            </button>
        </div>
        <div class="channel-info">
            <div class="channel-name" title="${channel.name}">${channel.name}</div>
            <div class="channel-meta">
                ${categoryHTML}
                ${countryHTML}
            </div>
        </div>
    `;
    
    // Add event listeners using event delegation for better performance
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.favorite-icon')) {
            playChannel(channel);
        }
    });
    
    // Handle favorite button clicks
    const favBtn = card.querySelector('.favorite-icon');
    if (favBtn) {
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Add heartbeat animation
            favBtn.style.animation = 'heartBeat 0.3s ease';
            setTimeout(() => {
                favBtn.style.animation = '';
            }, 300);
            
            toggleFavorite(channel.id);
        });
    }
    
    return card;
}

// Get country flag emoji
function getCountryFlag(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '🌐';
    
    try {
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        
        return String.fromCodePoint(...codePoints);
    } catch (error) {
        console.log('Flag error for country code:', countryCode);
        return '🌐';
    }
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
    
    // Update all favorite icons for this channel
    updateAllFavoriteIcons(channelId);
    
    // Update current view if in favorites mode
    if (currentView === 'favorites') {
        updateView();
    }
}

// Update all favorite icons for a specific channel
function updateAllFavoriteIcons(channelId) {
    const isFavorite = favorites.includes(channelId);
    
    // Update all channel card favorite buttons
    document.querySelectorAll('.channel-card').forEach(card => {
        const cardChannelId = card.getAttribute('data-channel-id');
        if (cardChannelId === channelId) {
            const favBtn = card.querySelector('.favorite-icon');
            if (favBtn) {
                if (isFavorite) {
                    favBtn.classList.add('active');
                    favBtn.innerHTML = '<i class="fas fa-heart"></i>';
                } else {
                    favBtn.classList.remove('active');
                    favBtn.innerHTML = '<i class="far fa-heart"></i>';
                }
            }
        }
    });
    
    // Update current channel favorite button if it's the same channel
    if (currentChannel && currentChannel.id === channelId && favoriteCurrentChannel) {
        if (isFavorite) {
            favoriteCurrentChannel.classList.add('active');
            favoriteCurrentChannel.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            favoriteCurrentChannel.classList.remove('active');
            favoriteCurrentChannel.innerHTML = '<i class="far fa-heart"></i>';
        }
    }
}

// Toggle current channel favorite
function toggleCurrentChannelFavorite() {
    if (!currentChannel) return;
    
    // Add heartbeat animation
    if (favoriteCurrentChannel) {
        favoriteCurrentChannel.style.animation = 'heartBeat 0.3s ease';
        setTimeout(() => {
            favoriteCurrentChannel.style.animation = '';
        }, 300);
    }
    
    toggleFavorite(currentChannel.id);
    
    if (favoriteCurrentChannel) {
        if (favorites.includes(currentChannel.id)) {
            favoriteCurrentChannel.classList.add('active');
            favoriteCurrentChannel.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            favoriteCurrentChannel.classList.remove('active');
            favoriteCurrentChannel.innerHTML = '<i class="far fa-heart"></i>';
        }
    }
}

// Update favorites count
function updateFavoritesCount() {
    const count = favorites.length;
    
    // Update header favorites count
    const favCountElement = document.querySelector('.favorites-count');
    if (favCountElement) {
        favCountElement.textContent = count;
    }
    
    // Update sidebar badge
    const badgeElement = document.querySelector('#showFavorites .badge');
    if (badgeElement) {
        badgeElement.textContent = count;
    }
    
    // Update any other favorite counters
    const allBadges = document.querySelectorAll('.badge');
    allBadges.forEach(badge => {
        if (badge.closest('#showFavorites')) {
            badge.textContent = count;
        }
    });
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
        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
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
            // HLS.js not available, try direct playback anyway
            console.warn('HLS.js not available, attempting direct playback');
            videoPlayer.src = url;
            videoPlayer.addEventListener('loadeddata', () => {
                loadingOverlay.classList.add('hidden');
            });
            videoPlayer.play().catch(err => {
                console.error('Error playing video (HLS.js unavailable):', err);
                loadingOverlay.classList.add('hidden');
                showPlayerError();
            });
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
    if (themeToggle) {
        themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Load theme
function loadTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    } else {
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
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

// Show toast notification with throttling
let toastTimeout;
function showToast(message, type = 'info') {
    if (!toast) return;
    
    // Clear previous timeout to prevent spam
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    if (!toastIcon || !toastMessage) return;
    
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    
    // Use CSS classes instead of changing innerHTML for better performance
    toastIcon.className = `toast-icon fas ${
        type === 'success' ? 'fa-check-circle' : 
        type === 'error' ? 'fa-exclamation-circle' : 
        'fa-info-circle'
    }`;
    
    toast.classList.remove('hidden');
    
    toastTimeout = setTimeout(() => {
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