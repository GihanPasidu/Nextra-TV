// IPTV Channel Manager
class IPTVManager {
    constructor() {
        this.channels = [];
        this.filteredChannels = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        // Using the full channel list with better coverage
        this.m3uUrl = 'https://iptv-org.github.io/iptv/index.m3u';
        this.hls = null; // HLS.js instance
        this.isGitHubPages = window.location.hostname.includes('github.io');
        this.attemptedProxy = false;
        this.attemptedProxyIndex = -1;
        this.forceProxySetting = false; // User-controlled proxy toggle
        this.currentPlaying = null; // {url, name, group}
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

        // Proxy toggle in modal
        const proxyToggle = document.getElementById('proxyToggle');
        if (proxyToggle) {
            proxyToggle.addEventListener('change', (e) => {
                this.forceProxySetting = e.target.checked;
                const indicator = document.getElementById('proxyIndicator');
                if (indicator) {
                    indicator.style.display = e.target.checked ? 'inline-block' : 'none';
                }
                // If modal is visible and a channel is playing, reattempt playback with new setting
                const modal = document.getElementById('playerModal');
                if (modal && modal.style.display === 'flex' && this.currentPlaying) {
                    // Restart playback using the new setting
                    this.playChannel(this.currentPlaying.url, this.currentPlaying.name, this.currentPlaying.group, this.forceProxySetting);
                }
            });
        }

        // Retry button
        const retryProxyBtn = document.getElementById('retryProxyBtn');
        const retryBtn = document.getElementById('retryBtn');
        const copyUrlBtn = document.getElementById('copyUrlBtn');
        if (retryProxyBtn) {
            retryProxyBtn.addEventListener('click', () => {
                if (this.currentPlaying) {
                    this.playChannel(this.currentPlaying.url, this.currentPlaying.name, this.currentPlaying.group, true);
                }
            });
        }
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                if (this.currentPlaying) {
                    this.playChannel(this.currentPlaying.url, this.currentPlaying.name, this.currentPlaying.group, false);
                }
            });
        }
        if (copyUrlBtn) {
            copyUrlBtn.addEventListener('click', () => {
                if (this.currentPlaying) {
                    const proxies = ['https://corsproxy.io/?','https://api.allorigins.win/raw?url='];
                    const forced = this.forceProxySetting;
                    let urlToCopy = this.currentPlaying.url;
                    if (forced) urlToCopy = proxies[0] + encodeURIComponent(urlToCopy);
                    navigator.clipboard && navigator.clipboard.writeText(urlToCopy).then(() => {
                        alert('Stream URL copied to clipboard');
                    }).catch(() => { alert('Unable to copy to clipboard'); });
                }
            });
        }
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

    async playChannel(url, name, group, useCorsProxy = false, proxyIndex = -1) {
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

        // Update proxy toggle and indicator state in the modal
        const proxyToggleEl = document.getElementById('proxyToggle');
        const proxyIndicatorEl = document.getElementById('proxyIndicator');
        if (proxyToggleEl) proxyToggleEl.checked = this.forceProxySetting || useCorsProxy;
        if (proxyIndicatorEl) proxyIndicatorEl.style.display = (this.forceProxySetting || useCorsProxy) ? 'inline-block' : 'none';

        // Detect sports and other potentially problematic channels
        const isSportsChannel = group.toLowerCase().includes('sport') || 
                               name.toLowerCase().includes('sport') ||
                               name.toLowerCase().includes('espn') ||
                               name.toLowerCase().includes('sony') ||
                               name.toLowerCase().includes('ten sports') ||
                               name.toLowerCase().includes('sky sports') ||
                               name.toLowerCase().includes('bein') ||
                               name.toLowerCase().includes('fox sports');
        
        // Setup proxies for fallback - prioritize direct, fallback to proxy(s)
        const proxies = [
            'https://corsproxy.io/?',
            'https://api.allorigins.win/raw?url='
        ];

        // Determine whether the user forced proxy usage or not
        const forcedProxy = useCorsProxy || this.forceProxySetting;

        // Build stream URL based on proxy preferences (prefer direct unless forced)
        let streamUrl = url;
        let usedProxyIndex = -1; // -1 indicates no proxy used
        if (forcedProxy) {
            const idx = proxyIndex >= 0 ? proxyIndex : 0;
            streamUrl = proxies[idx] + encodeURIComponent(url);
            usedProxyIndex = idx;
            console.log('Forcing CORS proxy (index', idx, ') for:', name);
        }
        // Reset our attempted-proxy flag for this playback session and track proxy index
        this.attemptedProxy = false;
        this.attemptedProxyIndex = usedProxyIndex;
        
        console.log('Playing channel:', name, 'Group:', group, 'URL:', streamUrl);
        const modalProxyInfoInit = document.getElementById('modalProxyInfo');
        if (modalProxyInfoInit) modalProxyInfoInit.textContent = forcedProxy ? `Using Proxy Index: ${usedProxyIndex}` : 'Direct Connection';

        // Check if HLS is supported
        if (Hls.isSupported()) {
            // Use HLS.js for browsers that don't natively support HLS
            // Optimized config for live sports streaming
            this.hls = new Hls({
                debug: false,
                enableWorker: true,
                lowLatencyMode: true, // Better for live sports
                backBufferLength: 90,
                maxBufferLength: 30,
                maxMaxBufferLength: 600,
                maxBufferSize: 60 * 1000 * 1000,
                maxBufferHole: 0.5,
                highBufferWatchdogPeriod: 3,
                nudgeMaxRetry: 5,
                manifestLoadingTimeOut: 30000,
                manifestLoadingMaxRetry: 10,
                manifestLoadingRetryDelay: 1000,
                manifestLoadingMaxRetryTimeout: 64000,
                levelLoadingTimeOut: 30000,
                levelLoadingMaxRetry: 10,
                levelLoadingRetryDelay: 1000,
                levelLoadingMaxRetryTimeout: 64000,
                fragLoadingTimeOut: 40000,
                fragLoadingMaxRetry: 15,
                fragLoadingRetryDelay: 1000,
                fragLoadingMaxRetryTimeout: 64000,
                startFragPrefetch: true,
                testBandwidth: true,
                progressive: true,
                // Disable strict checking for problematic streams
                stretchShortVideoTrack: true,
                maxAudioFramesDrift: 1,
                forceKeyFrameOnDiscontinuity: true,
                abrEwmaDefaultEstimate: 500000,
                // Handle CORS - try without credentials
                xhrSetup: function(xhr, url) {
                    xhr.withCredentials = false;
                    // Intentionally avoid setting Origin/Referer to reduce request rejection
                }
            });

            this.hls.loadSource(streamUrl);
            this.hls.attachMedia(videoPlayer);

            let retryCount = 0;
            const maxRetries = 3;

            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('Stream loaded successfully:', name);
                // Set quality level for better sports streaming
                if (this.hls.levels.length > 1) {
                    // Start with a medium quality for faster loading
                    const midLevel = Math.floor(this.hls.levels.length / 2);
                    this.hls.currentLevel = midLevel;
                }
                videoPlayer.play().catch(error => {
                    // Silently handle auto-play restrictions
                    if (error.name !== 'NotAllowedError') {
                        console.warn('Playback error:', error.message);
                    }
                });
                // Clear any modal error messages on successful parse and update proxy info
                this.clearModalError();
                const modalProxyInfo = document.getElementById('modalProxyInfo');
                if (modalProxyInfo) modalProxyInfo.textContent = forcedProxy ? `Using Proxy Index: ${usedProxyIndex}` : 'Direct Connection';
            });

            // If we're forcing proxy playback or attempting proxy fallback, rewrite frag URLs to use the proxy as well
            this.hls.on(Hls.Events.FRAG_LOADING, (event, data) => {
                const proxyToUse = (forcedProxy && usedProxyIndex >= 0) ? proxies[usedProxyIndex] : (this.attemptedProxy && this.attemptedProxyIndex >= 0 ? proxies[this.attemptedProxyIndex] : null);
                if (proxyToUse && data && data.frag && data.frag.url) {
                    try {
                        // Build absolute frag URL in case it's relative using streamUrl as base
                        const base = streamUrl || url;
                        const absoluteFragUrl = new URL(data.frag.url, base).href;
                        data.frag.url = proxyToUse + encodeURIComponent(absoluteFragUrl);
                        console.log('Proxying frag URL ->', data.frag.url);
                    } catch (err) {
                        // Fall back to encoding as-is if new URL fails
                        data.frag.url = proxyToUse + encodeURIComponent(data.frag.url);
                        console.log('Proxying frag URL (fallback) ->', data.frag.url);
                    }
                }
            });

            // Also patch level fragments when a level is loaded
            this.hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
                const proxyToUse = (forcedProxy && usedProxyIndex >= 0) ? proxies[usedProxyIndex] : (this.attemptedProxy && this.attemptedProxyIndex >= 0 ? proxies[this.attemptedProxyIndex] : null);
                if (proxyToUse && data && data.details && data.details.fragments) {
                    data.details.fragments.forEach(f => {
                        if (f && f.url) {
                            try {
                                const base = streamUrl || url;
                                const absoluteUrl = new URL(f.url, base).href;
                                f.url = proxyToUse + encodeURIComponent(absoluteUrl);
                            } catch (err) {
                                f.url = proxyToUse + encodeURIComponent(f.url);
                            }
                        }
                    });
                }
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
                                // If this was a sports channel, and we haven't tried a proxy yet, retry using the CORS proxy
                                if (isSportsChannel && !forcedProxy && !this.attemptedProxy) {
                                    console.log('Attempting playback with CORS proxy because initial direct playback failed.');
                                    this.showModalError(`Network error: ${data.details || data.type}. Retrying with proxy...`);
                                    const modalProxyInfo = document.getElementById('modalProxyInfo');
                                    if (modalProxyInfo) modalProxyInfo.textContent = 'Trying Proxy Index: 0';
                                    this.attemptedProxy = true;
                                    this.attemptedProxyIndex = 0;
                                    retryCount = 0;
                                    this.hls.destroy();
                                    this.playChannel(url, name, group, true, 0);
                                } else if (isSportsChannel && forcedProxy && this.attemptedProxy && this.attemptedProxyIndex === 0) {
                                    // We tried the first proxy; attempt the alternative proxy index if available
                                    console.log('Retrying with alternative proxy (index 1)');
                                    this.showModalError(`Network error: ${data.details || data.type}. Trying alternative proxy...`);
                                    const modalProxyInfo2 = document.getElementById('modalProxyInfo');
                                    if (modalProxyInfo2) modalProxyInfo2.textContent = 'Trying Proxy Index: 1';
                                    retryCount = 0;
                                    this.hls.destroy();
                                    this.attemptedProxyIndex = 1;
                                    this.playChannel(url, name, group, true, 1);
                                } else {
                                    this.showModalError(`Unable to play: ${data.details || data.type}`);
                                    const modalProxyInfo3 = document.getElementById('modalProxyInfo');
                                    if (modalProxyInfo3) modalProxyInfo3.textContent = forcedProxy ? `Tried Proxy Index: ${this.attemptedProxyIndex}` : 'Direct Connection (no proxy)';
                                    const shouldRetry = confirm(
                                        `Unable to load "${name}"\n\n` +
                                        `This channel may be:\n` +
                                        `• Geo-blocked (restricted to certain countries)\n` +
                                        `• Temporarily offline\n` +
                                        `• Requiring special access\n\n` +
                                        `Try using a VPN, toggle "Use CORS Proxy" and try again, or use a different browser.\n\n` +
                                        `Click OK to try again, or Cancel to close.`
                                    );
                                    if (shouldRetry) {
                                        retryCount = 0;
                                        this.hls.destroy();
                                        this.playChannel(url, name, group, false);
                                    } else {
                                        this.closeModal();
                                    }
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
            // If a proxy should be used, fetch the playlist through the proxy, rewrite URLs, and create a Blob URL for native playback
            if (forcedProxy || this.attemptedProxy) {
                const pIndex = forcedProxy && usedProxyIndex >= 0 ? usedProxyIndex : (this.attemptedProxyIndex >= 0 ? this.attemptedProxyIndex : 0);
                const proxyEndpoint = proxies[pIndex] || proxies[0];
                try {
                    const manifestResp = await fetch(proxyEndpoint + encodeURIComponent(url));
                    if (manifestResp.ok) {
                        let manifestText = await manifestResp.text();
                        manifestText = manifestText.split('\n').map(line => {
                            if (line && !line.startsWith('#')) {
                                try {
                                    const absoluteUrl = new URL(line, url).href;
                                    return proxyEndpoint + encodeURIComponent(absoluteUrl);
                                } catch (err) {
                                    return proxyEndpoint + encodeURIComponent(line);
                                }
                            }
                            return line;
                        }).join('\n');
                        const blob = new Blob([manifestText], { type: 'application/x-mpegURL' });
                        if (this.currentBlobUrl) URL.revokeObjectURL(this.currentBlobUrl);
                        this.currentBlobUrl = URL.createObjectURL(blob);
                        videoPlayer.src = this.currentBlobUrl;
                        videoPlayer.load();
                    } else {
                        console.warn('Failed to fetch manifest via proxy: ', manifestResp.status);
                        videoPlayer.src = streamUrl;
                        videoPlayer.load();
                    }
                } catch (err) {
                    console.warn('Failed to fetch/patch manifest for native playback:', err);
                    videoPlayer.src = streamUrl;
                    videoPlayer.load();
                }
            } else {
                videoPlayer.src = streamUrl;
                videoPlayer.load();
            }
            
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
                    
                    // If it's a network error and sports channel, try the proxy fallback before prompting the user
                    if (error.code === error.MEDIA_ERR_NETWORK && isSportsChannel && !forcedProxy && !this.attemptedProxy) {
                        console.log('Native player network error - retrying with proxy...');
                        this.showModalError(`Network error in native player. Retrying with proxy...`);
                        this.attemptedProxy = true;
                        const proxySrc = proxies && proxies.length ? proxies[0] + encodeURIComponent(url) : null;
                        if (proxySrc) {
                            this.attemptedProxyIndex = 0;
                            videoPlayer.src = proxySrc;
                            videoPlayer.load();
                            videoPlayer.play().catch(err => console.warn('Proxy retry failed:', err));
                            return;
                        }
                    }

                    // Show error in modal
                    this.showModalError(errorMsg);
                    const modalProxyInfo = document.getElementById('modalProxyInfo');
                    if (modalProxyInfo) modalProxyInfo.textContent = forcedProxy ? `Using Proxy Index: ${usedProxyIndex}` : 'Direct Connection';

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

        // Reset any proxy attempt state for next playback
        this.attemptedProxy = false;
        this.attemptedProxyIndex = -1;

        // Reset proxy indicator in the modal
        const indicator = document.getElementById('proxyIndicator');
        if (indicator) indicator.style.display = this.forceProxySetting ? 'inline-block' : 'none';
        const modalProxyInfo = document.getElementById('modalProxyInfo');
        if (modalProxyInfo) modalProxyInfo.textContent = '';

        // Revoke any blob URL created for native playback
        if (this.currentBlobUrl) {
            try { URL.revokeObjectURL(this.currentBlobUrl); } catch(e) {}
            this.currentBlobUrl = null;
        }

        // Hide modal
        modal.style.display = 'none';
    }

    updateChannelCount(count) {
        const channelCount = document.getElementById('channelCount');
        channelCount.textContent = count;
    }

    showModalError(message) {
        const modalError = document.getElementById('modalError');
        const modalErrorText = document.getElementById('modalErrorText');
        if (modalError && modalErrorText) {
            modalErrorText.textContent = message;
            modalError.style.display = 'block';
        }
    }

    clearModalError() {
        const modalError = document.getElementById('modalError');
        const modalErrorText = document.getElementById('modalErrorText');
        if (modalError && modalErrorText) {
            modalErrorText.textContent = '';
            modalError.style.display = 'none';
        }
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
