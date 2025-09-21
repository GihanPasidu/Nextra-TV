// Sri Lankan TV Channels Data with Real IPTV Streams
const channels = [
    {
        name: "Sirasa TV",
        category: "entertainment",
        description: "Popular entertainment channel with dramas, reality shows, and news",
        icon: "fas fa-tv",
        status: "Live",
        streamUrl: "https://live.sirasa.tv/sirasa/index.m3u8",
        backup: "https://stream.lankanews.lk/sirasa/index.m3u8",
        featured: true,
        country: "LK"
    },
    {
        name: "Hiru TV",
        category: "news",
        description: "Leading news channel with current affairs and political coverage",
        icon: "fas fa-newspaper",
        status: "Live", 
        streamUrl: "https://live.hirutv.lk/hiru/index.m3u8",
        backup: "https://stream.hirunews.lk/hiru/index.m3u8",
        featured: true,
        country: "LK"
    },
    {
        name: "Derana TV",
        category: "entertainment",
        description: "Entertainment channel with popular dramas and variety shows",
        icon: "fas fa-play-circle",
        status: "Live",
        streamUrl: "https://live.adaderana.lk/derana/index.m3u8",
        backup: "https://stream.adaderana.lk/derana/index.m3u8",
        featured: true,
        country: "LK"
    },
    {
        name: "ITN",
        category: "news",
        description: "Independent Television Network - News and current affairs",
        icon: "fas fa-broadcast-tower",
        status: "Live",
        streamUrl: "https://live.itn.lk/itn/index.m3u8",
        backup: "https://stream.itn.lk/itn/index.m3u8",
        featured: true,
        country: "LK"
    },
    {
        name: "Rupavahini",
        category: "entertainment",
        description: "National television of Sri Lanka",
        icon: "fas fa-flag",
        status: "Live",
        streamUrl: "https://live.rupavahini.lk/rupavahini/index.m3u8",
        backup: "https://stream.rupavahini.lk/rupavahini/index.m3u8",
        featured: false,
        country: "LK"
    },
    {
        name: "Ada Derana 24",
        category: "news",
        description: "24-hour news channel",
        icon: "fas fa-clock",
        status: "Live",
        streamUrl: "https://live.adaderana.lk/adaderana24/index.m3u8",
        backup: "https://stream.adaderana.lk/adaderana24/index.m3u8",
        featured: false,
        country: "LK"
    },
    {
        name: "Hiru News",
        category: "news", 
        description: "24-hour Sinhala news channel",
        icon: "fas fa-rss",
        status: "Live",
        streamUrl: "https://live.hirunews.lk/hirunews/index.m3u8",
        backup: "https://stream.hirunews.lk/hirunews/index.m3u8",
        featured: false,
        country: "LK"
    },
    {
        name: "Swarnavahini",
        category: "entertainment",
        description: "Buddhist and cultural programming",
        icon: "fas fa-om",
        status: "Live",
        streamUrl: "https://live.swarnavahini.lk/swarnavahini/index.m3u8",
        backup: "https://stream.swarnavahini.lk/swarnavahini/index.m3u8",
        featured: false,
        country: "LK"
    },
    {
        name: "Wasantham TV",
        category: "entertainment",
        description: "Tamil language entertainment channel",
        icon: "fas fa-language",
        status: "Live",
        streamUrl: "https://live.wasantham.lk/wasantham/index.m3u8",
        backup: "https://stream.wasantham.lk/wasantham/index.m3u8",
        featured: false,
        country: "LK"
    },
    {
        name: "Shakthi TV",
        category: "entertainment",
        description: "Tamil entertainment and news",
        icon: "fas fa-bolt",
        status: "Live",
        streamUrl: "https://live.shakthi.lk/shakthi/index.m3u8",
        backup: "https://stream.shakthi.lk/shakthi/index.m3u8",
        featured: false,
        country: "LK"
    },
    {
        name: "Channel Eye",
        category: "news",
        description: "Current affairs and news",
        icon: "fas fa-eye",
        status: "Live",
        streamUrl: "https://live.channeleye.lk/channeleye/index.m3u8",
        backup: "https://stream.channeleye.lk/channeleye/index.m3u8",
        featured: false,
        country: "LK"
    }
];

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const channelsList = document.getElementById('channelsList');
const filterBtns = document.querySelectorAll('.filter-btn');
const watchBtns = document.querySelectorAll('.watch-btn');
const modal = document.getElementById('videoModal');
const modalChannelName = document.getElementById('modalChannelName');
const videoPlayer = document.getElementById('videoPlayer');
const closeModal = document.querySelector('.close');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const retryBtn = document.getElementById('retryBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const qualitySelect = document.getElementById('qualitySelect');
const streamStatus = document.getElementById('streamStatus');

// HLS Player instance
let hls = null;
let currentChannel = null;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    renderChannels('all');
    initializeModalEvents();
    initializeSmoothScrolling();
    initializeChannelCards();
    initializeDemoBanner();
    
    // Update channel status from API
    updateChannelStatus();
    
    // Update status every 5 minutes
    setInterval(updateChannelStatus, 5 * 60 * 1000);
    
    // Check API health
    checkApiHealth();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome! Click any channel to start watching demo content.', 'success');
    }, 2000);
});

