import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/common/NavBar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Demo } from '@/components/landing/Demo';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

export const Landing = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen">
      <NavBar />
      <main>
        <Hero />
        <div className="bg-green-50">
          <Features />
        </div>
        <Demo />

        {/* CTA section */}
        <section className="py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900"></div>
          <div className="container relative">
            <div 
              className="text-center p-10 text-white rounded-2xl max-w-3xl mx-auto relative bg-white/10 backdrop-blur-xl border border-white/10"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                Ready to Supercharge <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">Your Browsing?</span>
              </h2>
              <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Navigate the web at lightning speed with instant shortcuts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                <a
                  href="https://chrome.google.com/webstore"
                  className="button bg-white text-gray-900 hover:bg-gray-100 text-base px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 justify-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  Add to Chrome - It's Free
                </a>
              </div>
              <p className="text-sm opacity-75">
                Works with Chrome, Edge, and other Chromium browsers
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-700 to-emerald-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                GL
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Go Links
              </span>
            </div>
            <p className="mb-8 text-gray-600 text-lg">
              Made with ❤️ by developers who got tired of typing long URLs
            </p>
            <div className="flex justify-center space-x-8">
              <a 
                href="https://github.com/yourusername/go-links" 
                className="text-gray-500 hover:text-green-700 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
              <a 
                href="https://github.com/yourusername/go-links/issues"
                className="text-gray-500 hover:text-green-700 transition-colors font-medium"
              >
                Support
              </a>
              <a 
                href="https://github.com/yourusername/go-links/blob/main/LICENSE"
                className="text-gray-500 hover:text-green-700 transition-colors font-medium"
              >
                License
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};