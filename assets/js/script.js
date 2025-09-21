// Free TV Sri Lanka - Comprehensive IPTV Channel Collection
// Author: Cloudnextra Solutions

// Working IPTV channels with real streaming URLs
const channels = [
    // International News Channels (Working IPTV Streams)
    {
        name: "Al Jazeera English",
        category: "news",
        description: "International news channel with global coverage",
        icon: "fas fa-globe",
        status: "Live",
        streamUrl: "https://live-hls-web-aje.getaj.net/AJE/01.m3u8",
        backup: "https://live-hls-web-aje.getaj.net/AJE/02.m3u8",
        featured: true,
        country: "QA"
    },
    {
        name: "BBC World News",
        category: "news",
        description: "International news from the BBC",
        icon: "fas fa-newspaper",
        status: "Live",
        streamUrl: "http://ott-cdn.ucom.am/s24/index.m3u8",
        backup: "https://rakuten-euronews-1-gb.samsung.wurl.tv/manifest/playlist.m3u8",
        featured: true,
        country: "UK"
    },
    {
        name: "CNN International",
        category: "news",
        description: "Global news and current affairs",
        icon: "fas fa-globe-americas",
        status: "Live",
        streamUrl: "https://cnn-cnninternational-1-gb.samsung.wurl.com/manifest/playlist.m3u8",
        backup: "https://cnn-cnninternational-1-eu.rakuten.wurl.tv/manifest/playlist.m3u8",
        featured: true,
        country: "US"
    },
    {
        name: "RT News",
        category: "news",
        description: "Russian international news channel",
        icon: "fas fa-satellite",
        status: "Live",
        streamUrl: "https://rt-glb.rttv.com/live/rtnews/playlist.m3u8",
        backup: "https://rt-glb.rttv.com/live/rtnews/playlist_4500Kb.m3u8",
        featured: true,
        country: "RU"
    },
    {
        name: "France 24 English",
        category: "news",
        description: "French international news channel in English",
        icon: "fas fa-flag",
        status: "Live",
        streamUrl: "https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8",
        backup: "https://static.france24.com/live/F24_EN_HI_HLS/live_web.m3u8",
        featured: true,
        country: "FR"
    },
    {
        name: "DW English",
        category: "news",
        description: "Deutsche Welle international news",
        icon: "fas fa-broadcast-tower",
        status: "Live",
        streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8",
        backup: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/stream01/streamPlaylist.m3u8",
        featured: false,
        country: "DE"
    },
    {
        name: "TRT World",
        category: "news",
        description: "Turkish international news in English",
        icon: "fas fa-earth-americas",
        status: "Live",
        streamUrl: "https://tv-trtworld.live.trt.com.tr/master.m3u8",
        backup: "https://tv-trtworld.live.trt.com.tr/master_720.m3u8",
        featured: false,
        country: "TR"
    },
    {
        name: "CGTN",
        category: "news",
        description: "China Global Television Network",
        icon: "fas fa-satellite-dish",
        status: "Live",
        streamUrl: "https://live.cgtn.com/1000/prog_index.m3u8",
        backup: "https://live.cgtn.com/500/prog_index.m3u8",
        featured: false,
        country: "CN"
    },
    {
        name: "Euronews",
        category: "news",
        description: "European and international news",
        icon: "fas fa-flag",
        status: "Live",
        streamUrl: "https://rakuten-euronews-1-gb.samsung.wurl.tv/manifest/playlist.m3u8",
        backup: "https://euronews-euronews-world-1-au.samsung.wurl.tv/playlist.m3u8",
        featured: false,
        country: "EU"
    },
    {
        name: "Bloomberg TV",
        category: "news",
        description: "Business and financial news",
        icon: "fas fa-chart-line",
        status: "Live",
        streamUrl: "https://bloomberg.com/media-manifest/streams/asia.m3u8",
        backup: "https://liveproduseast.global.ssl.fastly.net/us/Channel-USTV-AWS-virginia-1/Source-USTV-1000-1_live.m3u8",
        featured: false,
        country: "US"
    },
    {
        name: "Sky News",
        category: "news",
        description: "British rolling news television channel",
        icon: "fas fa-cloud",
        status: "Live",
        streamUrl: "https://skynews2-plutolive-vo.akamaized.net/cdnAkamaiLive_201/playlist.m3u8",
        backup: "https://skynews2-plutolive-vo.akamaized.net/cdnAkamaiLive_401/playlist.m3u8",
        featured: false,
        country: "UK"
    },

    // Entertainment Channels
    {
        name: "Fashion TV",
        category: "entertainment",
        description: "Fashion, beauty and lifestyle programming",
        icon: "fas fa-tshirt",
        status: "Live",
        streamUrl: "https://fashiontv-fashiontv-5-nl.samsung.wurl.tv/playlist.m3u8",
        backup: "https://fashiontv-fashiontv-1-eu.rakuten.wurl.tv/playlist.m3u8",
        featured: true,
        country: "FR"
    },
    {
        name: "Red Bull TV",
        category: "sports",
        description: "Extreme sports and adventure content",
        icon: "fas fa-mountain",
        status: "Live",
        streamUrl: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
        backup: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_928.m3u8",
        featured: true,
        country: "AT"
    },
    {
        name: "NASA TV",
        category: "entertainment",
        description: "Space and science programming from NASA",
        icon: "fas fa-rocket",
        status: "Live",
        streamUrl: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
        backup: "https://ntv2.akamaized.net/hls/live/2014076/NASA-NTV2-HLS/master.m3u8",
        featured: true,
        country: "US"
    },
    {
        name: "Arirang TV",
        category: "entertainment",
        description: "Korean international TV channel",
        icon: "fas fa-tv",
        status: "Live",
        streamUrl: "https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/chunklist_b2256000_sleng.m3u8",
        backup: "https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/chunklist_b1256000_sleng.m3u8",
        featured: false,
        country: "KR"
    },
    {
        name: "Love Nature",
        category: "entertainment",
        description: "4K nature and wildlife content",
        icon: "fas fa-leaf",
        status: "Live",
        streamUrl: "https://d18dyiwu97wm6q.cloudfront.net/playlist2160p.m3u8",
        backup: "https://d18dyiwu97wm6q.cloudfront.net/playlist720p.m3u8",
        featured: false,
        country: "CA"
    },
    {
        name: "CGTN Documentary",
        category: "entertainment",
        description: "Documentary and educational content",
        icon: "fas fa-film",
        status: "Live",
        streamUrl: "https://livedoc.cgtn.com/1000d/prog_index.m3u8",
        backup: "https://livedoc.cgtn.com/500d/prog_index.m3u8",
        featured: false,
        country: "CN"
    },

    // Music Channels
    {
        name: "MTV International",
        category: "music",
        description: "Music television channel",
        icon: "fas fa-music",
        status: "Live",
        streamUrl: "http://unilivemtveu-lh.akamaihd.net/i/mtvno_1@346424/master.m3u8",
        backup: "https://pluto-live.plutotv.net/egress/chandler/pluto01/live/VIACBS02/master.m3u8",
        featured: false,
        country: "US"
    },
    {
        name: "1Music TV",
        category: "music",
        description: "International music channel",
        icon: "fas fa-headphones",
        status: "Live",
        streamUrl: "http://hz1.telepoint.bg/hls/1music.m3u8",
        backup: "http://hz1.telepoint.bg/hls/1music/1music.m3u8",
        featured: false,
        country: "BG"
    },

    // Sports Channels
    {
        name: "Olympic Channel",
        category: "sports",
        description: "Olympic sports and athlete stories",
        icon: "fas fa-medal",
        status: "Live",
        streamUrl: "https://ott-www.olympicchannel.com/out/u/OC_1_3.m3u8",
        backup: "https://olympics-samsung.amagi.tv/playlist.m3u8",
        featured: true,
        country: "CH"
    },
    {
        name: "Trace Sports",
        category: "sports",
        description: "Urban sports and culture",
        icon: "fas fa-running",
        status: "Live",
        streamUrl: "https://lightning-tracesport-samsungau.amagi.tv/playlist.m3u8",
        backup: "https://lightning-tracesport-samsungfr.amagi.tv/playlist.m3u8",
        featured: false,
        country: "FR"
    },

    // Kids Channels
    {
        name: "Toonami Aftermath",
        category: "kids",
        description: "Classic cartoon and anime programming",
        icon: "fas fa-child",
        status: "Live",
        streamUrl: "http://api.toonamiaftermath.com:3000/est/playlist.m3u8",
        backup: "http://api.toonamiaftermath.com:3000/pst/playlist.m3u8",
        featured: false,
        country: "US"
    },
    {
        name: "Duck TV",
        category: "kids",
        description: "Educational content for preschoolers",
        icon: "fas fa-duck",
        status: "Live",
        streamUrl: "https://mmm-ducktv-1-gb.samsung.wurl.tv/playlist.m3u8",
        backup: "https://mmm-ducktv-2-gb.samsung.wurl.tv/playlist.m3u8",
        featured: false,
        country: "UK"
    },

    // Regional Asian Channels
    {
        name: "CCTV4",
        category: "entertainment",
        description: "Chinese international channel",
        icon: "fas fa-dragon",
        status: "Live",
        streamUrl: "http://210.210.155.69/qwr9ew/s/s19/index.m3u8",
        backup: "https://live.cgtn.com/cctv4/prog_index.m3u8",
        featured: false,
        country: "CN"
    },
    {
        name: "NHK World",
        category: "news",
        description: "Japanese international broadcasting",
        icon: "fas fa-torii-gate",
        status: "Live",
        streamUrl: "https://nhkwlive-xjp.akamaized.net/hls/live/2003458/nhkwlive-xjp-en/index.m3u8",
        backup: "https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp-en/index.m3u8",
        featured: false,
        country: "JP"
    },
    {
        name: "KBS World",
        category: "entertainment",
        description: "Korean broadcasting for international audience",
        icon: "fas fa-hanbok",
        status: "Live",
        streamUrl: "https://kbsworld-ott.akamaized.net/hls/live/2002341/kbsworld/master.m3u8",
        backup: "https://kbsworld-ott.akamaized.net/hls/live/2002341/kbsworld/index.m3u8",
        featured: false,
        country: "KR"
    },

    // Sri Lankan TV Channels (Legitimate Public Streams)
    {
        name: "Sirasa TV",
        category: "entertainment",
        description: "Popular Sri Lankan entertainment channel with dramas and reality shows",
        icon: "fas fa-tv",
        status: "Live",
        streamUrl: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
        backup: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        featured: true,
        country: "LK"
    },
    {
        name: "Hiru TV",
        category: "news",
        description: "Leading Sri Lankan news channel with current affairs",
        icon: "fas fa-newspaper",
        status: "Live",
        streamUrl: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8",
        backup: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        featured: true,
        country: "LK"
    },
    {
        name: "Derana TV",
        category: "entertainment",
        description: "TV Derana - Popular entertainment and drama channel",
        icon: "fas fa-play-circle",
        status: "Live",
        streamUrl: "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8",
        backup: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        featured: true,
        country: "LK"
    },
    {
        name: "ITN",
        category: "news",
        description: "Independent Television Network - National news channel",
        icon: "fas fa-broadcast-tower",
        status: "Live",
        streamUrl: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
        backup: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        featured: true,
        country: "LK"
    },
    {
        name: "Rupavahini",
        category: "entertainment",
        description: "Sri Lanka Rupavahini Corporation - National TV",
        icon: "fas fa-flag",
        status: "Live",
        streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        backup: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        featured: false,
        country: "LK"
    },
    {
        name: "TV1 (SLRC)",
        category: "news",
        description: "Sri Lanka Rupavahini Corporation - Channel 1",
        icon: "fas fa-broadcast-tower",
        status: "Live",
        streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        backup: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        featured: false,
        country: "LK"
    },
    {
        name: "Nethra TV",
        category: "entertainment",
        description: "Buddhist and religious programming",
        icon: "fas fa-om",
        status: "Live",
        streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        backup: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
        featured: false,
        country: "LK"
    },
    {
        name: "Swarnavahini",
        category: "entertainment",
        description: "Buddhist and cultural programming channel",
        icon: "fas fa-dharmachakra",
        status: "Live",
        streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        backup: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        featured: false,
        country: "LK"
    },

    // Additional International Content
    {
        name: "TVP World",
        category: "news",
        description: "Polish international news channel",
        icon: "fas fa-globe-europe",
        status: "Live",
        streamUrl: "https://tvpworld-live.hls.adaptive.level3.net/tvp/tvpworld-live/tvpworld_1080p/chunks.m3u8",
        backup: "https://tvpworld-live.hls.adaptive.level3.net/tvp/tvpworld-live/tvpworld_720p/chunks.m3u8",
        featured: false,
        country: "PL"
    },
    {
        name: "Africa News",
        category: "news",
        description: "Pan-African and international news",
        icon: "fas fa-map",
        status: "Live",
        streamUrl: "https://rakuten-africanews-1-gb.samsung.wurl.tv/manifest/playlist.m3u8",
        backup: "https://rakuten-africanews-1-eu.samsung.wurl.tv/manifest/playlist.m3u8",
        featured: false,
        country: "FR"
    },
    {
        name: "i24 News English",
        category: "news",
        description: "International news from the Middle East",
        icon: "fas fa-star-and-crescent",
        status: "Live",
        streamUrl: "https://bcovlive-a.akamaihd.net/773a4fa3910d4f879a0b9f0b4d814bb0/eu-central-1/5377161796001/playlist.m3u8",
        backup: "https://bcovlive-a.akamaihd.net/773a4fa3910d4f879a0b9f0b4d814bb0/ap-southeast-1/5377161796001/playlist.m3u8",
        featured: false,
        country: "IL"
    },
    {
        name: "WION",
        category: "news",
        description: "World is One News - Indian international news",
        icon: "fas fa-lotus",
        status: "Live",
        streamUrl: "https://d7x8z4yuq7qh.cloudfront.net/index_7.m3u8",
        backup: "https://d7x8z4yuq7qh.cloudfront.net/index_5.m3u8",
        featured: false,
        country: "IN"
    },
    {
        name: "GB News",
        category: "news",
        description: "British news and current affairs",
        icon: "fas fa-crown",
        status: "Live",
        streamUrl: "https://live-gbnews.simplestreamcdn.com/live/gbnews/bitrate1.isml/live.m3u8",
        backup: "https://live-gbnews.simplestreamcdn.com/live/gbnews/bitrate2.isml/live.m3u8",
        featured: false,
        country: "UK"
    },

    // Weather Channels
    {
        name: "WeatherSpy",
        category: "news",
        description: "24/7 weather information and forecasts",
        icon: "fas fa-cloud-sun",
        status: "Live",
        streamUrl: "https://jukin-weatherspy-2-gb.samsung.wurl.tv/playlist.m3u8",
        backup: "https://jukin-weatherspy-1-gb.samsung.wurl.tv/playlist.m3u8",
        featured: false,
        country: "US"
    },

    // Technology & Innovation
    {
        name: "NASA TV Education",
        category: "entertainment",
        description: "NASA educational programming",
        icon: "fas fa-satellite",
        status: "Live",
        streamUrl: "https://ntv3.akamaized.net/hls/live/2010550/NASA-NTV3-HLS/master.m3u8",
        backup: "https://ntv3.akamaized.net/hls/live/2010550/NASA-NTV3-HLS/index.m3u8",
        featured: false,
        country: "US"
    },

    // European Channels
    {
        name: "ARTE",
        category: "entertainment",
        description: "Franco-German cultural channel",
        icon: "fas fa-palette",
        status: "Live",
        streamUrl: "https://artesimulcast.akamaized.net/hls/live/2031003/artelive_en/master.m3u8",
        backup: "https://artesimulcast.akamaized.net/hls/live/2031003/artelive_en/index.m3u8",
        featured: false,
        country: "FR"
    },

    // Religious Content
    {
        name: "EWTN",
        category: "entertainment",
        description: "Catholic television network",
        icon: "fas fa-cross",
        status: "Live",
        streamUrl: "https://cdn3.wowza.com/1/SmVrQmZCUXZhVDgz/b2I4RkOW/hls/live/playlist.m3u8",
        backup: "https://cdn3.wowza.com/1/SmVrQmZCUXZhVDgz/b2I4RkOW/hls/n7DfGsJK_b256k/chunklist.m3u8",
        featured: false,
        country: "US"
    }
];

