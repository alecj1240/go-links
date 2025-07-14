import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

export const Hero = () => {
  const [demoText, setDemoText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const shortcuts = ['calendar', 'drive', 'github', 'standup', 'docs'];

  useEffect(() => {
    const handleType = () => {
      const currentShortcut = shortcuts[loopNum % shortcuts.length];
      const fullText = `go/${currentShortcut}`;

      setDemoText(
        isDeleting
          ? fullText.substring(0, demoText.length - 1)
          : fullText.substring(0, demoText.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && demoText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && demoText === 'go/') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [demoText, isDeleting, loopNum, typingSpeed, shortcuts]);

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-white"
        style={{ zIndex: -1 }}
      />
      <div className="container relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                <span 
                  className="bg-gradient-to-r from-green-700 via-green-800 to-emerald-700 bg-clip-text text-transparent"
                >
                  Lightning-Fast
                </span>
                <br />
                <span className="text-gray-900">
                  Web Shortcuts
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Transform long URLs into memorable shortcuts. Type{' '}
                <code className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-lg text-base font-mono text-green-800 shadow-sm">
                  go/docs
                </code>{' '}
                instead of remembering complex URLs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="https://chrome.google.com/webstore"
                  className="button button-accent button-lg group relative overflow-hidden"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    Add to Chrome
                  </span>
                </a>
                <Link
                  to={ROUTES.LOGIN}
                  className="button button-secondary button-lg"
                >
                  Sign In
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div 
                className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                style={{ boxShadow: 'var(--shadow-2xl)' }}
              >
                {/* Browser chrome */}
                <div 
                  className="h-12 flex items-center px-6"
                  style={{ backgroundColor: 'var(--gray-50)' }}
                >
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                  </div>
                  <div 
                    className="ml-6 flex-1 h-8 rounded-lg px-4 flex items-center text-sm font-mono border border-gray-200"
                    style={{ backgroundColor: 'var(--background-color)' }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>
                      {demoText}
                    </span>
                    <span className="inline-block w-0.5 h-4 bg-green-700 ml-1 animate-pulse rounded"></span>
                  </div>
                </div>

                {/* Browser content */}
                <div className="h-56 flex items-center justify-center p-8 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                      ⚡
                    </div>
                    <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {demoText.length > 3 ? (
                        <span className="text-green-600 flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Ready to redirect...
                        </span>
                      ) : (
                        'Type a shortcut above'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};