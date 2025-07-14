import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/common/NavBar';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

export const Login = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div 
        className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4"
        style={{ backgroundColor: 'var(--surface-color)' }}
      >
        <LoginForm />
      </div>
    </div>
  );
};