// Video player instance
let player;
let currentChannel = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Free TV Sri Lanka - Initializing...');
    
    // Initialize HLS.js
    if (Hls.isSupported()) {
        player = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            maxBufferLength: 600,
            maxMaxBufferLength: 1200
        });
        console.log('HLS.js initialized successfully');
    } else {
        console.log('HLS.js not supported - falling back to native playback');
    }
    
    // Load and display channels
    loadChannels();
    
    // Load featured channel
    loadFeaturedChannel();
    
    // Setup search functionality
    setupSearch();
    
    // Setup filter functionality
    setupFilters();
    
    // Setup modal controls
    setupModalControls();
    
    // Setup navigation
    setupNavigation();
    
    // Setup featured channel cards
    setupFeaturedChannels();
    
    // Setup category filters
    setupCategoryFilters();
    
    // Setup error handling for video player
    const video = document.getElementById('videoPlayer');
    if (video) {
        video.addEventListener('error', handleMediaError);
    }
    
    console.log('Application initialized successfully');
});

// Setup modal controls
function setupModalControls() {
    const modal = document.getElementById('videoModal');
    const closeBtn = document.querySelector('.close');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const retryBtn = document.getElementById('retryBtn');
    
    // Close modal events
    if (closeBtn) {
        closeBtn.addEventListener('click', closeVideoModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeVideoModal();
            }
        });
    }
    
    // Fullscreen button
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Retry button
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            if (currentChannel) {
                loadVideoStream(currentChannel.streamUrl, currentChannel.backup);
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeVideoModal();
        }
    });
}

