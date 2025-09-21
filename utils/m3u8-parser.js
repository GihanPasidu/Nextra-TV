// M3U8 Playlist Parser for IPTV Streams
// Handles parsing of M3U8 playlists and extracting channel information

class M3U8Parser {
    constructor() {
        this.channels = [];
        this.metadata = {};
    }

    /**
     * Parse M3U8 playlist content
     * @param {string} content - Raw M3U8 playlist content
     * @returns {Object} Parsed playlist data
     */
    parse(content) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        const channels = [];
        let currentChannel = {};
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.startsWith('#EXTM3U')) {
                // Playlist header
                this.metadata.version = this.extractValue(line, 'version') || '1';
                continue;
            }
            
            if (line.startsWith('#EXT-X-VERSION:')) {
                this.metadata.version = line.split(':')[1];
                continue;
            }
            
            if (line.startsWith('#EXTINF:')) {
                // Channel information line
                currentChannel = this.parseExtinf(line);
                continue;
            }
            
            if (line.startsWith('http')) {
                // Stream URL
                if (Object.keys(currentChannel).length > 0) {
                    currentChannel.url = line;
                    currentChannel.id = this.generateChannelId(currentChannel.name);
                    currentChannel.status = 'unknown';
                    currentChannel.quality = this.detectQuality(line);
                    channels.push({ ...currentChannel });
                    currentChannel = {};
                }
                continue;
            }
            
            // Handle other M3U8 directives
            if (line.startsWith('#EXT-X-')) {
                this.parseExtendedDirective(line);
            }
        }
        
        this.channels = channels;
        return {
            metadata: this.metadata,
            channels: this.channels,
            totalChannels: channels.length
        };
    }

    /**
     * Parse EXTINF line to extract channel information
     * @param {string} line - EXTINF line
     * @returns {Object} Channel information
     */
    parseExtinf(line) {
        const channel = {};
        
        // Extract duration
        const durationMatch = line.match(/#EXTINF:([^,]*),/);
        if (durationMatch) {
            channel.duration = parseFloat(durationMatch[1]);
        }
        
        // Extract attributes
        channel.tvgId = this.extractAttribute(line, 'tvg-id');
        channel.tvgName = this.extractAttribute(line, 'tvg-name');
        channel.tvgLogo = this.extractAttribute(line, 'tvg-logo');
        channel.groupTitle = this.extractAttribute(line, 'group-title');
        channel.language = this.extractAttribute(line, 'tvg-language') || 'si';
        channel.country = this.extractAttribute(line, 'tvg-country') || 'LK';
        
        // Extract channel name (last part after last comma)
        const nameMatch = line.match(/,([^,]*)$/);
        if (nameMatch) {
            channel.name = nameMatch[1].trim();
        }
        
        // Categorize channel
        channel.category = this.categorizeChannel(channel.name, channel.groupTitle);
        
        return channel;
    }

    /**
     * Extract attribute value from EXTINF line
     * @param {string} line - EXTINF line
     * @param {string} attribute - Attribute name
     * @returns {string|null} Attribute value
     */
    extractAttribute(line, attribute) {
        const regex = new RegExp(`${attribute}="([^"]*)"`, 'i');
        const match = line.match(regex);
        return match ? match[1] : null;
    }

    /**
     * Extract value from directive
     * @param {string} line - Directive line
     * @param {string} key - Key to extract
     * @returns {string|null} Value
     */
    extractValue(line, key) {
        const regex = new RegExp(`${key}=([^\\s,]*)`, 'i');
        const match = line.match(regex);
        return match ? match[1] : null;
    }

    /**
     * Parse extended M3U8 directives
     * @param {string} line - Directive line
     */
    parseExtendedDirective(line) {
        if (line.startsWith('#EXT-X-STREAM-INF:')) {
            // Handle quality variants
            const bandwidth = this.extractValue(line, 'BANDWIDTH');
            const resolution = this.extractValue(line, 'RESOLUTION');
            
            if (!this.metadata.variants) {
                this.metadata.variants = [];
            }
            
            this.metadata.variants.push({
                bandwidth: bandwidth ? parseInt(bandwidth) : null,
                resolution: resolution || null
            });
        }
    }

    /**
     * Generate unique channel ID
     * @param {string} name - Channel name
     * @returns {string} Unique ID
     */
    generateChannelId(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
    }

    /**
     * Categorize channel based on name and group
     * @param {string} name - Channel name
     * @param {string} group - Group title
     * @returns {string} Category
     */
    categorizeChannel(name, group) {
        const nameL = name.toLowerCase();
        const groupL = (group || '').toLowerCase();
        
        if (nameL.includes('news') || nameL.includes('24') || groupL.includes('news')) {
            return 'news';
        }
        
        if (nameL.includes('sport') || groupL.includes('sport')) {
            return 'sports';
        }
        
        if (nameL.includes('music') || groupL.includes('music')) {
            return 'music';
        }
        
        if (nameL.includes('kids') || nameL.includes('children') || groupL.includes('kids')) {
            return 'kids';
        }
        
        if (nameL.includes('movie') || nameL.includes('cinema') || groupL.includes('movie')) {
            return 'movies';
        }
        
        return 'entertainment';
    }

    /**
     * Detect stream quality from URL
     * @param {string} url - Stream URL
     * @returns {string} Quality indicator
     */
    detectQuality(url) {
        const urlL = url.toLowerCase();
        
        if (urlL.includes('1080p') || urlL.includes('hd')) {
            return 'HD';
        }
        
        if (urlL.includes('720p')) {
            return 'HD';
        }
        
        if (urlL.includes('480p') || urlL.includes('sd')) {
            return 'SD';
        }
        
        // Check for HLS indicators
        if (urlL.includes('.m3u8')) {
            return 'HLS';
        }
        
        return 'Standard';
    }

    /**
     * Filter channels by category
     * @param {string} category - Category to filter by
     * @returns {Array} Filtered channels
     */
    getChannelsByCategory(category) {
        return this.channels.filter(channel => channel.category === category);
    }

    /**
     * Get Sri Lankan channels only
     * @returns {Array} Sri Lankan channels
     */
    getSriLankanChannels() {
        return this.channels.filter(channel => 
            channel.country === 'LK' || 
            channel.groupTitle?.toLowerCase().includes('sri lanka') ||
            this.isSriLankanChannel(channel.name)
        );
    }

    /**
     * Check if channel name indicates Sri Lankan origin
     * @param {string} name - Channel name
     * @returns {boolean} Is Sri Lankan channel
     */
    isSriLankanChannel(name) {
        const sriLankanChannels = [
            'sirasa', 'hiru', 'derana', 'itn', 'rupavahini', 'swarnavahini',
            'wasantham', 'shakthi', 'channel eye', 'art tv', 'charana tv'
        ];
        
        const nameL = name.toLowerCase();
        return sriLankanChannels.some(channel => nameL.includes(channel));
    }

    /**
     * Validate M3U8 content
     * @param {string} content - Content to validate
     * @returns {boolean} Is valid M3U8
     */
    static isValidM3U8(content) {
        return content.trim().startsWith('#EXTM3U') || content.includes('#EXTINF:');
    }

    /**
     * Convert channels back to M3U8 format
     * @returns {string} M3U8 playlist
     */
    toM3U8() {
        let playlist = '#EXTM3U\n';
        playlist += `#EXT-X-VERSION:${this.metadata.version || '3'}\n\n`;
        
        this.channels.forEach(channel => {
            const attributes = [];
            
            if (channel.tvgId) attributes.push(`tvg-id="${channel.tvgId}"`);
            if (channel.tvgName) attributes.push(`tvg-name="${channel.tvgName}"`);
            if (channel.tvgLogo) attributes.push(`tvg-logo="${channel.tvgLogo}"`);
            if (channel.groupTitle) attributes.push(`group-title="${channel.groupTitle}"`);
            if (channel.language) attributes.push(`tvg-language="${channel.language}"`);
            if (channel.country) attributes.push(`tvg-country="${channel.country}"`);
            
            const attributeString = attributes.length > 0 ? ` ${attributes.join(' ')}` : '';
            
            playlist += `#EXTINF:${channel.duration || -1}${attributeString},${channel.name}\n`;
            playlist += `${channel.url}\n\n`;
        });
        
        return playlist;
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = M3U8Parser;
} else if (typeof window !== 'undefined') {
    window.M3U8Parser = M3U8Parser;
}