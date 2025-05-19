import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingScreen from '../common/LoadingScreen';

const AdminRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if user is not an admin
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the admin route component
  return <Outlet />;
};

export default AdminRoute;