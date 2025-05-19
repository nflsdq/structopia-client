import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface ProgressCardProps {
  progress: {
    id: number;
    level_id: number;
    level: {
      name: string;
    };
    status: string;
  };
}

const ProgressCard = ({ progress }: ProgressCardProps) => {
  const isCompleted = progress.status === 'completed';
  
  return (
    <motion.div 
      className="card-neumorph-hover overflow-hidden rounded-xl"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`h-2 ${isCompleted ? 'bg-success-500' : 'bg-warning-500'}`}></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-lg text-neutral-800">
            {progress.level.name}
          </h3>
          {isCompleted ? (
            <CheckCircle size={20} className="text-success-500" />
          ) : (
            <Clock size={20} className="text-warning-500" />
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-neutral-600">Status</span>
            <span className={`font-medium ${isCompleted ? 'text-success-500' : 'text-warning-500'}`}>
              {isCompleted ? 'Selesai' : 'Dalam Proses'}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Circle 
                key={i} 
                size={12} 
                fill={i <= 3 ? (isCompleted ? '#10B981' : '#F59E0B') : 'none'} 
                className={i <= 3 ? (isCompleted ? 'text-success-500' : 'text-warning-500') : 'text-neutral-300'} 
              />
            ))}
          </div>
          <Link 
            to={`/levels/${progress.level_id}`}
            className="text-primary-500 hover:underline text-sm font-medium"
          >
            {isCompleted ? 'Lihat Kembali' : 'Lanjutkan'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressCard;