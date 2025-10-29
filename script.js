// Configuration
const CONFIG = {
    m3uUrl: 'https://iptv-org.github.io/iptv/index.m3u',
    cacheTime: 3600000, // 1 hour
    // Official Dialog TV 125 channels from https://www.dialog.lk/dialog-television/channels
    dialogChannels: [
        // Sri Lankan Channels (Local)
        'sirasa tv', 'hiru tv', 'itn', 'swarnavahini', 'derana', 'rupavahini', 
        'tv1', 'charana tv', 'shakthi tv', 'vasantham tv', 'siyatha tv', 
        'ada derana', 'supreme tv', 'virasat tv', 'nethra tv', 'tv lanka',
        'eye tv', 'buddhist tv', 'shraddha tv', 'itv digital',
        
        // Entertainment (Indian/International)
        'zee tv', 'star plus', 'star vijay', 'sun tv', 'colors', 
        'sony entertainment', 'sab tv', 'star utsav', 'rishtey',
        'zee tamil', 'kalaignar', 'jaya tv', 'raj tv', 'kalaignar murasu',
        'polimer tv', 'raj digital plus', 'malai murasu', 'thanthi tv',
        'vendhar tv', 'captain tv', 'jaya max', 'sun life', 'gemini',
        'etv plus', 'etv telugu', 'gemini movies', 'maa tv', 'zee telugu',
        
        // Movies Channels
        'zee cinema', 'star gold', 'sony max', 'zee thirai', '&pictures',
        'movies now', 'star gold select', 'sony wah', 'zee action',
        'zee bollywood', 'b4u movies', 'b4u music', 'zee classic',
        'jaya movie', 'sun music', 'isai aruvi', 'adithya tv',
        'raj musix', 'star gold 2', 'colors cineplex', 'sony max 2',
        
        // Sports Channels
        'star sports 1', 'star sports 2', 'star sports 3', 'star sports select',
        'sony six', 'sony ten 1', 'sony ten 2', 'sony ten 3', 'sony ten golf',
        'ten sports', 'euro sport', 'dd sports', 'wwe network',
        'star sports first', 'sony espn', 'dsport',
        
        // News Channels
        'cnn', 'bbc world news', 'al jazeera', 'sky news', 'france 24',
        'dw', 'cctv', 'cgtn', 'nhk world', 'trt world', 'arirang',
        'news first', 'hiru news', 'derana news', 'sirasa news', 
        'itv news', 'tv1 news', 'siyatha news', 'capital tv',
        'times now', 'news 18', 'republic tv', 'ndtv 24x7', 'india today',
        'zee news', 'aaj tak', 'news7 tamil', 'puthiya thalaimurai',
        
        // Kids & Family
        'cartoon network', 'pogo', 'nick', 'nickelodeon', 'sonic', 
        'discovery kids', 'disney channel', 'disney junior', 'baby tv', 
        'chutti tv', 'kochu tv', 'hungama', 'nick jr',
        
        // Music & Entertainment
        'mtv', 'vh1', 'zoom', 'mtv beats', '9xm', '9x jalwa', 
        '9x tashan', 'sirippoli', 'mastiii', 'zing',
        
        // Knowledge & Documentary
        'discovery channel', 'discovery science', 'discovery turbo', 
        'animal planet', 'national geographic', 'nat geo wild', 
        'history tv18', 'tlc', 'travel xp', 'fox life',
        'sony bbc earth', 'epic tv', 'living foodz',
        
        // Lifestyle & Others
        'star world', 'comedy central', 'axn', 'fox movies', 'warner',
        '&prive', 'star movies', 'hbo', 'fox action movies',
        'romance tv', 'fashion tv', 'e24', 'care world', 'goodness tv'
    ],
    categoryKeywords: {
        sports: ['sport', 'cricket', 'football', 'soccer', 'star sports', 'sony six', 'sony ten', 'wwe', 'euro', 'dd sports', 'espn', 'golf', 'dsport'],
        movies: ['movie', 'cinema', 'max', 'gold', 'thirai', 'film', 'pictures', 'cineplex', 'hbo'],
        news: ['news', 'cnn', 'bbc', 'sky news', 'al jazeera', 'france 24', 'cgtn', 'trt', 'times now', 'ndtv', 'aaj tak', 'republic', 'capital'],
        kids: ['kids', 'cartoon', 'disney', 'nick', 'pogo', 'baby', 'children', 'chutti', 'kochu', 'junior', 'hungama', 'sonic'],
        music: ['music', 'mtv', 'vh1', 'zoom', 'beats', '9xm', '9x', 'sirippoli', 'mastiii', 'zing', 'aruvi']
    }
};

// Global State
const state = {
    allChannels: [],
    filteredChannels: [],
    currentFilter: 'all',
    searchQuery: '',
    isLoading: false
};

// DOM Elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    channelsContainer: document.getElementById('channelsContainer'),
    playerModal: document.getElementById('playerModal'),
    videoPlayer: document.getElementById('videoPlayer'),
    modalChannelName: document.getElementById('modalChannelName'),
    modalChannelGroup: document.getElementById('modalChannelGroup'),
    modalClose: document.querySelector('.modal-close'),
    channelCount: document.getElementById('channelCount'),
    categoryCount: document.getElementById('categoryCount'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    noResults: document.getElementById('noResults')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadChannels();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    elements.searchInput.addEventListener('input', handleSearch);
    elements.filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    elements.modalClose.addEventListener('click', closeModal);
    elements.playerModal.addEventListener('click', (e) => {
        if (e.target === elements.playerModal) closeModal();
    });
}

// Load Channels from M3U
async function loadChannels() {
    try {
        showLoading(true);
        hideError();

        // Check cache
        const cached = getCachedChannels();
        if (cached) {
            state.allChannels = cached;
            renderChannels();
            showLoading(false);
            return;
        }

        // Fetch from URL
        const response = await fetch(CONFIG.m3uUrl, {
            headers: {
                'Accept': 'application/x-mpegURL, text/plain',
            }
        });

        if (!response.ok) throw new Error('Failed to fetch channels');

        const m3uContent = await response.text();
        const channels = parseM3U(m3uContent);
        
        // Filter for Dialog TV channels
        state.allChannels = filterDialogChannels(channels);
        
        // Cache channels
        cacheChannels(state.allChannels);
        
        renderChannels();
    } catch (error) {
        console.error('Error loading channels:', error);
        showError('Failed to load channels. Please refresh the page.');
    } finally {
        showLoading(false);
    }
}

// Parse M3U Format
function parseM3U(content) {
    const lines = content.split('\n');
    const channels = [];
    let currentChannel = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('#EXTINF:')) {
            currentChannel = parseExtinf(line);
        } else if (line.startsWith('http') && currentChannel) {
            currentChannel.url = line;
            channels.push(currentChannel);
            currentChannel = null;
        }
    }

    return channels;
}

// Parse EXTINF line
function parseExtinf(line) {
    const channel = {
        name: '',
        group: '',
        logo: '',
        url: '',
        tvgId: '',
        tvgName: ''
    };

    // Extract attributes using regex
    const logoMatch = line.match(/tvg-logo="([^"]*)/);
    const groupMatch = line.match(/group-title="([^"]*)"/);
    const idMatch = line.match(/tvg-id="([^"]*)"/);
    const nameMatch = line.match(/tvg-name="([^"]*)"/);

    if (logoMatch) channel.logo = logoMatch[1];
    if (groupMatch) channel.group = groupMatch[1];
    if (idMatch) channel.tvgId = idMatch[1];
    if (nameMatch) channel.tvgName = nameMatch[1];

    // Extract channel name (after last comma)
    const nameStart = line.lastIndexOf(',');
    if (nameStart !== -1) {
        channel.name = line.substring(nameStart + 1).trim();
    }

    return channel;
}

// Show All Channels (No Filtering)
function filterDialogChannels(channels) {
    // Return all channels without filtering
    return channels.sort((a, b) => a.name.localeCompare(b.name));
}

// Determine Category
function getCategory(channel) {
    const searchText = (channel.name + ' ' + channel.group).toLowerCase();
    
    for (const [category, keywords] of Object.entries(CONFIG.categoryKeywords)) {
        if (keywords.some(keyword => searchText.includes(keyword))) {
            return category;
        }
    }
    
    return 'other';
}

// Render Channels
function renderChannels() {
    const channels = getFilteredChannels();
    
    elements.channelsContainer.innerHTML = '';
    
    if (channels.length === 0) {
        elements.noResults.style.display = 'block';
        return;
    }
    
    elements.noResults.style.display = 'none';
    
    channels.forEach(channel => {
        const card = createChannelCard(channel);
        elements.channelsContainer.appendChild(card);
    });

    updateStats();
}

