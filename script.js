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
const preloader = document.getElementById('preloader');

// Initialize the application with performance optimizations
async function init() {
    const startTime = performance.now();
    
    // Mark content as loading
    document.body.classList.remove('content-loaded');
    
    try {
        // Check if HLS.js is available (with retry for deferred loading)
        let hlsRetries = 0;
        const checkHLS = () => {
            if (typeof Hls === 'undefined' && hlsRetries < 10) {
                hlsRetries++;
                setTimeout(checkHLS, 100);
                return;
            }
            if (typeof Hls === 'undefined') {
                console.warn('HLS.js not loaded after retries. Some video streams may not work.');
                showToast('Video streaming library loading...', 'info');
            }
        };
        checkHLS();
        
        showLoading(true);
        
        // Load data with timeout to prevent hanging
        const loadingPromise = loadChannelsAndStreams();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Loading timeout')), 15000)
        );
        
        await Promise.race([loadingPromise, timeoutPromise]);
        
        setupEventListeners();
        loadTheme();
        loadUserPreferences(); // Load saved user preferences
        updateView(); // Initialize with proper view
        updateFavoritesCount();
        showLoading(false);
        
        // Mark content as loaded for CSS transitions
        document.body.classList.add('content-loaded');
        
        // Hide preloader with faster transition
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 300);
            }
        }, 200);
        
        // Set initial section subtitle
        if (sectionSubtitle) {
            sectionSubtitle.textContent = 'Browse all live TV channels from around the world';
        }
        
        // Log performance
        const loadTime = Math.round(performance.now() - startTime);
        console.log(`✅ Free TV initialized in ${loadTime}ms`);
        
        // Show welcome message for first-time users (delayed to not interfere with loading)
        if (!userPreferences.load('hasVisited')) {
            setTimeout(() => {
                showToast('Welcome to Free TV! Press ? for keyboard shortcuts.', 'info', 4000);
                userPreferences.save('hasVisited', true);
            }, 2000);
        }
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Failed to load channels. Please refresh the page.', 'error');
        showLoading(false);
        
        // Hide preloader even on error
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }
    }
}

