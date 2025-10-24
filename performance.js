// Performance monitoring and optimization for Free TV
(function() {
    'use strict';
    
    // Performance metrics
    const performance_metrics = {
        startTime: performance.now(),
        loadEvents: {},
        renderTimes: [],
        memoryUsage: []
    };
    
    // Track load events
    function trackLoadEvent(name, startTime) {
        performance_metrics.loadEvents[name] = {
            duration: performance.now() - startTime,
            timestamp: Date.now()
        };
    }
    
    // Monitor memory usage (if available)
    function monitorMemory() {
        if (performance.memory) {
            performance_metrics.memoryUsage.push({
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                timestamp: Date.now()
            });
        }
    }
    
    // Optimize images using WebP when supported
    function optimizeImages() {
        if (window.createImageBitmap) {
            // Modern browsers support WebP
            const testWebP = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            };
            
            if (testWebP()) {
                // Add WebP support class to body
                document.body.classList.add('webp-support');
            }
        }
    }
    
    // Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            'https://iptv-org.github.io/api/channels.json',
            'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2'
        ];
        
        criticalResources.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        });
    }
    
    // Debounced scroll handler for performance
    function createDebouncedScrollHandler() {
        let ticking = false;
        
        return function(callback) {
            if (!ticking) {
                requestAnimationFrame(() => {
                    callback();
                    ticking = false;
                });
                ticking = true;
            }
        };
    }
    
    // Initialize performance optimizations
    function initPerformanceOptimizations() {
        // Track page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                trackLoadEvent('DOM_LOADED', performance_metrics.startTime);
            });
        }
        
        window.addEventListener('load', () => {
            trackLoadEvent('WINDOW_LOADED', performance_metrics.startTime);
            
            // Log performance summary
            setTimeout(() => {
                console.group('🚀 Free TV Performance Metrics');
                console.log('Load Events:', performance_metrics.loadEvents);
                console.log('Navigation Timing:', performance.getEntriesByType('navigation')[0]);
                if (performance.memory) {
                    console.log('Memory Usage:', performance.memory);
                }
                console.groupEnd();
            }, 1000);
        });
        
        // Monitor memory periodically
        if (performance.memory) {
            setInterval(monitorMemory, 30000); // Every 30 seconds
        }
        
        // Optimize images
        optimizeImages();
        
        // Preload critical resources
        preloadCriticalResources();
        
        // Add optimized scroll handler to window
        window.optimizedScrollHandler = createDebouncedScrollHandler();
    }
    
    // Cleanup function for memory management
    function cleanup() {
        // Clean up observers and listeners when page unloads
        window.addEventListener('beforeunload', () => {
            if (window.channelImageObserver) {
                window.channelImageObserver.disconnect();
            }
            
            // Clear any intervals
            performance_metrics.intervals?.forEach(clearInterval);
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);
    } else {
        initPerformanceOptimizations();
    }
    
    cleanup();
    
    // Expose performance metrics globally for debugging
    window.FreeTV_Performance = performance_metrics;
})();