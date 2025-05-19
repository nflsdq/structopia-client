import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cuboid as Cube3d, Home } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const NotFound = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ 
              rotate: 360,
              y: [0, -10, 0]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Cube3d size={80} className="text-primary-300" />
          </motion.div>
        </div>
        
        <h1 className="text-7xl font-bold mb-4 font-heading text-neutral-800">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-neutral-700">Halaman Tidak Ditemukan</h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dihapus.
        </p>
        
        <Link 
          to={isAuthenticated ? "/dashboard" : "/"} 
          className="btn-primary inline-flex items-center"
        >
          <Home size={18} className="mr-2" />
          {isAuthenticated ? 'Kembali ke Dashboard' : 'Kembali ke Beranda'}
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;