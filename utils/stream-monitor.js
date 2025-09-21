// IPTV Stream Monitor - Health checking and failover management
// Monitors stream availability and manages automatic failover

class IPTVStreamMonitor {
    constructor(options = {}) {
        this.options = {
            checkInterval: options.checkInterval || 60000, // 1 minute
            timeout: options.timeout || 10000, // 10 seconds
            maxRetries: options.maxRetries || 3,
            retryDelay: options.retryDelay || 2000, // 2 seconds
            ...options
        };
        
        this.streams = new Map();
        this.monitoring = false;
        this.monitorInterval = null;
        this.events = {};
    }

    /**
     * Add stream to monitoring
     * @param {Object} stream - Stream configuration
     */
    addStream(stream) {
        const streamId = stream.id || this.generateId(stream.name);
        
        this.streams.set(streamId, {
            id: streamId,
            name: stream.name,
            url: stream.url,
            backupUrls: stream.backupUrls || [],
            category: stream.category || 'unknown',
            status: 'unknown',
            lastCheck: null,
            consecutiveFailures: 0,
            currentUrl: stream.url,
            responseTime: null,
            uptime: 0,
            downtimeStart: null,
            ...stream
        });
        
        this.emit('streamAdded', { streamId, stream: this.streams.get(streamId) });
        return streamId;
    }

    /**
     * Remove stream from monitoring
     * @param {string} streamId - Stream ID
     */
    removeStream(streamId) {
        if (this.streams.has(streamId)) {
            const stream = this.streams.get(streamId);
            this.streams.delete(streamId);
            this.emit('streamRemoved', { streamId, stream });
            return true;
        }
        return false;
    }

    /**
     * Start monitoring all streams
     */
    startMonitoring() {
        if (this.monitoring) return;
        
        this.monitoring = true;
        console.log(`Starting IPTV stream monitoring (${this.streams.size} streams)`);
        
        // Initial check
        this.checkAllStreams();
        
        // Schedule periodic checks
        this.monitorInterval = setInterval(() => {
            this.checkAllStreams();
        }, this.options.checkInterval);
        
        this.emit('monitoringStarted', { streamCount: this.streams.size });
    }

    /**
     * Stop monitoring
     */
    stopMonitoring() {
        if (!this.monitoring) return;
        
        this.monitoring = false;
        
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
        
        console.log('IPTV stream monitoring stopped');
        this.emit('monitoringStopped');
    }

    /**
     * Check all streams
     */
    async checkAllStreams() {
        if (this.streams.size === 0) return;
        
        console.log(`Checking ${this.streams.size} streams...`);
        const checkPromises = Array.from(this.streams.keys()).map(streamId => 
            this.checkStream(streamId)
        );
        
        await Promise.allSettled(checkPromises);
        
        this.emit('checkCompleted', {
            total: this.streams.size,
            online: this.getOnlineStreams().length,
            offline: this.getOfflineStreams().length
        });
    }

    /**
     * Check individual stream
     * @param {string} streamId - Stream ID
     */
    async checkStream(streamId) {
        const stream = this.streams.get(streamId);
        if (!stream) return;

        const startTime = Date.now();
        let isOnline = false;
        let responseTime = null;
        let error = null;

        try {
            isOnline = await this.testStreamUrl(stream.currentUrl);
            responseTime = Date.now() - startTime;

            if (!isOnline && stream.backupUrls.length > 0) {
                // Try backup URLs
                for (const backupUrl of stream.backupUrls) {
                    const backupStart = Date.now();
                    const backupOnline = await this.testStreamUrl(backupUrl);
                    
                    if (backupOnline) {
                        console.log(`Stream ${stream.name} failed over to backup: ${backupUrl}`);
                        stream.currentUrl = backupUrl;
                        isOnline = true;
                        responseTime = Date.now() - backupStart;
                        this.emit('failover', { streamId, oldUrl: stream.url, newUrl: backupUrl });
                        break;
                    }
                }
            }

        } catch (err) {
            error = err.message;
            console.error(`Error checking stream ${stream.name}:`, err);
        }

        // Update stream status
        const previousStatus = stream.status;
        stream.status = isOnline ? 'online' : 'offline';
        stream.lastCheck = new Date().toISOString();
        stream.responseTime = responseTime;

        if (isOnline) {
            stream.consecutiveFailures = 0;
            if (stream.downtimeStart) {
                const downtime = Date.now() - new Date(stream.downtimeStart).getTime();
                console.log(`Stream ${stream.name} recovered after ${Math.round(downtime / 1000)}s downtime`);
                stream.downtimeStart = null;
            }
            stream.uptime += this.options.checkInterval;
        } else {
            stream.consecutiveFailures++;
            if (!stream.downtimeStart) {
                stream.downtimeStart = new Date().toISOString();
            }
        }

        // Emit events for status changes
        if (previousStatus !== stream.status) {
            this.emit('statusChange', { 
                streamId, 
                stream, 
                previousStatus, 
                newStatus: stream.status 
            });

            if (stream.status === 'offline') {
                this.emit('streamOffline', { streamId, stream });
            } else {
                this.emit('streamOnline', { streamId, stream });
            }
        }

        this.streams.set(streamId, stream);
        return stream;
    }

