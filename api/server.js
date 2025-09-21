// Simple streaming API for fetching live channel data
// This can be deployed to Vercel, Netlify, or any Node.js hosting

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// Channel data with multiple streaming sources
const streamingSources = {
    "sirasa": [
        "https://live.sirasa.tv/live/sirasa/index.m3u8",
        "https://live.lankatv.net/live/sirasa/index.m3u8",
        "https://stream.sirasa.lk/live/sirasa/playlist.m3u8"
    ],
    "hiru": [
        "https://live.hirunews.lk/live/hiru/index.m3u8",
        "https://live.lankatv.net/live/hiru/index.m3u8",
        "https://stream.hiru.lk/live/hiru/playlist.m3u8"
    ],
    "derana": [
        "https://live.adaderana.lk/live/derana/index.m3u8",
        "https://live.lankatv.net/live/derana/index.m3u8",
        "https://stream.derana.lk/live/derana/playlist.m3u8"
    ],
    "itn": [
        "https://live.itn.lk/live/itn/index.m3u8",
        "https://live.lankatv.net/live/itn/index.m3u8",
        "https://stream.itn.lk/live/itn/playlist.m3u8"
    ],
    "rupavahini": [
        "https://live.rupavahini.lk/live/rupavahini/index.m3u8",
        "https://live.lankatv.net/live/rupavahini/index.m3u8"
    ]
};

// API endpoint to get working stream URL
app.get('/api/stream/:channel', async (req, res) => {
    const channel = req.params.channel.toLowerCase();
    const urls = streamingSources[channel];
    
    if (!urls) {
        return res.status(404).json({ 
            error: 'Channel not found',
            available: Object.keys(streamingSources)
        });
    }

    // Test each URL to find working one
    for (const url of urls) {
        try {
            const response = await axios.head(url, { timeout: 5000 });
            if (response.status === 200) {
                return res.json({
                    channel: channel,
                    streamUrl: url,
                    status: 'live',
                    quality: 'auto',
                    backup: urls.filter(u => u !== url)[0] || null
                });
            }
        } catch (error) {
            console.log(`Failed to connect to ${url}`);
        }
    }

    // If no URL works, return the first one anyway
    res.json({
        channel: channel,
        streamUrl: urls[0],
        status: 'offline',
        quality: 'auto',
        backup: urls[1] || null,
        warning: 'Stream may be temporarily unavailable'
    });
});

// API endpoint to get all channels status
app.get('/api/channels', async (req, res) => {
    const channels = [];
    
    for (const [channel, urls] of Object.entries(streamingSources)) {
        let isLive = false;
        let workingUrl = urls[0];
        
        // Quick check for first URL
        try {
            const response = await axios.head(urls[0], { timeout: 3000 });
            isLive = response.status === 200;
            workingUrl = urls[0];
        } catch (error) {
            // Try backup URL
            try {
                const response = await axios.head(urls[1], { timeout: 3000 });
                isLive = response.status === 200;
                workingUrl = urls[1];
            } catch (error) {
                isLive = false;
            }
        }
        
        channels.push({
            name: channel,
            streamUrl: workingUrl,
            backup: urls[1] || null,
            status: isLive ? 'live' : 'offline',
            lastChecked: new Date().toISOString()
        });
    }
    
    res.json({
        channels: channels,
        totalChannels: channels.length,
        liveChannels: channels.filter(c => c.status === 'live').length
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'Free TV Sri Lanka API',
        provider: 'Cloudnextra Solutions',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Free TV API running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});