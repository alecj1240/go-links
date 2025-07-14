# Go Links React TypeScript Web App

This is the modern React TypeScript version of the Go Links web application, refactored from the original vanilla JavaScript implementation.

## Overview

A complete React TypeScript refactor of the Go Links web application featuring:

- **React 18** with TypeScript for type safety
- **Vite** for fast development and build
- **React Router** for client-side routing
- **React Query** for data fetching and caching
- **Zustand** for lightweight state management
- **Supabase** for backend services
- **Static site generation** for GitHub Pages deployment

## Features

### ✅ Completed Features

- **Authentication**: Google OAuth integration with Supabase
- **Dashboard**: Full CRUD operations for go links with search and real-time updates
- **Settings**: Profile management, preferences, data import/export, and danger zone
- **Landing Page**: Marketing site with animated demos
- **Responsive Design**: Works on desktop and mobile
- **Extension Integration**: Communication with browser extension
- **Type Safety**: Full TypeScript coverage
- **Modern Build**: Optimized Vite build for production

### 🔧 Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand + React Query
- **Styling**: CSS with CSS variables for theming
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL with RLS
- **Real-time**: Supabase real-time subscriptions
- **Extension Sync**: LocalStorage + Custom events

## Project Structure

```
web-app-react/
├── src/
│   ├── components/          # React components
│   │   ├── common/         # Reusable components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── settings/       # Settings components
│   │   └── landing/        # Landing page components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and external services
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles
├── public/                 # Static assets
└── dist/                   # Build output
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Check TypeScript types
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Deployment

### GitHub Pages

The app is configured for GitHub Pages deployment:

```bash
npm run build:gh-pages
```

This builds the app with the correct base path and creates a `.nojekyll` file.

### Environment Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Migration from Vanilla JS

This React app maintains full feature parity with the original vanilla JavaScript implementation:

### What's New
- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Better Performance**: React Query caching and optimistic updates
- **Modern Tooling**: Vite for fast development and build
- **Component Architecture**: Reusable, tested components
- **Better State Management**: Zustand for predictable state updates

### What's Preserved
- **Same UI/UX**: Identical design and user experience
- **Same Database**: Uses the same Supabase schema
- **Same Extension**: Compatible with existing browser extension
- **Same Features**: All functionality from the original app

## Browser Extension Integration

The React app maintains compatibility with the existing Chrome extension:

- **Authentication Sync**: Shares auth tokens via localStorage
- **Data Sync**: Syncs go links to extension storage
- **Status Detection**: Detects if extension is installed
- **Real-time Updates**: Extension receives updates when links change

## Performance

- **Bundle Size**: ~140KB gzipped (including React, React Query, etc.)
- **Build Time**: <1 second for incremental builds
- **Runtime**: Fast React 18 rendering with concurrent features
- **Caching**: React Query provides intelligent caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Add tests if applicable
5. Run `npm run type-check` and `npm run lint`
6. Submit a pull request

## License

MIT License - see LICENSE file for details
