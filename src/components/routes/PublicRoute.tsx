import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    // If user was redirected to login from another page, send them back there
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Otherwise, render the public route component
  return <Outlet />;
};

export default PublicRoute;