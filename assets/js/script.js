// Sri Lankan TV Channels Data
const channels = [
    {
        name: "Sirasa TV",
        category: "entertainment",
        description: "Popular entertainment channel with dramas, reality shows, and news",
        icon: "fas fa-tv",
        status: "Live",
        streamUrl: "https://example.com/sirasa-stream", // Replace with actual stream URL
        featured: true
    },
    {
        name: "Hiru TV",
        category: "news",
        description: "Leading news channel with current affairs and political coverage",
        icon: "fas fa-newspaper",
        status: "Live",
        streamUrl: "https://example.com/hiru-stream",
        featured: true
    },
    {
        name: "Derana TV",
        category: "entertainment",
        description: "Entertainment channel with popular dramas and variety shows",
        icon: "fas fa-play-circle",
        status: "Live",
        streamUrl: "https://example.com/derana-stream",
        featured: true
    },
    {
        name: "ITN",
        category: "news",
        description: "Independent Television Network - News and current affairs",
        icon: "fas fa-broadcast-tower",
        status: "Live",
        streamUrl: "https://example.com/itn-stream",
        featured: true
    },
    {
        name: "Rupavahini",
        category: "entertainment",
        description: "National television of Sri Lanka",
        icon: "fas fa-flag",
        status: "Live",
        streamUrl: "https://example.com/rupavahini-stream",
        featured: false
    },
    {
        name: "TV Derana",
        category: "entertainment",
        description: "Entertainment and lifestyle programming",
        icon: "fas fa-heart",
        status: "Live",
        streamUrl: "https://example.com/tvderana-stream",
        featured: false
    },
    {
        name: "Ada Derana 24",
        category: "news",
        description: "24-hour news channel",
        icon: "fas fa-clock",
        status: "Live",
        streamUrl: "https://example.com/adaderana-stream",
        featured: false
    },
    {
        name: "Hiru News",
        category: "news",
        description: "24-hour Sinhala news channel",
        icon: "fas fa-rss",
        status: "Live",
        streamUrl: "https://example.com/hirunews-stream",
        featured: false
    },
    {
        name: "Charana TV",
        category: "entertainment",
        description: "Music and entertainment channel",
        icon: "fas fa-music",
        status: "Live",
        streamUrl: "https://example.com/charana-stream",
        featured: false
    },
    {
        name: "Swarnavahini",
        category: "entertainment",
        description: "Buddhist and cultural programming",
        icon: "fas fa-om",
        status: "Live",
        streamUrl: "https://example.com/swarnavahini-stream",
        featured: false
    },
    {
        name: "Wasantham TV",
        category: "entertainment",
        description: "Tamil language entertainment channel",
        icon: "fas fa-language",
        status: "Live",
        streamUrl: "https://example.com/wasantham-stream",
        featured: false
    },
    {
        name: "Channel C",
        category: "entertainment",
        description: "Contemporary entertainment and lifestyle",
        icon: "fas fa-sparkles",
        status: "Live",
        streamUrl: "https://example.com/channelc-stream",
        featured: false
    },
    {
        name: "TNL TV",
        category: "entertainment",
        description: "The National List Television",
        icon: "fas fa-list",
        status: "Live",
        streamUrl: "https://example.com/tnl-stream",
        featured: false
    },
    {
        name: "Supreme TV",
        category: "entertainment",
        description: "Entertainment and variety programming",
        icon: "fas fa-crown",
        status: "Live",
        streamUrl: "https://example.com/supreme-stream",
        featured: false
    },
    {
        name: "Verbum TV",
        category: "entertainment",
        description: "Christian television programming",
        icon: "fas fa-cross",
        status: "Live",
        streamUrl: "https://example.com/verbum-stream",
        featured: false
    },
    {
        name: "Rangiri Dambulla TV",
        category: "entertainment",
        description: "Local entertainment and cultural shows",
        icon: "fas fa-mountain",
        status: "Live",
        streamUrl: "https://example.com/rangiri-stream",
        featured: false
    },
    {
        name: "Zoom TV",
        category: "kids",
        description: "Children's entertainment and educational content",
        icon: "fas fa-child",
        status: "Live",
        streamUrl: "https://example.com/zoom-stream",
        featured: false
    },
    {
        name: "TV 1",
        category: "entertainment",
        description: "General entertainment programming",
        icon: "fas fa-one",
        status: "Live",
        streamUrl: "https://example.com/tv1-stream",
        featured: false
    },
    {
        name: "ETV",
        category: "entertainment",
        description: "Education Television",
        icon: "fas fa-graduation-cap",
        status: "Live",
        streamUrl: "https://example.com/etv-stream",
        featured: false
    },
    {
        name: "Lanka Sports Channel",
        category: "sports",
        description: "Sports coverage and commentary",
        icon: "fas fa-football-ball",
        status: "Live",
        streamUrl: "https://example.com/lankasports-stream",
        featured: false
    },
    {
        name: "Shakthi TV",
        category: "entertainment",
        description: "Tamil entertainment and news",
        icon: "fas fa-bolt",
        status: "Live",
        streamUrl: "https://example.com/shakthi-stream",
        featured: false
    },
    {
        name: "IBC Tamil",
        category: "entertainment",
        description: "Tamil language programming",
        icon: "fas fa-globe-asia",
        status: "Live",
        streamUrl: "https://example.com/ibc-stream",
        featured: false
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

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    renderChannels('all');
    initializeModalEvents();
    initializeSmoothScrolling();
    initializeChannelCards();
});

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

// Channel rendering functionality
function renderChannels(category) {
    let filteredChannels = channels;
    
    if (category !== 'all') {
        filteredChannels = channels.filter(channel => channel.category === category);
    }

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

    // Add click events to new channel items
    document.querySelectorAll('.channel-item').forEach(item => {
        item.addEventListener('click', () => {
            const channelName = item.querySelector('h4').textContent;
            const streamUrl = item.dataset.stream;
            openVideoModal(channelName, streamUrl);
        });
    });
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
                openVideoModal(channelName, channelData.streamUrl);
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

function openVideoModal(channelName, streamUrl) {
    modalChannelName.textContent = channelName;
    
    // Note: For demonstration purposes, we're showing a placeholder
    // In a real implementation, you would use actual streaming URLs
    if (streamUrl && streamUrl !== "https://example.com/sirasa-stream") {
        videoPlayer.src = streamUrl;
    } else {
        // Show a message for demo purposes
        videoPlayer.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #000; color: white; text-align: center; padding: 2rem;">
                <i class="fas fa-tv" style="font-size: 4rem; color: #ff6b35; margin-bottom: 1rem;"></i>
                <h3>${channelName}</h3>
                <p style="margin: 1rem 0;">This is a demo version. In the full implementation, live streams would be available here.</p>
                <p style="color: #888; font-size: 0.9rem;">Please contact Cloudnextra Solutions for stream integration.</p>
            </div>
        `;
        placeholder.className = 'video-placeholder';
        document.querySelector('.video-container').appendChild(placeholder);
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Stop video playback
    videoPlayer.pause();
    videoPlayer.src = '';
    videoPlayer.style.display = 'block';
    
    // Remove placeholder if exists
    const placeholder = document.querySelector('.video-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
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
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ff4757' : '#2ed573'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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