# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack Go Links application that includes a Chrome Extension (Manifest V3) for URL redirection, a web dashboard for link management, and Supabase backend for user authentication and cloud sync. Users can create custom "go links" - short URLs like `go/calendar` that redirect to full URLs, with data synced across devices.

## Project Structure

```
go-links/
├── extension/                 # Chrome extension source files
│   ├── manifest.json         # Extension manifest
│   ├── background.js         # Service worker with Supabase sync
│   ├── popup.html           # Extension popup UI
│   ├── popup.js             # Authentication-aware popup
│   ├── content.js           # Content script
│   └── constants.js         # Default go links configuration
├── web-app-react/            # React web application for link management
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── common/       # Shared UI components
│   │   │   ├── dashboard/    # Dashboard-specific components
│   │   │   ├── landing/      # Landing page components
│   │   │   └── settings/     # Settings page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── services/         # API and service logic
│   │   ├── stores/           # Zustand state stores
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   ├── dist/                 # Built application
│   ├── package.json          # Dependencies and scripts
│   ├── vite.config.ts        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── tsconfig.json         # TypeScript configuration
├── supabase/                 # Database schema and configuration
│   └── schema.sql           # Database tables, RLS policies, triggers
├── SETUP.md                 # Comprehensive setup guide
├── .env.example             # Environment variables template
└── README.md                # Project documentation
```

## Architecture

The application uses a three-tier architecture:

### Chrome Extension
- **background.js**: Service worker that handles URL interception, redirection, and Supabase sync
- **popup.js/popup.html**: Authentication-aware popup UI with sync status
- **constants.js**: Default go links configuration (fallback)

### Web Application
- **Frontend**: React/TypeScript application with Vite build system
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Zustand for global state and TanStack Query for server state
- **Authentication**: Google OAuth via Supabase Auth
- **Real-time sync**: Automatic updates across devices via React Query
- **Pages**: Landing, Login, Dashboard, Settings with React Router

### Supabase Backend
- **Database**: PostgreSQL with user profiles, go links, and settings tables
- **Authentication**: Google OAuth integration
- **Row Level Security**: User data isolation
- **Real-time**: Automatic sync between extension and web app

### Data Flow
1. **Authentication**: User signs in via Google OAuth through web app
2. **Link Creation**: Links created in web app or extension popup
3. **Sync**: Changes instantly sync to Supabase and all user devices
4. **Redirection**: User types `go/shortcut` → extension redirects via declarativeNetRequest
5. **Fallback**: Offline support using cached data

### Landing Page
- Integrated into the React application
- Animated demos and responsive design
- Built with React components and Tailwind CSS

## Development Commands

The web application is a modern React/TypeScript project with build tools:

### Initial Setup
- **Full setup**: Follow the comprehensive guide in `SETUP.md` for Supabase, OAuth, and deployment
- **Install dependencies**: `cd web-app-react && npm install`

### Web App Development
- **Development server**: `npm run dev` (starts Vite dev server at http://localhost:5173)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Type checking**: `npm run type-check`
- **Linting**: `npm run lint`
- **Code formatting**: `npm run format` or `npm run format:check`
- **GitHub Pages deployment**: `npm run build:gh-pages`

### Extension Development
- **Load extension**: Go to `chrome://extensions/`, enable Developer Mode, click "Load unpacked" and select the `extension` directory
- **Reload extension**: Click the refresh icon on the extension card in `chrome://extensions/` after making changes
- **View logs**: Click "Service Worker" link on the extension card to open DevTools console

### Testing
- **Extension**: Test redirection by typing `go/shortcut` in browser
- **Web app**: Test authentication flow and link management at http://localhost:5173
- **Production build**: Test built application with `npm run preview`

## Key Implementation Details

### Storage Structure
Go links are stored in Supabase PostgreSQL database with the following schema:

**go_links table:**
```sql
{
  id: UUID,
  user_id: UUID,
  shortcut: TEXT,
  url: TEXT,
  description: TEXT,
  created_at: TIMESTAMPTZ,
  updated_at: TIMESTAMPTZ
}
```

**Extension cache:** Links are cached locally in Chrome storage for offline access.

### Authentication Flow
1. User clicks "Sign In" in extension popup
2. Opens web app login page with Google OAuth
3. Supabase handles authentication and session management
4. Extension receives auth status and syncs user data

### URL Pattern Matching
The extension uses `declarativeNetRequest` to match URLs with pattern `*://go/{shortcut}` and redirect to stored URLs. Rules are dynamically updated whenever links are synced from Supabase.

### Data Synchronization
- Real-time sync between web app and extension via Supabase
- Extension polls for updates and caches data locally
- Offline support using cached links when network unavailable
- Conflict resolution with server data taking precedence

### Adding New Features
- **Extension UI**: Modify `extension/popup.html` and `extension/popup.js`
- **Web dashboard**: Update React components in `web-app-react/src/components/`
- **Database schema**: Update `supabase/schema.sql` and run migrations
- **Authentication**: Modify `web-app-react/src/services/auth.ts` and Supabase settings
- **New pages**: Add components to `web-app-react/src/pages/` and update router
- **State management**: Update Zustand stores in `web-app-react/src/stores/`
- **API integration**: Modify service files in `web-app-react/src/services/`

The web application uses modern React patterns with TypeScript for type safety. The extension remains vanilla JavaScript for simplicity. Follow existing code patterns and component structure when adding features.