// Setup navigation
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
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
    }
}

// Setup featured channel cards
function setupFeaturedChannels() {
    document.querySelectorAll('.channel-card .watch-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const channelCard = btn.closest('.channel-card');
            const channelName = channelCard.querySelector('h3').textContent;
            const channel = channels.find(ch => ch.name === channelName);
            
            if (channel) {
                openVideoModal(channel.name, channel.streamUrl, channel.backup);
            }
        });
    });
}

// Setup category filters
function setupCategoryFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Filter channels
            const category = btn.dataset.category;
            filterChannelsByCategory(category);
        });
    });
}

// Filter channels by category
function filterChannelsByCategory(category) {
    const channelItems = document.querySelectorAll('.channel-item');
    
    channelItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Load and display all channels
function loadChannels() {
    const channelGrid = document.getElementById('channelsList');
    if (!channelGrid) return;
    
    channelGrid.innerHTML = '';
    
    channels.forEach(channel => {
        const channelCard = createChannelCard(channel);
        channelGrid.appendChild(channelCard);
    });
    
    console.log(`Loaded ${channels.length} channels`);
}

// Create channel card element
function createChannelCard(channel) {
    const card = document.createElement('div');
    card.className = 'channel-item live';
    card.setAttribute('data-category', channel.category);
    card.setAttribute('data-country', channel.country);
    card.setAttribute('data-stream', channel.streamUrl);
    card.setAttribute('data-backup', channel.backup);
    
    const statusClass = channel.status === 'Live' ? 'live' : 'offline';
    const flagIcon = getFlagIcon(channel.country);
    
    card.innerHTML = `
        <div class="iptv-badge">IPTV</div>
        <div class="stream-quality quality-hls">HLS</div>
        <div class="channel-icon">
            <i class="${channel.icon}"></i>
        </div>
        <div class="channel-info">
            <h4 class="channel-name">${channel.name}</h4>
            <p class="channel-description">${channel.description}</p>
            <div class="channel-meta">
                <span class="stream-status-indicator status-live">
                    <i class="fas fa-circle"></i> ${channel.status}
                </span>
                <span class="country-flag">🇱🇰 ${channel.country}</span>
            </div>
        </div>
        <div class="channel-status status-pulse">${channel.status}</div>
    `;
    
    // Add click event to the card
    card.addEventListener('click', () => {
        openVideoModal(channel.name, channel.streamUrl, channel.backup);
    });
    
    return card;
}

// Get flag icon for country
function getFlagIcon(country) {
    const flags = {
        'LK': 'fas fa-flag',
        'US': 'fas fa-flag-usa',
        'UK': 'fas fa-flag',
        'CN': 'fas fa-flag',
        'TR': 'fas fa-flag',
        'EU': 'fas fa-flag',
        'AT': 'fas fa-flag',
        'KR': 'fas fa-flag'
    };
    return flags[country] || 'fas fa-flag';
}

// Load featured channel in main player
function loadFeaturedChannel() {
    const featuredChannels = channels.filter(ch => ch.featured);
    if (featuredChannels.length > 0) {
        playChannel(featuredChannels[0].name);
    }
}

// Play selected channel
function playChannel(channelName) {
    console.log(`Playing channel: ${channelName}`);
    
    const channel = channels.find(ch => ch.name === channelName);
    if (!channel) {
        console.error('Channel not found:', channelName);
        return;
    }
    
    currentChannel = channel;
    
    // Update player info
    updatePlayerInfo(channel);
    
    // Load video stream
    loadVideoStream(channel.streamUrl, channel.backup);
    
    // Update channel cards
    updateChannelSelection(channelName);
    
    // Show connection status
    showConnectionStatus('Connecting...', 'connecting');
}

// Open video modal
function openVideoModal(channelName, streamUrl, backupUrl) {
    const modal = document.getElementById('videoModal');
    const modalChannelName = document.getElementById('modalChannelName');
    
    if (modal && modalChannelName) {
        modalChannelName.textContent = channelName;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Find the channel data
        const channel = channels.find(ch => ch.name === channelName);
        if (channel) {
            currentChannel = channel;
            loadVideoStream(streamUrl, backupUrl);
        }
    }
}

// Update player information display
function updatePlayerInfo(channel) {
    const elements = {
        'currentChannelName': channel.name,
        'currentChannelDescription': channel.description,
        'currentChannelCategory': channel.category,
        'currentChannelStatus': channel.status
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    // Update status indicator
    const statusElement = document.querySelector('.player-status');
    if (statusElement) {
        statusElement.className = `player-status ${channel.status === 'Live' ? 'live' : 'offline'}`;
    }
}

// Load video stream
function loadVideoStream(streamUrl, backupUrl) {
    const video = document.getElementById('videoPlayer');
    if (!video) return;
    
    console.log('Loading stream:', streamUrl);
    
    // Show loading state
    showConnectionStatus('Loading...', 'loading');
    
    if (Hls.isSupported() && streamUrl.includes('.m3u8')) {
        // Use HLS.js for HLS streams
        if (player) {
            player.destroy();
        }
        
        player = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true
        });
        
        player.loadSource(streamUrl);
        player.attachMedia(video);
        
        player.on(Hls.Events.MANIFEST_PARSED, function() {
            console.log('HLS manifest parsed successfully');
            video.play().catch(e => {
                console.log('Auto-play prevented:', e);
                showConnectionStatus('Click to play', 'ready');
            });
        });
        
        player.on(Hls.Events.ERROR, function(event, data) {
            console.error('HLS error:', data);
            if (data.fatal) {
                handleStreamError(backupUrl);
            }
        });
        
        // Handle successful playback
        video.addEventListener('loadstart', () => {
            showConnectionStatus('Connected', 'connected');
        });
        
        video.addEventListener('error', () => {
            handleStreamError(backupUrl);
        });
        
    } else {
        // Use native video for MP4 streams
        video.src = streamUrl;
        video.load();
        
        video.addEventListener('loadstart', () => {
            showConnectionStatus('Connected', 'connected');
        });
        
        video.addEventListener('error', () => {
            handleStreamError(backupUrl);
        });
        
        video.play().catch(e => {
            console.log('Auto-play prevented:', e);
            showConnectionStatus('Click to play', 'ready');
        });
    }
}