// Load channels and streams data with caching and optimization
async function loadChannelsAndStreams(retryCount = 0) {
    const maxRetries = 2; // Reduced retries for faster loading
    const retryDelay = 500 * (retryCount + 1); // Faster retry delays
    
    // Check for cached data first
    const cacheKey = 'freetv_channels_cache';
    const cacheTimeKey = 'freetv_cache_time';
    const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes cache
    
    const cachedTime = userPreferences.load(cacheTimeKey, 0);
    const now = Date.now();
    
    if (now - cachedTime < CACHE_DURATION) {
        const cachedData = userPreferences.load(cacheKey);
        if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
            console.log('✅ Using cached channel data');
            allChannels = cachedData;
            filteredChannels = [...allChannels];
            populateFilters();
            updateChannelCount();
            return;
        }
    }
    
    try {
        // Use Promise.allSettled for better error handling
        const [channelsResult, streamsResult] = await Promise.allSettled([
            fetch(CHANNELS_API, { 
                cache: 'default',
                headers: { 'Accept': 'application/json' }
            }),
            fetch(STREAMS_API, { 
                cache: 'default',
                headers: { 'Accept': 'application/json' }
            })
        ]);

        let channelsResponse, streamsResponse;
        
        if (channelsResult.status === 'fulfilled' && channelsResult.value.ok) {
            channelsResponse = channelsResult.value;
        } else {
            throw new Error(`Channels API failed: ${channelsResult.reason || 'Unknown error'}`);
        }
        
        if (streamsResult.status === 'fulfilled' && streamsResult.value.ok) {
            streamsResponse = streamsResult.value;
        } else {
            throw new Error(`Streams API failed: ${streamsResult.reason || 'Unknown error'}`);
        }

        // Parse JSON in parallel
        const [channels, streams] = await Promise.all([
            channelsResponse.json(),
            streamsResponse.json()
        ]);

        // Validate data
        if (!Array.isArray(channels) || !Array.isArray(streams)) {
            throw new Error('Invalid data format received');
        }

        // Optimize data processing - only include channels with streams
        allChannels = channels.reduce((acc, channel) => {
            const channelStreams = streams.filter(stream => stream.channel === channel.id);
            if (channelStreams.length > 0) {
                acc.push({
                    ...channel,
                    streams: channelStreams.slice(0, 3) // Limit streams per channel for performance
                });
            }
            return acc;
        }, []);

        filteredChannels = [...allChannels];
        
        // Cache the processed data
        userPreferences.save(cacheKey, allChannels);
        userPreferences.save(cacheTimeKey, now);
        
        // Populate filters with the loaded data
        populateFilters();
        updateChannelCount();
        
        console.log(`✅ Loaded ${allChannels.length} channels with streams (${channels.length} total channels processed)`);
    } catch (error) {
        console.error('Error loading data:', error);
        
        if (retryCount < maxRetries) {
            console.log(`Retrying in ${retryDelay}ms... (${retryCount + 1}/${maxRetries})`);
            showToast(`Connection failed. Retrying... (${retryCount + 1}/${maxRetries})`, 'warning', 1500);
            
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return loadChannelsAndStreams(retryCount + 1);
        } else {
            // Try to use old cached data as fallback
            const fallbackData = userPreferences.load(cacheKey);
            if (fallbackData && Array.isArray(fallbackData) && fallbackData.length > 0) {
                console.log('Using stale cached data as fallback');
                allChannels = fallbackData;
                filteredChannels = [...allChannels];
                populateFilters();
                updateChannelCount();
                showToast('Using cached data. Some channels may be outdated.', 'warning');
                return;
            }
            
            showToast('Failed to load channels. Please check your internet connection and refresh.', 'error');
            throw error;
        }
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
        const debouncedFilter = debounce(filterChannels, 300);
        debouncedFilter();
        clearSearch.classList.toggle('hidden', !searchInput.value);
    });
    
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.classList.add('hidden');
        filterChannels();
    });
    
    categoryFilter.addEventListener('change', () => {
        filterChannels();
        saveCurrentFilters();
    });
    countryFilter.addEventListener('change', () => {
        filterChannels();
        saveCurrentFilters();
    });
    languageFilter.addEventListener('change', () => {
        filterChannels();
        saveCurrentFilters();
    });
    sortBy.addEventListener('change', () => {
        filterChannels();
        saveCurrentFilters();
    });
    
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
    
    // Save volume when it changes
    videoPlayer.addEventListener('volumechange', () => {
        if (!videoPlayer.muted) {
            userPreferences.save('volume', videoPlayer.volume);
        }
    });
    
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
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only handle keyboard shortcuts when not typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
        
        switch(e.key) {
            case 'Escape':
                if (!playerContainer.classList.contains('hidden')) {
                    closeVideoPlayer();
                }
                break;
            case 'f':
            case 'F':
                if (!playerContainer.classList.contains('hidden')) {
                    e.preventDefault();
                    toggleFullscreen();
                }
                break;
            case 'p':
            case 'P':
                if (!playerContainer.classList.contains('hidden')) {
                    e.preventDefault();
                    togglePictureInPicture();
                }
                break;
            case '/':
                e.preventDefault();
                searchInput.focus();
                break;
            case '?':
                e.preventDefault();
                showToast('Keyboard shortcuts: ESC=Close player, F=Fullscreen, P=Picture-in-Picture, /=Search', 'info');
                break;
        }
    });
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

