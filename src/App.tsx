import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import LoadingScreen from './components/common/LoadingScreen';
import PublicRoute from './components/routes/PublicRoute';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';
import Layout from './components/layout/Layout';
import { useAuthStore } from './store/authStore';
import { showToast } from './components/common/Toast';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const LevelList = lazy(() => import('./pages/learning/LevelList'));
const LevelDetail = lazy(() => import('./pages/learning/LevelDetail'));
const MaterialDetail = lazy(() => import('./pages/learning/MaterialDetail'));
const Quiz = lazy(() => import('./pages/quiz/Quiz'));
const Leaderboard = lazy(() => import('./pages/leaderboard/Leaderboard'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const NotFound = lazy(() => import('./pages/error/NotFound'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLevels = lazy(() => import('./pages/admin/AdminLevels'));
const AdminMaterials = lazy(() => import('./pages/admin/AdminMaterials'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated on application load
    checkAuth();
  }, [checkAuth]);

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route element={<Layout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/levels" element={<AdminLevels />} />
              <Route path="/admin/materials" element={<AdminMaterials />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
          </Route>

          {/* Authenticated routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/levels" element={<LevelList />} />
              <Route path="/levels/:id" element={<LevelDetail />} />
              <Route path="/materi/:id" element={<MaterialDetail />} />
              <Route path="/quiz/:levelId" element={<Quiz />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Special routes */}
          <Route path="/" element={<Home />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;