# Free TV - Live Television Streaming

A modern, responsive web application for streaming live TV channels from around the world.

**Created by CloudNextra Solutions**

## ✨ Features

- 🌍 Access to thousands of free live TV channels worldwide
- 📺 Modern, intuitive user interface with professional design
- 🔍 Advanced search and filtering capabilities
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Beautiful dark/light theme with smooth animations
- ⭐ Favorites system with persistent storage
- 🕒 Recently watched channels tracking
- 🎯 Filter by category, country, and language
- ▶️ Built-in video player with HLS support
- 📺 Picture-in-Picture and Fullscreen support
- 🔊 Stream quality selector
- 📢 Toast notifications for user feedback
- 🚀 Fast and lightweight with lazy loading

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)** - Dynamic functionality
- **HLS.js** - HTTP Live Streaming support
- **Font Awesome** - Icons
- **Google Fonts** - Poppins font family
- **IPTV-org API** - Channel data source

## Data Source

This project uses the [IPTV-org](https://github.com/iptv-org/iptv) project, which provides a collection of publicly available IPTV channels from around the world.

## Getting Started

### 🚀 Quick Start (Recommended)

**Option 1: Local Server (Recommended for full functionality)**
1. **Windows Users**: Double-click `start-server.bat`
2. **All Users**: Run `python serve.py` in the project directory
3. Open `http://localhost:8000` in your browser
4. Enjoy full functionality including API calls and heart animations!

**Option 2: Direct File Access**
1. **Clone or download this repository**
2. **Open the project**: Simply open `index.html` in a modern web browser
3. **Start watching**: Browse channels, search, and enjoy!

> 💡 **Note**: The local server method ensures all features work correctly, including API calls to IPTV-org

### 🧪 Testing

- Open `heart-test.html` to test heart functionality and animations
- Use the server method for comprehensive testing
- All heart features should work smoothly with proper animations

### 🛠️ Troubleshooting

**If hearts/favorites aren't working:**
1. Ensure JavaScript is enabled in your browser
2. Check browser console for any errors (F12)
3. Try using the local server method instead of direct file access
4. Clear browser cache and localStorage

**If IPTV streams aren't loading:**
1. Check your internet connection
2. Some streams may be geo-restricted
3. Try different channels from various countries
4. Use the local server for better API access

## Project Structure

```
free-tv/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Application logic
└── README.md          # This file
```

## Features in Detail

### 🔍 Advanced Search & Filtering
- Real-time search across channel names and alternative names
- Filter by category (News, Sports, Entertainment, etc.)
- Filter by country with flag display
- Filter by language
- Sort channels alphabetically or by country
- Clear all filters with one click

### 📺 Professional Video Player
- Supports HLS (m3u8) streams with quality selection
- Supports direct video streams
- Picture-in-Picture mode support
- Fullscreen mode with keyboard shortcuts
- Automatic stream detection and error recovery
- Loading overlays and retry functionality
- Stream quality selector for HLS streams

### ⭐ Favorites & History
- Add/remove channels from favorites
- Persistent favorites storage
- Recently watched channels tracking
- Quick access sidebar for favorites and recent
- Favorites counter in header

### 🎨 Theme & Design
- Dark and light theme toggle
- Professional gradient design
- Smooth animations and transitions
- Card hover effects with depth
- Professional loading states
- Toast notifications for user feedback

### 📱 Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly interface
- Optimized performance with lazy loading
- Scroll-to-top functionality

## Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## Limitations

- Stream availability depends on the IPTV-org database
- Some streams may not work due to geo-restrictions
- Stream quality varies by source
- Requires internet connection

## ✅ Current Features

- [x] Favorites/bookmarking system
- [x] Recently watched channels
- [x] Multiple stream quality options
- [x] User preferences/settings with theme toggle
- [x] Advanced search and filtering
- [x] Picture-in-Picture support
- [x] Fullscreen video player
- [x] Toast notifications

## 🚀 Future Enhancements

- [ ] Channel recommendations based on viewing history
- [ ] EPG (Electronic Program Guide) integration
- [ ] Chromecast support
- [ ] Keyboard shortcuts for player controls
- [ ] Export/import favorites
- [ ] Channel rating system
- [ ] Multi-language interface

## Contributing

This project was created by CloudNextra Solutions. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Credits

- **CloudNextra Solutions** - Development
- **IPTV-org** - Channel data and streams
- **Font Awesome** - Icons
- **HLS.js** - Video streaming library

## Disclaimer

This application does not host any content. All streams are provided by third parties through the IPTV-org project. The availability and legality of streams may vary by region.

## Contact

For questions or support, please contact:
- Email: info@cloudnextra.com

---

**© 2025 CloudNextra Solutions. All rights reserved.**