// Render channels to the grid with virtual scrolling for performance
function renderChannels() {
    channelGrid.innerHTML = '';

    if (filteredChannels.length === 0) {
        noResults.classList.remove('hidden');
        channelGrid.classList.add('hidden');
        return;
    }

    noResults.classList.add('hidden');
    channelGrid.classList.remove('hidden');

    // Virtual scrolling for better performance with large datasets
    const INITIAL_LOAD = 50; // Load first 50 channels immediately
    const BATCH_SIZE = 25; // Load 25 more when scrolling near bottom
    
    let loadedChannels = 0;
    const fragment = document.createDocumentFragment();
    
    function renderBatch(startIndex = 0, count = INITIAL_LOAD) {
        const endIndex = Math.min(startIndex + count, filteredChannels.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const card = createChannelCard(filteredChannels[i]);
            fragment.appendChild(card);
        }
        
        if (fragment.children.length > 0) {
            channelGrid.appendChild(fragment);
        }
        
        loadedChannels = endIndex;
        
        // Setup intersection observer for infinite scrolling
        if (loadedChannels < filteredChannels.length) {
            setupInfiniteScroll();
        }
    }
    
    // Initial render
    renderBatch();
    
    // Setup lazy loading for images after initial render
    requestAnimationFrame(() => {
        setupLazyLoading();
    });
}

// Setup infinite scrolling for remaining channels
function setupInfiniteScroll() {
    const sentinel = document.createElement('div');
    sentinel.className = 'scroll-sentinel';
    sentinel.style.height = '10px';
    channelGrid.appendChild(sentinel);
    
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && loadedChannels < filteredChannels.length) {
            observer.unobserve(sentinel);
            sentinel.remove();
            
            // Render next batch
            const fragment = document.createDocumentFragment();
            const startIndex = loadedChannels;
            const endIndex = Math.min(startIndex + 25, filteredChannels.length);
            
            for (let i = startIndex; i < endIndex; i++) {
                const card = createChannelCard(filteredChannels[i]);
                fragment.appendChild(card);
            }
            
            channelGrid.appendChild(fragment);
            loadedChannels = endIndex;
            
            // Setup lazy loading for new images
            setupLazyLoading();
            
            // Continue if there are more channels
            if (loadedChannels < filteredChannels.length) {
                setupInfiniteScroll();
            }
        }
    }, {
        rootMargin: '100px'
    });
    
    observer.observe(sentinel);
}

// Setup optimized lazy loading for channel logo images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        // Disconnect existing observer if any
        if (window.channelImageObserver) {
            window.channelImageObserver.disconnect();
        }
        
        window.channelImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        // Preload image before setting src
                        const tempImg = new Image();
                        tempImg.onload = () => {
                            img.src = img.dataset.src;
                            img.style.opacity = '1';
                            img.removeAttribute('data-src');
                        };
                        tempImg.onerror = () => {
                            // Handle broken images gracefully
                            const logoDiv = img.parentElement;
                            logoDiv.classList.add('no-logo');
                            logoDiv.innerHTML = '<i class="fas fa-tv"></i>';
                            // Re-add favorite button if it existed
                            const favBtn = logoDiv.querySelector('.favorite-icon');
                            if (!favBtn) {
                                const card = logoDiv.closest('.channel-card');
                                const channelId = card.dataset.channelId;
                                const newFavBtn = createFavoriteButton(channelId);
                                logoDiv.appendChild(newFavBtn);
                            }
                        };
                        tempImg.src = img.dataset.src;
                        
                        window.channelImageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            window.channelImageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.style.opacity = '1';
        });
    }
}

// Create reusable favorite button
function createFavoriteButton(channelId) {
    const favBtn = document.createElement('button');
    favBtn.className = 'favorite-icon';
    favBtn.setAttribute('aria-label', 'Add to favorites');
    
    if (favorites.includes(channelId)) {
        favBtn.classList.add('active');
        favBtn.innerHTML = '<i class="fas fa-heart"></i>';
        favBtn.setAttribute('aria-label', 'Remove from favorites');
    } else {
        favBtn.innerHTML = '<i class="far fa-heart"></i>';
    }
    
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Add heartbeat animation
        favBtn.style.animation = 'heartBeat 0.3s ease';
        setTimeout(() => {
            favBtn.style.animation = '';
        }, 300);
        
        toggleFavorite(channelId);
        
        // Update the button state based on the current favorites array
        if (favorites.includes(channelId)) {
            favBtn.classList.add('active');
            favBtn.innerHTML = '<i class="fas fa-heart"></i>';
            favBtn.setAttribute('aria-label', 'Remove from favorites');
        } else {
            favBtn.classList.remove('active');
            favBtn.innerHTML = '<i class="far fa-heart"></i>';
            favBtn.setAttribute('aria-label', 'Add to favorites');
        }
    });
    
    return favBtn;
}