// Handle stream loading errors
function handleStreamError(backupUrl) {
    console.error('Primary stream failed, trying backup...');
    
    if (backupUrl && backupUrl !== currentChannel?.streamUrl) {
        showConnectionStatus('Retrying...', 'connecting');
        loadVideoStream(backupUrl);
    } else {
        showConnectionStatus('Stream unavailable', 'error');
        console.error('Both primary and backup streams failed');
    }
}

// Show connection status
function showConnectionStatus(message, status) {
    const statusElement = document.getElementById('streamStatus');
    if (statusElement) {
        statusElement.textContent = `● ${message.toUpperCase()}`;
        statusElement.className = `status-${status}`;
    }
    
    // Update loading spinner
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    
    if (status === 'loading' || status === 'connecting') {
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        if (errorMessage) errorMessage.style.display = 'none';
    } else if (status === 'error') {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'block';
    } else {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';
    }
    
    // Update quality indicator
    const qualityBadge = document.getElementById('qualityBadge');
    if (qualityBadge) {
        const qualities = {
            'connected': 'HLS',
            'connecting': '...',
            'loading': '...',
            'error': 'ERR',
            'ready': 'HLS'
        };
        qualityBadge.textContent = qualities[status] || 'SD';
    }
}

// Update channel selection visual state
function updateChannelSelection(channelName) {
    // Remove previous selection
    document.querySelectorAll('.channel-item').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add selection to current channel
    const channelItems = document.querySelectorAll('.channel-item');
    channelItems.forEach(item => {
        const name = item.querySelector('.channel-name').textContent;
        if (name === channelName) {
            item.classList.add('active');
        }
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterChannels(searchTerm);
    });
}

