# 📺 Nextra TV - Official Dialog TV Channels Streaming

A professional, fast-loading TV streaming website featuring official Dialog TV channels (125 channels) with a modern UI built with HTML, CSS, and JavaScript.

## ✨ Features

### 🎯 Core Features
- **Official Dialog TV 125 Channels Only** - Automatically filters and displays only official Dialog TV channels from https://www.dialog.lk/dialog-television/channels
- **Fast Loading** - Optimized for speed with caching and lazy loading
- **Professional Design** - Modern dark-themed UI with smooth animations
- **Responsive** - Works perfectly on desktop, tablet, and mobile devices
- **Search Functionality** - Quickly find channels by name
- **Category Filtering** - Browse channels by categories (Sports, Movies, News, Kids, Music)
- **Live Playback** - Stream channels directly in the browser

### 🚀 Performance Optimizations
- **Caching** - Channels are cached for 1 hour to reduce API calls
- **Lazy Loading** - Images load only when visible
- **Minimal Dependencies** - Pure HTML, CSS, and JavaScript (no frameworks)
- **Smooth Animations** - GPU-accelerated CSS transitions
- **Efficient Rendering** - Optimized DOM manipulation

### 🎨 Design Features
- **Modern UI** - Dark theme with vibrant accents
- **Smooth Transitions** - Professional hover effects and animations
- **Gradient Backgrounds** - Eye-catching visual design
- **Skeleton Loaders** - Better loading experience
- **Mobile-First** - Optimized for all screen sizes
- **Accessibility** - Semantic HTML and keyboard shortcuts

## 📋 How to Use

### 1. **Open the Website**
Simply open `index.html` in any modern web browser:
- Right-click → Open with Browser
- Or drag `index.html` to your browser

### 2. **Browse Channels**
- **Search**: Use the search bar at the top to find channels by name
- **Filter**: Click category buttons to filter by type (Sports, Movies, News, etc.)
- **View All**: Click "All Channels" to see the complete list

### 3. **Watch Channels**
- **Click on a channel card** to start playing
- **Click the play button** on the channel card
- **Use video controls** to pause, volume, or fullscreen

### 4. **Keyboard Shortcuts**
- **ESC** - Close the video player
- **SPACE** - Play/Pause when video player is open

## 📊 Statistics

The dashboard shows:
- **Total Channels** - Number of Dialog TV channels available (125 official channels)
- **Categories** - Number of different channel categories

## 📺 Channel Categories (125 Channels)

Based on Dialog TV's official lineup from their website:

### 🇱🇰 Sri Lankan Channels (20+ channels)
- **News**: Sirasa, Hiru, Derana, ITN, News First, Siyatha News, Capital TV
- **Entertainment**: Sirasa TV, Hiru TV, Derana, ITN, Rupavahini, TV1
- **Regional**: Shakthi TV, Vasantham TV, Charana TV, Supreme TV, Nethra TV
- **Specialty**: Buddhist TV, Shraddha TV, Swarnavahini, Eye TV

### 🎬 Entertainment Channels (30+ channels)
- **Hindi**: Zee TV, Star Plus, Colors, Sony Entertainment, SAB TV, Star Utsav
- **Tamil**: Sun TV, Star Vijay, Zee Tamil, Kalaignar, Jaya TV, Raj TV, Polimer TV
- **Telugu**: ETV Plus, ETV Telugu, Gemini, Maa TV, Zee Telugu
- **General**: Thanthi TV, Vendhar TV, Captain TV, Malai Murasu

### 🎥 Movie Channels (25+ channels)
- **Hindi Movies**: Zee Cinema, Star Gold, Sony Max, &Pictures, Movies Now
- **Regional Movies**: Zee Thirai, Jaya Movie, Gemini Movies, Star Gold Select
- **Premium**: HBO, Star Movies, &Prive, Fox Movies, Fox Action Movies
- **Bollywood**: Zee Bollywood, Zee Classic, B4U Movies, Colors Cineplex

### ⚽ Sports Channels (15+ channels)
- **Star Sports**: Star Sports 1, 2, 3, Select, First
- **Sony Sports**: Sony Six, Sony Ten 1, 2, 3, Sony Ten Golf, Sony ESPN
- **Others**: Ten Sports, Euro Sport, DD Sports, WWE Network, DSport

### 📰 News Channels (20+ channels)
- **International**: CNN, BBC World News, Al Jazeera, Sky News, France 24, DW, CGTN
- **Sri Lankan**: News First, Hiru News, Derana News, Sirasa News, ITN News, Siyatha News
- **Indian**: Times Now, News 18, Republic TV, NDTV 24x7, Zee News, Aaj Tak
- **Regional**: News7 Tamil, Puthiya Thalaimurai, India Today

### 🎨 Kids & Family (13+ channels)
- **Cartoons**: Cartoon Network, Nickelodeon, Nick Jr, Pogo, Sonic
- **Kids**: Disney Channel, Disney Junior, Discovery Kids, Hungama
- **Toddlers**: Baby TV, Chutti TV, Kochu TV

### 🎵 Music Channels (10+ channels)
- **International**: MTV, VH1, Zoom, MTV Beats
- **Indian**: 9XM, 9X Jalwa, 9X Tashan, Mastiii, Zing
- **Regional**: Sirippoli, Sun Music, Isai Aruvi, B4U Music, Raj Musix

