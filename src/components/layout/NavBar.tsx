import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cuboid as Cube3d, Menu, X} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Beranda' },
    { path: '/levels', label: 'Materi' },
    { path: '/leaderboard',  label: 'Peringkat' },
    { path: '/profile',  label: 'Profil' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-background shadow-neumorph-sm py-3 px-12 fixed w-full top-0 z-30">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 text-primary-500 font-bold text-xl"
          >
            <Cube3d size={24} />
            <span className="font-heading">Structopia</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-primary-500 bg-primary-50 shadow-neumorph-sm'
                    : 'text-neutral-600 hover:text-primary-500 hover:bg-primary-50'
                }`}
              >
             
                <span>{item.label}</span>
              </Link>
            ))}
            
            {user && (
              <button 
                onClick={handleLogout}
                className="btn-neumorph text-neutral-700 hover:text-error-600"
              >
                Keluar
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden btn-neumorph p-2"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            className="fixed right-0 top-0 h-full w-64 bg-background shadow-xl z-50 md:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-2 text-primary-500">
                  <Cube3d size={24} />
                  <span className="font-bold font-heading">Structopia</span>
                </div>
                <button 
                  onClick={toggleMenu} 
                  className="p-2 rounded-full bg-neutral-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={toggleMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-500 shadow-neumorph-sm'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {user && (
                <div className="pt-4 border-t border-neutral-200">
                  <div className="mb-4 px-4 py-2">
                    <p className="text-sm text-neutral-500">Masuk sebagai</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full btn-neumorph text-neutral-700 hover:text-error-600"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;