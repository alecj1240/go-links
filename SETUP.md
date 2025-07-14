# Go Links Setup Guide

This guide will help you set up your Go Links Chrome extension with user accounts and cloud sync using Supabase.

## Architecture Overview

The project now includes:
- **Chrome Extension**: Handles URL redirection and provides popup interface
- **Web App**: Dashboard and settings pages for managing links
- **Supabase Backend**: Database, authentication, and real-time sync

## Prerequisites

1. Chrome browser
2. Supabase account
3. Google Cloud Console project (for OAuth)
4. Web server to host the web app

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Enable Google OAuth in Authentication > Providers
4. Add your web app URL to Authentication > URL Configuration > Redirect URLs
5. Note your project URL and anon key from Settings > API

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-supabase-project.supabase.co/auth/v1/callback`
6. Note your Client ID and Client Secret

### 3. Environment Configuration

**For Web App:**
1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

**For Extension:**
1. Copy `extension/config.example.js` to `extension/config.js`
2. Fill in your Supabase credentials:
   ```javascript
   const CONFIG = {
     SUPABASE_URL: 'https://your-project.supabase.co',
     SUPABASE_ANON_KEY: 'your-anon-key'
   };
   ```
3. **IMPORTANT**: Never commit `extension/config.js` to version control

### 4. Web App Deployment

The web app is vanilla HTML/CSS/JS and can be deployed to any static hosting service:

**Option A: Local Development**
1. Serve the `web-app` directory with a local server:
   ```bash
   cd web-app
   python -m http.server 3000
   ```
2. Update the `WEBAPP_URL` in `extension/popup.js` to `http://localhost:3000`

**Option B: Static Hosting (Recommended)**
1. Deploy the `web-app` directory to Netlify, Vercel, or similar
2. Update the `WEBAPP_URL` in `extension/popup.js` to your deployed URL
3. Update the API endpoint in `web-app/js/supabase-client.js` if needed

### 5. Chrome Extension Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension` directory
4. The extension should now appear in your extensions list

### 6. Configuration Updates

Update the following files with your specific URLs:

**`extension/popup.js`**
```javascript
const WEBAPP_URL = 'https://your-web-app-url.com';
```

**`web-app/js/supabase-client.js`**
```javascript
// Update the config endpoint URL if not using /api/config
```

## Usage

1. **First Time Setup**:
   - Click the extension icon
   - Click "Sign In" to authenticate with Google
   - This will open your web app where you can sign in

2. **Managing Links**:
   - Use the web app dashboard to add, edit, and delete links
   - Links sync automatically across all devices
   - The extension popup shows your current links

3. **Using Links**:
   - Type `go/shortcut` in your address bar
   - The extension will redirect you to the full URL

## Features

- **User Accounts**: Google OAuth authentication
- **Cloud Sync**: Links sync across all devices via Supabase
- **Real-time Updates**: Changes reflect immediately
- **Dashboard**: Web interface for managing links
- **Settings**: User preferences and data management
- **Offline Support**: Cached links work when offline
- **Import/Export**: Backup and restore your links

## File Structure

```
go-links/
├── extension/                 # Chrome extension
│   ├── manifest.json         # Extension manifest
│   ├── background.js         # Service worker with Supabase sync
│   ├── popup.html           # Updated popup UI
│   ├── popup.js             # Authentication-aware popup
│   └── constants.js         # Default links (fallback)
├── web-app/                  # Web application
│   ├── login.html           # Authentication page
│   ├── dashboard.html       # Links management
│   ├── settings.html        # User settings
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript modules
│   │   ├── auth.js          # Authentication logic
│   │   ├── api.js           # Supabase API wrapper
│   │   ├── dashboard.js     # Dashboard functionality
│   │   └── settings.js      # Settings functionality
│   └── api/                 # API endpoints
├── supabase/                # Database schema
└── landing-page/            # Original marketing page
```

## Troubleshooting

### Extension Not Syncing
1. Check if you're signed in by clicking the extension icon
2. Manually sync by clicking the "Sync" button in the popup
3. Check browser console for errors

### Authentication Issues
1. Verify Google OAuth is properly configured in Supabase
2. Check redirect URLs match exactly
3. Ensure CORS is properly configured

### Links Not Working
1. Check the extension is enabled in `chrome://extensions/`
2. Verify the declarative net request rules are updated
3. Check browser console for errors

## Security Considerations

- **Configuration Security**: API keys are stored in git-ignored config files
  - `extension/config.js` contains Supabase credentials (never commit this)
  - Use `extension/config.example.js` as a template
  - `.env` file contains web app credentials (also git-ignored)
- **Authentication**: tokens are stored securely in Chrome's local storage
- **API Security**: All requests use proper authentication headers
- **Database**: Row Level Security is enabled in Supabase
- **Transport**: HTTPS is required for production deployments
- **Development**: Never commit actual API keys or credentials to version control

## Development

The codebase is designed to be simple and maintainable:
- No build process required
- Vanilla JavaScript throughout
- Clean separation between extension and web app
- Modular architecture for easy extension

## Support

For issues and feature requests, please refer to the project repository or documentation.