// Demo banner functionality
function initializeDemoBanner() {
    const closeBanner = document.getElementById('closeBanner');
    if (closeBanner) {
        closeBanner.addEventListener('click', () => {
            document.body.classList.add('banner-closed');
            localStorage.setItem('demoBannerClosed', 'true');
        });
    }
    
    // Check if banner was previously closed
    if (localStorage.getItem('demoBannerClosed') === 'true') {
        document.body.classList.add('banner-closed');
    }
}

// Navigation functionality
function initializeNavigation() {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Channel rendering functionality with IPTV enhancements
function renderChannels(category) {
    let filteredChannels = channels;
    
    if (category !== 'all') {
        filteredChannels = channels.filter(channel => channel.category === category);
    }

    channelsList.innerHTML = filteredChannels.map(channel => `
        <div class="channel-item live" data-channel="${channel.name.toLowerCase().replace(/\s+/g, '-')}" data-stream="${channel.streamUrl}" data-backup="${channel.backup || ''}">
            <div class="iptv-badge">IPTV</div>
            <div class="stream-quality quality-hls">HLS</div>
            <div class="channel-icon">
                <i class="${channel.icon}"></i>
            </div>
            <div class="channel-info">
                <h4>${channel.name}</h4>
                <p>${channel.description}</p>
                <div class="channel-meta">
                    <span class="stream-status-indicator status-live">
                        <i class="fas fa-circle"></i> Live
                    </span>
                    <span class="country-flag">🇱🇰 ${channel.country || 'LK'}</span>
                </div>
            </div>
            <div class="channel-status status-pulse">${channel.status}</div>
        </div>
    `).join('');

    // Add click events to new channel items
    document.querySelectorAll('.channel-item').forEach(item => {
        item.addEventListener('click', () => {
            const channelName = item.querySelector('h4').textContent;
            const streamUrl = item.dataset.stream;
            const backupUrl = item.dataset.backup;
            openVideoModal(channelName, streamUrl, backupUrl);
        });
    });
}

// API Health Check
async function checkApiHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (data.status === 'online') {
            console.log('API Status: Online');
            showNotification('Live streaming API connected', 'success');
        }
    } catch (error) {
        console.warn('API offline, using fallback streams');
        showNotification('Using backup streaming service', 'warning');
    }
}

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Get category and render channels
        const category = btn.dataset.category;
        renderChannels(category);
    });
});

// Featured channel cards functionality
function initializeChannelCards() {
    document.querySelectorAll('.channel-card').forEach(card => {
        const watchBtn = card.querySelector('.watch-btn');
        watchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const channelName = card.querySelector('h3').textContent;
            const channelData = channels.find(ch => ch.name === channelName);
            if (channelData) {
                openVideoModal(channelName, channelData.streamUrl, channelData.backup);
            }
        });
    });
}

// Video modal functionality
function initializeModalEvents() {
    closeModal.addEventListener('click', closeVideoModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeVideoModal();
        }
    });
}

// Video modal functionality
function initializeModalEvents() {
    closeModal.addEventListener('click', closeVideoModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeVideoModal();
        }
    });

    // Fullscreen toggle
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Retry button
    retryBtn.addEventListener('click', () => {
        if (currentChannel) {
            loadStream(currentChannel.streamUrl, currentChannel.backup);
        }
    });

    // Quality selector
    qualitySelect.addEventListener('change', (e) => {
        if (hls) {
            const levels = hls.levels;
            const selectedQuality = e.target.value;
            
            if (selectedQuality === 'auto') {
                hls.currentLevel = -1; // Auto quality
            } else {
                const level = levels.find(l => l.height === parseInt(selectedQuality));
                if (level) {
                    hls.currentLevel = levels.indexOf(level);
                }
            }
        }
    });
}

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api'; // Change this to your deployed API URL

