import { motion } from 'framer-motion';
import { Cuboid as Cube3d } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            y: [0, -10, 0]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="mb-6"
        >
          <Cube3d size={64} className="text-primary-500" />
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold text-primary-500 mb-2 font-heading"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Structopia
        </motion.h1>
        
        <motion.div 
          className="bg-background shadow-neumorph-sm rounded-full h-3 w-48 overflow-hidden mt-4"
        >
          <motion.div 
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        <motion.p
          className="mt-4 text-neutral-600"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          Memuat...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;