// Create channel card element with optimizations
function createChannelCard(channel) {
    const card = document.createElement('div');
    card.className = 'channel-card';
    card.setAttribute('data-channel-id', channel.id);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Watch ${channel.name}`);
    
    const logoDiv = document.createElement('div');
    logoDiv.className = 'channel-logo';
    
    // Favorite button
    const favBtn = createFavoriteButton(channel.id);
    
    if (channel.logo) {
        const img = document.createElement('img');
        img.dataset.src = channel.logo; // Use data-src for lazy loading
        img.alt = channel.name;
        img.loading = 'lazy';
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.onload = () => {
            img.style.opacity = '1';
        };
        
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
    
    // Add keyboard support for channel cards
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            playChannel(channel);
        }
    });
    
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

// Load stream with HLS.js support and improved error handling
function loadStream(url) {
    // Clean up previous player
    if (currentPlayer) {
        currentPlayer.destroy();
        currentPlayer = null;
    }

    videoPlayer.src = '';
    videoPlayer.style.display = 'block';
    playerError.classList.add('hidden');
    loadingOverlay.classList.remove('hidden');
    
    // Set loading timeout
    const loadingTimeout = setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        showPlayerError();
        showToast('Stream loading timeout. Please try another channel.', 'warning');
    }, 30000); // 30 seconds timeout

    // Clear timeout when stream loads successfully
    const clearTimeoutOnSuccess = () => {
        clearTimeout(loadingTimeout);
        loadingOverlay.classList.add('hidden');
    };

    if (url.includes('.m3u8')) {
        // HLS stream
        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            currentPlayer = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                maxLoadingDelay: 4,
                maxBufferLength: 30,
                maxBufferSize: 60 * 1000 * 1000,
            });
            
            currentPlayer.loadSource(url);
            currentPlayer.attachMedia(videoPlayer);
            
            currentPlayer.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
                clearTimeoutOnSuccess();
                videoPlayer.play().catch(err => {
                    console.error('Error playing video:', err);
                    showPlayerError();
                    showToast('Failed to start playback. Stream may be unavailable.', 'error');
                });
                
                // Populate quality selector
                if (data.levels && data.levels.length > 1) {
                    populateQualitySelector(data.levels);
                }
            });

            currentPlayer.on(Hls.Events.ERROR, function(event, data) {
                console.error('HLS error:', data);
                clearTimeout(loadingTimeout);
                loadingOverlay.classList.add('hidden');
                
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            showToast('Network error: Unable to load stream', 'error');
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            showToast('Media error: Stream format not supported', 'error');
                            break;
                        default:
                            showToast('Playback error: Stream unavailable', 'error');
                            break;
                    }
                    showPlayerError();
                }
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            videoPlayer.src = url;
            videoPlayer.addEventListener('loadeddata', clearTimeoutOnSuccess, { once: true });
            videoPlayer.addEventListener('error', () => {
                clearTimeout(loadingTimeout);
                loadingOverlay.classList.add('hidden');
                showPlayerError();
                showToast('Failed to load stream', 'error');
            }, { once: true });
            videoPlayer.play().catch(err => {
                console.error('Error playing video:', err);
                clearTimeout(loadingTimeout);
                loadingOverlay.classList.add('hidden');
                showPlayerError();
                showToast('Failed to start playback', 'error');
            });
        } else {
            // HLS.js not available, try direct playback anyway
            console.warn('HLS.js not available, attempting direct playback');
            videoPlayer.src = url;
            videoPlayer.addEventListener('loadeddata', clearTimeoutOnSuccess, { once: true });
            videoPlayer.addEventListener('error', () => {
                clearTimeout(loadingTimeout);
                loadingOverlay.classList.add('hidden');
                showPlayerError();
                showToast('HLS.js not available and direct playback failed', 'error');
            }, { once: true });
            videoPlayer.play().catch(err => {
                console.error('Error playing video (HLS.js unavailable):', err);
                clearTimeout(loadingTimeout);
                loadingOverlay.classList.add('hidden');
                showPlayerError();
                showToast('Failed to start playback', 'error');
            });
        }
    } else {
        // Direct stream
        videoPlayer.src = url;
        videoPlayer.addEventListener('loadeddata', clearTimeoutOnSuccess, { once: true });
        videoPlayer.addEventListener('error', () => {
            clearTimeout(loadingTimeout);
            loadingOverlay.classList.add('hidden');
            showPlayerError();
            showToast('Failed to load direct stream', 'error');
        }, { once: true });
        videoPlayer.play().catch(err => {
            console.error('Error playing video:', err);
            clearTimeout(loadingTimeout);
            loadingOverlay.classList.add('hidden');
            showPlayerError();
            showToast('Failed to start playback', 'error');
        });
    }
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

// User preferences management
const userPreferences = {
    save: function(key, value) {
        try {
            localStorage.setItem(`freetv_${key}`, JSON.stringify(value));
        } catch (error) {
            console.warn('Failed to save preference:', key, error);
        }
    },
    
    load: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`freetv_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Failed to load preference:', key, error);
            return defaultValue;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(`freetv_${key}`);
        } catch (error) {
            console.warn('Failed to remove preference:', key, error);
        }
    }
};