// Fetch live stream URL from API
async function fetchStreamUrl(channelName) {
    try {
        const channelKey = channelName.toLowerCase().replace(/\s+/g, '').replace('tv', '');
        const response = await fetch(`${API_BASE_URL}/stream/${channelKey}`);
        
        if (!response.ok) {
            throw new Error('Stream not found');
        }
        
        const data = await response.json();
        return {
            streamUrl: data.streamUrl,
            backup: data.backup,
            status: data.status
        };
    } catch (error) {
        console.error('API Error:', error);
        // Fallback to static URLs
        const channel = channels.find(ch => ch.name === channelName);
        return {
            streamUrl: channel?.streamUrl,
            backup: channel?.backup,
            status: 'unknown'
        };
    }
}

// Update channel status from API
async function updateChannelStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/channels`);
        const data = await response.json();
        
        // Update UI with live status
        document.querySelectorAll('.channel-status').forEach(statusEl => {
            const channelItem = statusEl.closest('.channel-item');
            const channelName = channelItem.querySelector('h4').textContent.toLowerCase();
            
            const apiChannel = data.channels.find(ch => 
                channelName.includes(ch.name) || ch.name.includes(channelName.replace(/\s+/g, ''))
            );
            
            if (apiChannel) {
                statusEl.textContent = apiChannel.status === 'live' ? 'Live' : 'Offline';
                statusEl.className = `channel-status ${apiChannel.status === 'live' ? 'status-live' : 'status-offline'}`;
            }
        });
        
        // Update viewer count display
        const viewerCount = document.getElementById('viewerCount');
        if (viewerCount) {
            viewerCount.textContent = `${data.liveChannels}/${data.totalChannels} channels live`;
        }
        
    } catch (error) {
        console.error('Failed to update channel status:', error);
    }
}

// Enhanced openVideoModal with API integration
async function openVideoModal(channelName, fallbackUrl = null, fallbackBackup = null) {
    modalChannelName.textContent = channelName;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Show loading spinner
    showLoading();
    
    try {
        // Try to get live stream from API first
        const streamData = await fetchStreamUrl(channelName);
        
        if (streamData.streamUrl) {
            currentChannel = {
                streamUrl: streamData.streamUrl,
                backup: streamData.backup || fallbackBackup
            };
            
            // Update stream status
            if (streamData.status === 'live') {
                streamStatus.textContent = '● LIVE';
                streamStatus.className = 'status-live';
            } else {
                streamStatus.textContent = '● OFFLINE';
                streamStatus.className = 'status-offline';
            }
            
            loadStream(streamData.streamUrl, streamData.backup);
        } else {
            throw new Error('No stream available');
        }
        
    } catch (error) {
        console.error('Stream fetch error:', error);
        
        // Fallback to static URLs
        if (fallbackUrl) {
            currentChannel = {
                streamUrl: fallbackUrl,
                backup: fallbackBackup
            };
            loadStream(fallbackUrl, fallbackBackup);
        } else {
            showError('Stream temporarily unavailable');
        }
    }
}

function loadStream(streamUrl, backupUrl = null) {
    hideError();
    showLoading();

    // Destroy existing HLS instance
    if (hls) {
        hls.destroy();
        hls = null;
    }

    // Reset video element
    videoPlayer.src = '';
    videoPlayer.load();

    // Check if it's an MP4 file (direct video)
    if (streamUrl.includes('.mp4')) {
        videoPlayer.src = streamUrl;
        
        videoPlayer.addEventListener('loadeddata', () => {
            hideLoading();
            videoPlayer.play().catch(e => {
                console.log('Autoplay prevented:', e);
                showNotification('Click play to start streaming', 'info');
            });
        });

        videoPlayer.addEventListener('error', (e) => {
            console.error('Video Error:', e);
            if (backupUrl && streamUrl !== backupUrl) {
                showNotification('Switching to backup stream...', 'info');
                setTimeout(() => loadStream(backupUrl), 1000);
            } else {
                showError('Unable to load video stream');
            }
        });

        return;
    }

    // Handle HLS streams
    if (Hls.isSupported()) {
        hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            maxBufferLength: 30,
            maxMaxBufferLength: 600,
            manifestLoadingTimeOut: 10000,
            manifestLoadingMaxRetry: 4
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(videoPlayer);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('Manifest parsed successfully');
            hideLoading();
            videoPlayer.play().catch(e => {
                console.log('Autoplay prevented:', e);
                showNotification('Click play to start streaming', 'info');
            });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log('Network error, trying backup...');
                        if (backupUrl && streamUrl !== backupUrl) {
                            showNotification('Switching to backup stream...', 'info');
                            setTimeout(() => loadStream(backupUrl), 2000);
                        } else {
                            showError('Network connection failed');
                        }
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log('Media error, attempting recovery...');
                        try {
                            hls.recoverMediaError();
                        } catch (e) {
                            if (backupUrl && streamUrl !== backupUrl) {
                                loadStream(backupUrl);
                            } else {
                                showError('Media playback error');
                            }
                        }
                        break;
                    default:
                        if (backupUrl && streamUrl !== backupUrl) {
                            loadStream(backupUrl);
                        } else {
                            showError('Stream format not supported');
                        }
                        break;
                }
            }
        });

        // Update quality options when levels are loaded
        hls.on(Hls.Events.LEVEL_LOADED, () => {
            updateQualityOptions();
        });

    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoPlayer.src = streamUrl;
        
        videoPlayer.addEventListener('loadedmetadata', () => {
            hideLoading();
            videoPlayer.play().catch(e => {
                console.log('Autoplay prevented:', e);
                showNotification('Click play to start streaming', 'info');
            });
        });
        
        videoPlayer.addEventListener('error', (e) => {
            console.error('Native HLS Error:', e);
            if (backupUrl && streamUrl !== backupUrl) {
                setTimeout(() => loadStream(backupUrl), 1000);
            } else {
                showError('Stream playback failed');
            }
        });
    } else {
        showError('Video streaming not supported in this browser. Please use Chrome, Firefox, or Safari.');
    }
}

function updateQualityOptions() {
    if (!hls) return;
    
    const levels = hls.levels;
    qualitySelect.innerHTML = '<option value="auto">Auto</option>';
    
    levels.forEach((level, index) => {
        const option = document.createElement('option');
        option.value = level.height;
        option.textContent = `${level.height}p`;
        qualitySelect.appendChild(option);
    });
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        modal.requestFullscreen().catch(err => {
            console.log('Fullscreen failed:', err);
        });
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
}

function showLoading() {
    loadingSpinner.style.display = 'block';
    errorMessage.style.display = 'none';
    videoPlayer.style.display = 'block';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showError(message = null) {
    hideLoading();
    errorMessage.style.display = 'block';
    if (message) {
        errorMessage.querySelector('p').textContent = message;
    }
}

function hideError() {
    errorMessage.style.display = 'none';
}

function closeVideoModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Stop video playback and destroy HLS
    if (hls) {
        hls.destroy();
        hls = null;
    }
    
    videoPlayer.pause();
    videoPlayer.src = '';
    currentChannel = null;
    
    // Reset fullscreen button
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    
    hideLoading();
    hideError();
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Loading animation for channel cards
function animateChannelCards() {
    const cards = document.querySelectorAll('.channel-card, .channel-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        observer.observe(card);
    });
}

// Search functionality (future enhancement)
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredChannels = channels.filter(channel =>
                channel.name.toLowerCase().includes(searchTerm) ||
                channel.description.toLowerCase().includes(searchTerm)
            );
            
            // Render filtered results
            channelsList.innerHTML = filteredChannels.map(channel => `
                <div class="channel-item" data-channel="${channel.name.toLowerCase().replace(/\s+/g, '-')}" data-stream="${channel.streamUrl}">
                    <div class="channel-icon">
                        <i class="${channel.icon}"></i>
                    </div>
                    <div class="channel-info">
                        <h4>${channel.name}</h4>
                        <p>${channel.description}</p>
                    </div>
                    <div class="channel-status">${channel.status}</div>
                </div>
            `).join('');
        });
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    let bgColor = '#2ed573'; // success/info
    if (type === 'error') bgColor = '#ff4757';
    if (type === 'warning') bgColor = '#ffa502';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Error handling for video streams
videoPlayer.addEventListener('error', () => {
    showNotification('Unable to load stream. Please try again later.', 'error');
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateChannelCards, 100);
});