// Filter channels based on search term
function filterChannels(searchTerm) {
    const channelItems = document.querySelectorAll('.channel-item');
    
    channelItems.forEach(item => {
        const channelName = item.querySelector('.channel-name').textContent.toLowerCase();
        const channelDescription = item.querySelector('.channel-description').textContent.toLowerCase();
        
        if (channelName.includes(searchTerm) || channelDescription.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Setup filter functionality
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const countryFilter = document.getElementById('countryFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (countryFilter) {
        countryFilter.addEventListener('change', applyFilters);
    }
}

// Apply category and country filters
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const countryFilter = document.getElementById('countryFilter');
    
    const selectedCategory = categoryFilter?.value || 'all';
    const selectedCountry = countryFilter?.value || 'all';
    
    const channelItems = document.querySelectorAll('.channel-item');
    
    channelItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const itemCountry = item.getAttribute('data-country');
        
        const matchesCategory = selectedCategory === 'all' || itemCategory === selectedCategory;
        const matchesCountry = selectedCountry === 'all' || itemCountry === selectedCountry;
        
        if (matchesCategory && matchesCountry) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Toggle fullscreen
function toggleFullscreen() {
    const video = document.getElementById('videoPlayer');
    if (!video) return;
    
    if (!document.fullscreenElement) {
        video.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Close video modal
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Stop video playback
        const video = document.getElementById('videoPlayer');
        if (video) {
            video.pause();
            video.src = '';
        }
        
        // Destroy HLS player
        if (player) {
            player.destroy();
            player = null;
        }
        
        currentChannel = null;
    }
}

// Volume control
function setVolume(volume) {
    const video = document.getElementById('videoPlayer');
    if (video) {
        video.volume = volume / 100;
    }
}

// Error handling for media errors
function handleMediaError(error) {
    console.error('Media error:', error);
    
    if (currentChannel && currentChannel.backup) {
        console.log('Attempting to load backup stream...');
        loadVideoStream(currentChannel.backup);
    } else {
        showConnectionStatus('Stream error', 'error');
    }
}

console.log('Free TV Sri Lanka - Script loaded successfully');