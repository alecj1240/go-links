import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROUTES } from '@/utils/constants';

const Landing = lazy(() => import('@/pages/Landing').then(module => ({ default: module.Landing })));
const Login = lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Settings = lazy(() => import('@/pages/Settings').then(module => ({ default: module.Settings })));

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Landing />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.HOME} replace />,
  },
]);