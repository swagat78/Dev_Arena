import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

const GuestRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingScreen message="Preparing application..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
