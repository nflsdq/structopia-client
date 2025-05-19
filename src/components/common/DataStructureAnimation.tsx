import { motion } from 'framer-motion';
import { Layers, GitBranch, Network } from 'lucide-react';

interface DataStructureAnimationProps {
  type: 'array' | 'linkedList' | 'tree' | 'graph';
}

const DataStructureAnimation = ({ type }: DataStructureAnimationProps) => {
  const renderAnimation = () => {
    switch (type) {
      case 'array':
        return (
          <motion.div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center"
              >
                <Layers className="text-primary-500" size={24} />
              </motion.div>
            ))}
          </motion.div>
        );

      case 'linkedList':
        return (
          <motion.div className="flex items-center space-x-4">
            {[...Array(3)].map((_, i) => (
              <motion.div key={i} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center"
                >
                  <GitBranch className="text-secondary-500" size={24} />
                </motion.div>
                {i < 2 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 40 }}
                    transition={{ delay: i * 0.2 + 0.1 }}
                    className="h-1 bg-secondary-500 ml-2"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        );

      case 'graph':
        return (
          <motion.div className="relative w-48 h-48">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
            >
              <Network className="text-accent-500" size={32} />
            </motion.div>
            {/* Add more nodes and edges for graph visualization */}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      {renderAnimation()}
    </div>
  );
};

export default DataStructureAnimation;