// Load saved user preferences
function loadUserPreferences() {
    // Load theme preference
    const savedTheme = userPreferences.load('theme', 'dark');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Load last used filters
    const lastFilters = userPreferences.load('filters', {});
    if (lastFilters.category) categoryFilter.value = lastFilters.category;
    if (lastFilters.country) countryFilter.value = lastFilters.country;
    if (lastFilters.language) languageFilter.value = lastFilters.language;
    if (lastFilters.sortBy) sortBy.value = lastFilters.sortBy;
    
    // Load volume preference
    const savedVolume = userPreferences.load('volume', 0.8);
    if (videoPlayer) {
        videoPlayer.volume = savedVolume;
    }
}

// Save current filter state
function saveCurrentFilters() {
    const currentFilters = {
        category: categoryFilter.value,
        country: countryFilter.value,
        language: languageFilter.value,
        sortBy: sortBy.value
    };
    userPreferences.save('filters', currentFilters);
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
    userPreferences.save('theme', isLight ? 'light' : 'dark');
    showToast(`Switched to ${isLight ? 'light' : 'dark'} theme`, 'success', 2000);
}

// Load theme
function loadTheme() {
    const theme = userPreferences.load('theme', 'dark');
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

// Show toast notification with auto-dismiss and progress bar
function showToast(message, type = 'info', duration = 3000) {
    if (!toast) return;
    
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    if (!toastIcon || !toastMessage) return;
    
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    
    // Set appropriate icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toastIcon.innerHTML = `<i class="${icons[type] || icons.info}"></i>`;
    
    toast.classList.remove('hidden');
    
    // Auto-dismiss after duration
    const dismissTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
    
    // Allow manual dismissal by clicking
    const dismissHandler = () => {
        clearTimeout(dismissTimeout);
        toast.classList.add('hidden');
        toast.removeEventListener('click', dismissHandler);
    };
    
    toast.addEventListener('click', dismissHandler);
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
document.addEventListener('DOMContentLoaded', () => {
    // Register service worker for caching
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('✅ Service Worker registered'))
            .catch(err => console.log('❌ Service Worker registration failed:', err));
    }
    
    // Initialize the app
    init();
});