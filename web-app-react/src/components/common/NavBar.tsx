import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

export const NavBar = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      // Small delay to ensure auth state is updated before navigation
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 100);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="border-b border-gray-100 backdrop-blur-sm bg-white/95 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link
              to={ROUTES.HOME}
              className="text-xl font-bold flex items-center gap-3 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-700 to-emerald-700 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:shadow-md transition-all duration-200">
                GL
              </div>
              <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Go Links
              </span>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:flex space-x-2">
                <Link
                  to={ROUTES.DASHBOARD}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(ROUTES.DASHBOARD)
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to={ROUTES.SETTINGS}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(ROUTES.SETTINGS)
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Settings
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-700">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {user?.email}
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="button button-ghost text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="button button-accent text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};