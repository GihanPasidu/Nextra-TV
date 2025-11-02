// IPTV Channel Manager
class IPTVManager {
    constructor() {
        this.channels = [];
        this.filteredChannels = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.m3uUrl = 'https://iptv-org.github.io/iptv/index.m3u';
        this.hls = null; // HLS.js instance
        this.isGitHubPages = window.location.hostname.includes('github.io');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadChannels();
    }

    setupEventListeners() {
        // Search input with debouncing
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterChannels();
            }, 300); // Wait 300ms after user stops typing
        });

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.filterChannels();
            });
        });

        // Modal close
        const modalClose = document.querySelector('.modal-close');
        const modal = document.getElementById('playerModal');
        
        modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Loading indicator click
        const loadingBtn = document.getElementById('loadingIndicator');
        loadingBtn.addEventListener('click', () => {
            this.loadChannels();
        });
    }

    async loadChannels() {
        const loadingBtn = document.getElementById('loadingIndicator');
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const channelsContainer = document.getElementById('channelsContainer');

        try {
            // Show loading state
            loadingBtn.style.display = 'flex';
            errorMessage.style.display = 'none';
            
            // Show skeleton loaders
            channelsContainer.innerHTML = `
                <div class="skeleton-loader"></div>
                <div class="skeleton-loader"></div>
                <div class="skeleton-loader"></div>
                <div class="skeleton-loader"></div>
                <div class="skeleton-loader"></div>
                <div class="skeleton-loader"></div>
            `;

            // Fetch M3U playlist using CORS proxy
            const proxyUrl = 'https://corsproxy.io/?';
            const response = await fetch(proxyUrl + encodeURIComponent(this.m3uUrl));
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const m3uContent = await response.text();
            this.channels = this.parseM3U(m3uContent);

            // Update channel count
            this.updateChannelCount(this.channels.length);

            // Display channels
            this.filterChannels();

            // Hide loading indicator
            loadingBtn.style.display = 'none';

        } catch (error) {
            console.error('Error loading channels:', error);
            errorText.textContent = `Failed to load channels: ${error.message}. Click "Loading Channels" to retry.`;
            errorMessage.style.display = 'block';
            channelsContainer.innerHTML = '';
            loadingBtn.style.display = 'flex';
        }
    }

    parseM3U(content) {
        const lines = content.split('\n');
        const channels = [];
        let currentChannel = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith('#EXTINF:')) {
                // Parse channel info
                currentChannel = this.parseExtInf(line);
            } else if (line && !line.startsWith('#') && currentChannel.name) {
                // This is the stream URL
                currentChannel.url = line;
                channels.push({ ...currentChannel });
                currentChannel = {};
            }
        }

        return channels;
    }

    parseExtInf(line) {
        const channel = {
            name: '',
            group: 'General',
            logo: '',
            url: ''
        };

        // Extract tvg-logo
        const logoMatch = line.match(/tvg-logo="([^"]*)"/);
        if (logoMatch) {
            channel.logo = logoMatch[1];
        }

        // Extract group-title
        const groupMatch = line.match(/group-title="([^"]*)"/);
        if (groupMatch) {
            channel.group = groupMatch[1];
        }

        // Extract channel name (after the last comma)
        const nameMatch = line.match(/,(.+)$/);
        if (nameMatch) {
            channel.name = nameMatch[1].trim();
        }

        return channel;
    }

    filterChannels() {
        let filtered = [...this.channels];

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(channel => {
                const group = channel.group.toLowerCase();
                switch (this.currentFilter) {
                    case 'sports':
                        return group.includes('sport');
                    case 'movies':
                        return group.includes('movie') || group.includes('film');
                    case 'news':
                        return group.includes('news');
                    case 'kids':
                        return group.includes('kids') || group.includes('cartoon') || group.includes('children');
                    case 'music':
                        return group.includes('music');
                    default:
                        return true;
                }
            });
        }

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(channel => 
                channel.name.toLowerCase().includes(this.searchQuery) ||
                channel.group.toLowerCase().includes(this.searchQuery)
            );
        }

        this.filteredChannels = filtered;
        this.displayChannels(filtered);
    }

    displayChannels(channels) {
        const container = document.getElementById('channelsContainer');
        const noResults = document.getElementById('noResults');

        if (channels.length === 0) {
            container.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        // Limit initial display to improve performance
        const maxInitialDisplay = 100;
        const channelsToShow = channels.slice(0, maxInitialDisplay);
        const hasMore = channels.length > maxInitialDisplay;

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        channelsToShow.forEach(channel => {
            const card = this.createChannelCard(channel);
            fragment.appendChild(card);
        });

        container.innerHTML = '';
        container.appendChild(fragment);

        // Show "Load More" button if there are more channels
        if (hasMore) {
            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.className = 'load-more-btn';
            loadMoreBtn.textContent = `Load More (${channels.length - maxInitialDisplay} remaining)`;
            loadMoreBtn.onclick = () => {
                this.loadMoreChannels(channels, maxInitialDisplay);
                loadMoreBtn.remove();
            };
            container.appendChild(loadMoreBtn);
        }
    }

    createChannelCard(channel) {
        const card = document.createElement('div');
        card.className = 'channel-card';
        card.dataset.url = channel.url;
        card.dataset.name = channel.name;
        card.dataset.group = channel.group;

        card.innerHTML = `
            <div class="channel-thumb">
                ${channel.logo ? 
                    `<img src="${this.escapeHtml(channel.logo)}" alt="${this.escapeHtml(channel.name)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                     <div class="channel-thumb-icon" style="display:none;">📺</div>` :
                    `<div class="channel-thumb-icon">📺</div>`
                }
                <button class="play-button">▶</button>
            </div>
            <div class="channel-info">
                <div>
                    <div class="channel-name" title="${this.escapeHtml(channel.name)}">${this.escapeHtml(channel.name)}</div>
                    <div class="channel-group" title="${this.escapeHtml(channel.group)}">${this.escapeHtml(channel.group)}</div>
                </div>
                <div class="channel-badge">LIVE</div>
            </div>
        `;

        // Use event delegation - single listener
        card.addEventListener('click', () => {
            this.playChannel(card.dataset.url, card.dataset.name, card.dataset.group);
        });

        return card;
    }

    loadMoreChannels(allChannels, currentCount) {
        const container = document.getElementById('channelsContainer');
        const nextBatch = allChannels.slice(currentCount, currentCount + 100);
        const hasMore = allChannels.length > currentCount + 100;

        const fragment = document.createDocumentFragment();
        nextBatch.forEach(channel => {
            const card = this.createChannelCard(channel);
            fragment.appendChild(card);
        });

        container.appendChild(fragment);

        if (hasMore) {
            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.className = 'load-more-btn';
            loadMoreBtn.textContent = `Load More (${allChannels.length - currentCount - 100} remaining)`;
            loadMoreBtn.onclick = () => {
                this.loadMoreChannels(allChannels, currentCount + 100);
                loadMoreBtn.remove();
            };
            container.appendChild(loadMoreBtn);
        }
    }

    playChannel(url, name, group) {
        const modal = document.getElementById('playerModal');
        const videoPlayer = document.getElementById('videoPlayer');
        const modalChannelName = document.getElementById('modalChannelName');
        const modalChannelGroup = document.getElementById('modalChannelGroup');

        // Set channel info
        modalChannelName.textContent = name;
        modalChannelGroup.textContent = group;

        // Clean up previous HLS instance
        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }

        // Show modal
        modal.style.display = 'flex';

        // For problematic streams, try with CORS proxy first
        let streamUrl = url;
        const useCorsProxy = false; // Set to true if direct access fails
        
        // If stream has known CORS issues, enable proxy
        if (url.includes('sonyliv') || url.includes('sonyten') || 
            name.toLowerCase().includes('sony') || 
            name.toLowerCase().includes('ten sports')) {
            // These streams often have CORS issues, but try direct first
            console.log('Detected potentially geo-blocked stream:', name);
        }

        // Check if HLS is supported
        if (Hls.isSupported()) {
            // Use HLS.js for browsers that don't natively support HLS
            this.hls = new Hls({
                debug: false,
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90,
                maxBufferLength: 30,
                maxMaxBufferLength: 600,
                maxBufferSize: 60 * 1000 * 1000,
                maxBufferHole: 0.5,
                manifestLoadingTimeOut: 20000,
                manifestLoadingMaxRetry: 6,
                manifestLoadingRetryDelay: 1000,
                manifestLoadingMaxRetryTimeout: 64000,
                levelLoadingTimeOut: 20000,
                levelLoadingMaxRetry: 6,
                levelLoadingRetryDelay: 1000,
                levelLoadingMaxRetryTimeout: 64000,
                fragLoadingTimeOut: 30000,
                fragLoadingMaxRetry: 10,
                fragLoadingRetryDelay: 1000,
                fragLoadingMaxRetryTimeout: 64000,
                startFragPrefetch: true,
                testBandwidth: true,
                progressive: true,
                // Disable strict checking for problematic streams
                stretchShortVideoTrack: true,
                maxAudioFramesDrift: 1,
                forceKeyFrameOnDiscontinuity: true,
                // Handle CORS - try without credentials
                xhrSetup: function(xhr, url) {
                    xhr.withCredentials = false;
                    // Add referrer policy for some geo-blocked content
                    xhr.setRequestHeader('Referer', '');
                }
            });

            this.hls.loadSource(streamUrl);
            this.hls.attachMedia(videoPlayer);

            let retryCount = 0;
            const maxRetries = 3;

            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('Stream loaded successfully:', name);
                videoPlayer.play().catch(error => {
                    // Silently handle auto-play restrictions
                    if (error.name !== 'NotAllowedError') {
                        console.warn('Playback error:', error.message);
                    }
                });
            });

            this.hls.on(Hls.Events.ERROR, (event, data) => {
                console.log('HLS Error:', data.type, data.details, 'Fatal:', data.fatal);
                
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.warn('Network error, attempting recovery...');
                            if (retryCount < maxRetries) {
                                retryCount++;
                                setTimeout(() => {
                                    console.log(`Retry ${retryCount}/${maxRetries}`);
                                    this.hls.startLoad();
                                }, 1000 * retryCount);
                            } else {
                                console.error('Network error - max retries reached');
                                const shouldRetry = confirm(
                                    `Unable to load "${name}"\n\n` +
                                    `This channel may be:\n` +
                                    `• Geo-blocked (restricted to certain countries)\n` +
                                    `• Temporarily offline\n` +
                                    `• Requiring special access\n\n` +
                                    `Click OK to try again, or Cancel to close.`
                                );
                                if (shouldRetry) {
                                    retryCount = 0;
                                    this.hls.destroy();
                                    this.playChannel(url, name, group);
                                } else {
                                    this.closeModal();
                                }
                            }
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.warn('Media error, attempting recovery...');
                            if (retryCount < maxRetries) {
                                retryCount++;
                                this.hls.recoverMediaError();
                            } else {
                                console.error('Media error - max retries reached');
                                alert(`Unable to play "${name}"\n\nThe stream format may be incompatible with your browser.\n\nTry using a different browser or VPN.`);
                                this.closeModal();
                            }
                            break;
                        default:
                            console.error('Fatal error:', data.details);
                            alert(`Unable to play "${name}"\n\nError: ${data.details}\n\nThe stream may be offline or unavailable.`);
                            this.closeModal();
                            break;
                    }
                }
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            console.log('Using native HLS for:', name);
            videoPlayer.src = streamUrl;
            videoPlayer.load();
            
            videoPlayer.onerror = (e) => {
                console.error('Native player error:', videoPlayer.error);
                const error = videoPlayer.error;
                if (error) {
                    let errorMsg = `Unable to play "${name}"\n\n`;
                    switch (error.code) {
                        case error.MEDIA_ERR_ABORTED:
                            errorMsg += 'Playback was aborted.';
                            break;
                        case error.MEDIA_ERR_NETWORK:
                            errorMsg += 'Network error. Stream may be geo-blocked or offline.\n\nTry using a VPN or different browser.';
                            break;
                        case error.MEDIA_ERR_DECODE:
                            errorMsg += 'Media decoding error. Format may be incompatible.';
                            break;
                        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                            errorMsg += 'Stream format not supported or unavailable.';
                            break;
                        default:
                            errorMsg += 'Unknown error occurred.';
                    }
                    
                    const shouldRetry = confirm(errorMsg + '\n\nClick OK to retry, or Cancel to close.');
                    if (shouldRetry) {
                        videoPlayer.load();
                        videoPlayer.play().catch(err => console.warn('Retry failed:', err));
                    } else {
                        this.closeModal();
                    }
                }
            };
            
            videoPlayer.play().catch(error => {
                if (error.name !== 'NotAllowedError') {
                    console.warn('Playback error:', error.message);
                }
            });
        } else {
            alert('Your browser does not support HLS streaming. Please use a modern browser like Chrome, Firefox, or Safari.');
        }
    }

    closeModal() {
        const modal = document.getElementById('playerModal');
        const videoPlayer = document.getElementById('videoPlayer');

        // Clean up HLS instance
        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }

        // Stop video
        videoPlayer.pause();
        videoPlayer.src = '';

        // Hide modal
        modal.style.display = 'none';
    }

    updateChannelCount(count) {
        const channelCount = document.getElementById('channelCount');
        channelCount.textContent = count;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IPTVManager();
});