    /**
     * Test if stream URL is accessible
     * @param {string} url - Stream URL to test
     * @returns {Promise<boolean>} Is stream accessible
     */
    async testStreamUrl(url) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);

            let response;
            
            if (typeof window !== 'undefined') {
                // Browser environment
                response = await fetch(url, {
                    method: 'HEAD',
                    signal: controller.signal,
                    mode: 'no-cors' // Allow cross-origin requests
                });
            } else {
                // Node.js environment
                const fetch = require('node-fetch');
                response = await fetch(url, {
                    method: 'HEAD',
                    signal: controller.signal,
                    timeout: this.options.timeout
                });
            }

            clearTimeout(timeoutId);
            
            // For M3U8 streams, also check content type
            if (url.includes('.m3u8')) {
                const contentType = response.headers.get('content-type');
                return response.ok && (
                    !contentType || 
                    contentType.includes('application/vnd.apple.mpegurl') ||
                    contentType.includes('application/x-mpegURL') ||
                    contentType.includes('text/plain')
                );
            }
            
            return response.ok;

        } catch (error) {
            // Handle network errors, timeouts, etc.
            return false;
        }
    }

    /**
     * Get stream by ID
     * @param {string} streamId - Stream ID
     * @returns {Object|null} Stream object
     */
    getStream(streamId) {
        return this.streams.get(streamId) || null;
    }

    /**
     * Get all streams
     * @returns {Array} Array of all streams
     */
    getAllStreams() {
        return Array.from(this.streams.values());
    }

    /**
     * Get online streams
     * @returns {Array} Array of online streams
     */
    getOnlineStreams() {
        return this.getAllStreams().filter(stream => stream.status === 'online');
    }

    /**
     * Get offline streams
     * @returns {Array} Array of offline streams
     */
    getOfflineStreams() {
        return this.getAllStreams().filter(stream => stream.status === 'offline');
    }

    /**
     * Get streams by category
     * @param {string} category - Category name
     * @returns {Array} Filtered streams
     */
    getStreamsByCategory(category) {
        return this.getAllStreams().filter(stream => stream.category === category);
    }

    /**
     * Get monitoring statistics
     * @returns {Object} Statistics
     */
    getStats() {
        const streams = this.getAllStreams();
        const online = streams.filter(s => s.status === 'online');
        const offline = streams.filter(s => s.status === 'offline');
        
        const avgResponseTime = online.reduce((sum, s) => sum + (s.responseTime || 0), 0) / online.length || 0;
        
        return {
            total: streams.length,
            online: online.length,
            offline: offline.length,
            uptime: online.length / streams.length * 100,
            averageResponseTime: Math.round(avgResponseTime),
            monitoring: this.monitoring,
            lastCheck: streams.length > 0 ? Math.max(...streams.map(s => new Date(s.lastCheck || 0).getTime())) : null
        };
    }

    /**
     * Generate unique ID
     * @param {string} name - Stream name
     * @returns {string} Unique ID
     */
    generateId(name) {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    }

    /**
     * Event emitter functionality
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Export monitoring data for analysis
     * @returns {Object} Export data
     */
    exportData() {
        return {
            streams: this.getAllStreams(),
            stats: this.getStats(),
            options: this.options,
            exportTime: new Date().toISOString()
        };
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IPTVStreamMonitor;
} else if (typeof window !== 'undefined') {
    window.IPTVStreamMonitor = IPTVStreamMonitor;
}