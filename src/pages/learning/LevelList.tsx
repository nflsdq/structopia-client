import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockIcon, UnlockIcon, BookOpenCheck, Clock, AlertTriangle } from 'lucide-react';
import apiService from '../../utils/api';

interface Level {
  id: number;
  name: string;
  order: number;
  description: string;
  status: 'unlocked' | 'ongoing' | 'locked';
  keterangan: string;
}

const LevelList = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiService.getLevels();
        setLevels(response.data.data || []);
      } catch (error) {
        console.error('Error fetching levels:', error);
        setError('Gagal memuat data level. Silakan coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevels();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card-neumorph p-8 rounded-xl text-center">
          <div className="animate-spin mb-4 mx-auto w-8 h-8">
            <Clock size={32} className="text-primary-500" />
          </div>
          <p className="text-neutral-600">Memuat daftar level...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card-neumorph p-8 rounded-xl text-center max-w-md">
          <AlertTriangle size={32} className="text-warning-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-neutral-800">Terjadi Kesalahan</h3>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (levels.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card-neumorph p-8 rounded-xl text-center max-w-md">
          <BookOpenCheck size={32} className="text-neutral-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-neutral-800">Belum Ada Level</h3>
          <p className="text-neutral-600">
            Belum ada level pembelajaran yang tersedia saat ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 font-heading text-neutral-800">
          Materi Pembelajaran
        </h1>
        <p className="text-neutral-600">
          Pilih level pembelajaran yang ingin Anda pelajari. Selesaikan semua level untuk menguasai struktur data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level) => (
          <LevelCard key={level.id} level={level} />
        ))}
      </div>
    </div>
  );
};

interface LevelCardProps {
  level: Level;
}

const LevelCard = ({ level }: LevelCardProps) => {
  const isLocked = level.status === 'locked';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`level-card ${isLocked ? 'level-card-locked' : ''}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            Level {level.order}
          </span>
          <div>
            {isLocked ? (
              <LockIcon size={20} className="text-neutral-500" />
            ) : level.status === 'ongoing' ? (
              <Clock size={20} className="text-warning-500" />
            ) : (
              <BookOpenCheck size={20} className="text-success-500" />
            )}
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2 text-neutral-800">{level.name}</h3>
        <p className="text-neutral-600 mb-6">{level.description}</p>

        <div className="pt-4 border-t border-neutral-200 flex justify-between items-center">
          <div className="flex items-center">
            {isLocked ? (
              <div className="flex items-center text-neutral-500">
                <LockIcon size={16} className="mr-1" /> {level.keterangan}
              </div>
            ) : (
              <div className="flex items-center text-success-500">
                <UnlockIcon size={16} className="mr-1" /> Tersedia
              </div>
            )}
          </div>
          
          {isLocked ? (
            <button 
              className="btn-neumorph px-4 py-1.5 text-sm opacity-75 cursor-not-allowed"
              disabled
            >
              Terkunci
            </button>
          ) : (
            <Link 
              to={`/levels/${level.id}`} 
              className="btn-primary px-4 py-1.5 text-sm"
            >
              {level.status === 'ongoing' ? 'Lanjutkan' : 'Mulai'}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LevelList;