### 📚 Knowledge & Documentary (12+ channels)
- **Discovery**: Discovery Channel, Discovery Science, Discovery Turbo
- **Wildlife**: Animal Planet, National Geographic, Nat Geo Wild
- **Lifestyle**: TLC, Travel XP, Fox Life, Living Foodz
- **Educational**: History TV18, Sony BBC Earth, Epic TV

### 🌟 Lifestyle & Premium (5+ channels)
- Star World, Comedy Central, AXN, Warner TV
- Fashion TV, E24, Romance TV, Care World, Goodness TV

## 🔧 Technical Details

### Technology Stack
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (Vanilla)** - No frameworks, pure ES6+

### Browser Support
- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### API Source
- **IPTV-ORG** - Free, regularly updated M3U playlist
- URL: `https://iptv-org.github.io/iptv/index.m3u`

## 🎮 Features Explained

### Category Detection
The app automatically categorizes channels based on keywords:
- **⚽ Sports** - Cricket, football, soccer, sports channels
- **🎬 Movies** - Movie channels, cinema, HBO
- **📰 News** - News networks, CNN, BBC
- **🎨 Kids** - Cartoon, children's content
- **🎵 Music** - Music channels, VEVO

### Caching System
- Channels are cached in browser's localStorage
- Cache expires after 1 hour
- Reduces bandwidth and speeds up loading

### Error Handling
- Graceful error messages if channels fail to load
- Offline channel detection
- Automatic retry suggestions

## 📱 Responsive Design

**Desktop View:**
- 6-7 channels per row
- Full-width search and filters

**Tablet View:**
- 3-4 channels per row
- Optimized touch interactions

**Mobile View:**
- 2 channels per row
- Touch-friendly buttons and controls

## 🔐 Privacy & Performance

- ✅ No tracking or analytics
- ✅ No ads or pop-ups
- ✅ All processing done locally in browser
- ✅ No data stored on servers
- ✅ Minimal network requests

## 🛠️ Customization

### Add More Filters
Edit the `CONFIG` object in `script.js`:
```javascript
CONFIG.categoryKeywords = {
    sports: ['sport', 'football', 'cricket'],
    // Add more categories here
}
```

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #FF6B35;
    --secondary-color: #004E89;
    /* Modify colors here */
}
```

### Adjust Refresh Rate
Change cache time in `script.js`:
```javascript
CONFIG.cacheTime = 3600000; // 1 hour in milliseconds
```

## 🐛 Troubleshooting

**Issue:** "Failed to load channels"
- **Solution:** Check internet connection and refresh the page

**Issue:** Video won't play
- **Solution:** The stream may be offline. Try another channel

**Issue:** Slow loading
- **Solution:** Clear browser cache and refresh. First load may take longer

**Issue:** No channels showing
- **Solution:** Check if you're searching with specific keywords. Try "All Channels"

## 📝 File Structure

```
Nextra TV/
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
├── script.js           # JavaScript logic and data fetching
└── README.md          # This file
```

## 🚀 Getting Started

1. **Extract files** to any folder
2. **Open `index.html`** in your web browser
3. **Wait for channels to load** (first time takes ~5-10 seconds)
4. **Start watching!** 📺

## 💡 Tips

- 💾 **Bookmark the file** for quick access
- 🎬 **Fullscreen mode** - Press F11 for immersive viewing
- 📱 **Add to home** - On mobile, add to home screen for app-like experience
- 🔄 **Refresh occasionally** - Get the latest channel list periodically

## 📄 License

This project uses data from IPTV-ORG (https://iptv-org.github.io/iptv/), which is maintained by a community of developers.

## ❓ FAQ

**Q: Are these channels legal?**
A: This application simply displays publicly available M3U playlists. It's your responsibility to ensure legal compliance in your region.

**Q: Can I download channels?**
A: The application is designed for streaming only. Recording streams may violate terms of service.

**Q: Why only Dialog TV channels?**
A: The app is configured to filter and display only the official 125 Dialog TV channels based on their official channel lineup at https://www.dialog.lk/dialog-television/channels. This provides a curated, legal viewing experience with all Dialog TV offerings.

**Q: Which channels are included?**
A: All 125 official Dialog TV channels including:
- **20+ Sri Lankan channels** (Sirasa, Hiru, Derana, ITN, Rupavahini, News First, etc.)
- **30+ Entertainment channels** (Zee TV, Star Plus, Colors, Sony, Sun TV, Star Vijay, etc.)
- **25+ Movie channels** (Zee Cinema, Star Gold, Sony Max, HBO, Star Movies, etc.)
- **15+ Sports channels** (Star Sports 1-3, Sony Six, Sony Ten 1-3, WWE, Euro Sport, etc.)
- **20+ News channels** (CNN, BBC, Al Jazeera, Sky News, Times Now, NDTV, Republic TV, etc.)
- **13+ Kids channels** (Cartoon Network, Disney, Nickelodeon, Pogo, Baby TV, etc.)
- **10+ Music channels** (MTV, VH1, 9XM, Zoom, MTV Beats, Sirippoli, etc.)
- **12+ Documentary channels** (Discovery, National Geographic, Animal Planet, History TV, etc.)

**Q: Are all 125 channels available for streaming?**
A: The app will display all Dialog TV channels found in the IPTV source. Stream availability depends on the IPTV provider's live streams.

**Q: Can I run this offline?**
A: After initial load, channels are cached locally. However, the video streams require internet connection.

---

**Enjoy streaming!** 🎬📺

For issues or suggestions, ensure your browser is up-to-date and try clearing cache.
