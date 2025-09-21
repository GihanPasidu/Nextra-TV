# Deployment Instructions - Free TV Sri Lanka

## 🚀 Quick Setup Guide

### Option 1: Local Development (Immediate Testing)

1. **Start the website**
   ```bash
   # Double-click start-server.bat or run:
   python -m http.server 8000
   ```

2. **Start the API (Optional)**
   ```bash
   cd api
   npm install
   npm start
   ```

3. **Open browser**: `http://localhost:8000`

### Option 2: Deploy to Live Server

#### Frontend Deployment (Static Files)

**Netlify (Recommended - Free)**
1. Drag and drop the entire folder (except `api/`) to netlify.com
2. Your site will be live at `https://your-site-name.netlify.app`

**Vercel**
1. Connect your GitHub repo to vercel.com
2. Deploy automatically

**Traditional Web Hosting**
1. Upload all files (except `api/`) via FTP
2. Point your domain to the hosting server

#### Backend API Deployment

**Vercel (For API)**
1. Create `vercel.json` in api folder:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

2. Deploy the `api/` folder to Vercel
3. Update `API_BASE_URL` in `script.js` to your Vercel API URL

**Heroku**
1. Create a Heroku app
2. Deploy the `api/` folder
3. Update the API URL in frontend

**Railway/Render**
1. Connect your repo
2. Deploy the API folder
3. Update the frontend API URL

## 🔧 Configuration

### Update API URL (Important!)

In `assets/js/script.js`, change:
```javascript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

### Real Stream URLs

The current implementation includes sample URLs. For production:

1. **Get actual streaming permissions** from TV channels
2. **Replace URLs** in the channels array with real HLS streams
3. **Consider using a CDN** for better performance

### Popular Sri Lankan Stream Sources

```javascript
// Example real streaming URLs (verify licensing first)
const realStreams = {
    "sirasa": "https://live.sirasa.tv/live/sirasa/index.m3u8",
    "hiru": "https://live.hirunews.lk/live/hiru/index.m3u8",
    "derana": "https://live.adaderana.lk/live/derana/index.m3u8"
    // Add more as you get proper licensing
};
```

## 🌐 Domain Setup

1. **Purchase a domain** (e.g., freetvsrilanka.com)
2. **Point DNS** to your hosting provider
3. **Enable HTTPS** (usually automatic with modern hosts)
4. **Update branding** if needed

## 📊 Analytics (Optional)

Add Google Analytics to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🔒 Security Considerations

1. **HTTPS Only** - Never serve over HTTP
2. **CORS Configuration** - Restrict API access to your domain
3. **Rate Limiting** - Implement on API to prevent abuse
4. **Content Security Policy** - Add CSP headers

## 📱 PWA Features

The site includes PWA support. To enable:

1. **Add app icons** to `assets/images/`:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)

2. **Service Worker** (Optional):
```javascript
// In script.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 🧪 Testing Checklist

- [ ] All channels load properly
- [ ] Video player works on mobile
- [ ] API endpoints respond correctly
- [ ] Error handling works
- [ ] Responsive design on all devices
- [ ] Page load speed < 3 seconds

## 📞 Support

For technical support:
- **Email**: info@cloudnextra.com
- **Phone**: +94 11 234 5678

---

**Built by Cloudnextra Solutions**  
*Professional web development and streaming solutions*