// Create Channel Card
function createChannelCard(channel) {
    const card = document.createElement('div');
    card.className = 'channel-card';
    card.setAttribute('data-category', getCategory(channel));
    
    const category = getCategory(channel);
    const categoryIcon = getCategoryIcon(category);

    card.innerHTML = `
        <div class="channel-thumb">
            ${channel.logo ? `<img src="${channel.logo}" alt="${channel.name}" loading="lazy" onerror="this.style.display='none'">` : ''}
            <div class="channel-thumb-icon">${categoryIcon}</div>
            <button class="play-button" title="Play">▶</button>
        </div>
        <div class="channel-info">
            <div>
                <div class="channel-name">${escapeHtml(channel.name)}</div>
                <div class="channel-group">${escapeHtml(channel.group || 'Dialog TV')}</div>
            </div>
            <div>
                <span class="channel-badge">${channel.url ? '📺 Live' : 'Offline'}</span>
            </div>
        </div>
    `;

    const playButton = card.querySelector('.play-button');
    playButton.addEventListener('click', () => playChannel(channel));
    card.addEventListener('click', () => playChannel(channel));

    return card;
}

// Get Category Icon
function getCategoryIcon(category) {
    const icons = {
        sports: '⚽',
        movies: '🎬',
        news: '📰',
        kids: '🎨',
        music: '🎵',
        other: '📺'
    };
    return icons[category] || '📺';
}

// Play Channel
function playChannel(channel) {
    if (!channel.url) {
        showError('This channel is currently offline');
        return;
    }

    elements.modalChannelName.textContent = channel.name;
    elements.modalChannelGroup.textContent = channel.group || 'Dialog TV';
    
    // Set video source with HLS support
    const source = elements.videoPlayer.querySelector('source');
    source.src = channel.url;
    source.type = 'application/x-mpegURL';
    
    // Reload and play
    elements.videoPlayer.load();
    elements.videoPlayer.play().catch(err => {
        console.error('Play error:', err);
        showError('Unable to play this stream. It may be offline.');
    });
    
    elements.playerModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    elements.playerModal.style.display = 'none';
    elements.videoPlayer.pause();
    elements.videoPlayer.currentTime = 0;
    document.body.style.overflow = 'auto';
}

// Handle Search
function handleSearch(e) {
    state.searchQuery = e.target.value.toLowerCase();
    renderChannels();
}

// Handle Filter
function handleFilter(e) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    state.currentFilter = e.target.getAttribute('data-filter');
    renderChannels();
}

// Get Filtered Channels
function getFilteredChannels() {
    let channels = state.allChannels;

    // Apply category filter
    if (state.currentFilter !== 'all') {
        channels = channels.filter(channel => getCategory(channel) === state.currentFilter);
    }

    // Apply search filter
    if (state.searchQuery) {
        channels = channels.filter(channel => {
            const searchText = (channel.name + ' ' + channel.group).toLowerCase();
            return searchText.includes(state.searchQuery);
        });
    }

    return channels;
}

// Update Stats
function updateStats() {
    elements.channelCount.textContent = state.allChannels.length;
    
    const categories = new Set();
    state.allChannels.forEach(channel => {
        categories.add(getCategory(channel));
    });
    elements.categoryCount.textContent = categories.size;
}

// Cache Management
function getCachedChannels() {
    try {
        const cached = localStorage.getItem('iptv_channels');
        const timestamp = localStorage.getItem('iptv_timestamp');
        
        if (cached && timestamp) {
            const age = Date.now() - parseInt(timestamp);
            if (age < CONFIG.cacheTime) {
                return JSON.parse(cached);
            }
        }
    } catch (e) {
        console.warn('Cache read error:', e);
    }
    return null;
}

function cacheChannels(channels) {
    try {
        localStorage.setItem('iptv_channels', JSON.stringify(channels));
        localStorage.setItem('iptv_timestamp', Date.now().toString());
    } catch (e) {
        console.warn('Cache write error:', e);
    }
}

// UI Helpers
function showLoading(show) {
    state.isLoading = show;
    if (show) {
        elements.loadingIndicator.classList.remove('hidden');
    } else {
        elements.loadingIndicator.classList.add('hidden');
    }
}

function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.style.display = 'block';
    setTimeout(() => {
        elements.errorMessage.style.display = 'none';
    }, 5000);
}

function hideError() {
    elements.errorMessage.style.display = 'none';
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.code === 'Space' && elements.playerModal.style.display === 'flex') {
        e.preventDefault();
        const video = elements.videoPlayer;
        if (video.paused) video.play();
        else video.pause();
    }
});

// Performance: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.hasAttribute('data-src')) {
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('[data-src]').forEach(img => imageObserver.observe(img));
}
