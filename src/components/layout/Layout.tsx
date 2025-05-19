import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from './NavBar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      
      <motion.main 
        className="flex-1 container mx-auto px-12 sm:px-16 pt-24 pb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default Layout;