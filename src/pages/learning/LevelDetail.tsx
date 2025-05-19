import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, Video, Music, Play, CheckCircle } from 'lucide-react';
import apiService from '../../utils/api';

interface Materi {
  id: number;
  level_id: number;
  title: string;
  type: 'visual' | 'auditory' | 'kinesthetic';
  content: string;
  media_url: string;
  xp_value?: number;
  is_completed?: boolean;
}

interface Level {
  id: number;
  name: string;
  order: number;
  description: string;
  status: string;
  keterangan: string;
}

const LevelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level | null>(null);
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizAccessible, setIsQuizAccessible] = useState(false);
  const [checkingQuizAccess, setCheckingQuizAccess] = useState(true);

  useEffect(() => {
    const fetchLevelDetail = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setCheckingQuizAccess(true); // Mulai pengecekan
      try {
        // Fetch level details
        const levelRes = await apiService.getLevelById(parseInt(id));
        const levelData = levelRes.data.data || levelRes.data;
        setLevel(levelData);
        
        // Fetch level materi
        const materiRes = await apiService.getLevelMateri(parseInt(id), filter || undefined);
        setMateriList(materiRes.data.data || []);

        // Check quiz accessibility
        if (levelData) {
          try {
            await apiService.getLevelQuiz(parseInt(id));
            setIsQuizAccessible(true);
          } catch (quizError: any) {
            if (quizError.response && quizError.response.status === 403) {
              setIsQuizAccessible(false);
            } else {
              setIsQuizAccessible(false); // Default ke false jika ada error lain
              console.error('Error checking quiz accessibility for level:', quizError);
            }
          }
        }

      } catch (error) {
        console.error('Error fetching level details:', error);
        setIsQuizAccessible(false); // Jika gagal fetch level, kuis tidak bisa diakses
      } finally {
        setIsLoading(false);
        setCheckingQuizAccess(false); // Selesai pengecekan
      }
    };

    fetchLevelDetail();
  }, [id, filter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'visual':
        return <Video size={16} />;
      case 'auditory':
        return <Music size={16} />;
      case 'kinesthetic':
        return <Play size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'visual':
        return 'Visual';
      case 'auditory':
        return 'Audio';
      case 'kinesthetic':
        return 'Kinestetik';
      default:
        return 'Teks';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'visual':
        return 'bg-primary-100 text-primary-700';
      case 'auditory':
        return 'bg-secondary-100 text-secondary-700';
      case 'kinesthetic':
        return 'bg-accent-100 text-accent-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div>
      <button 
        onClick={() => navigate('/levels')}
        className="flex items-center text-neutral-600 hover:text-primary-500 mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> Kembali ke Daftar Level
      </button>

      {isLoading ? (
        <div className="card-neumorph p-8 rounded-xl text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-neutral-200 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ) : level ? (
        <>
          <div className="card-neumorph p-6 rounded-xl mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mr-2">
                    Level {level.order}
                  </span>
                  {level.status === 'completed' && (
                    <span className="inline-flex items-center px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
                      <CheckCircle size={14} className="mr-1" /> Selesai
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2 font-heading text-neutral-800">
                  {level.name}
                </h1>
                <p className="text-neutral-600">
                  {level.description}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Link 
                  to={`/quiz/${level.id}`} 
                  className={`btn-primary ${(!isQuizAccessible || checkingQuizAccess) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={(e) => {
                    if (!isQuizAccessible || checkingQuizAccess) {
                      e.preventDefault();
                      // Anda bisa menambahkan toast di sini jika mau
                      // toast.info("Selesaikan semua materi dari satu tipe terlebih dahulu untuk membuka kuis.");
                    }
                  }}
                  aria-disabled={!isQuizAccessible || checkingQuizAccess}
                >
                  {checkingQuizAccess ? 'Memeriksa Kuis...' : 'Mulai Kuis'}
                </Link>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center">
              <BookOpen size={20} className="text-primary-500 mr-2" />
              <h2 className="text-xl font-semibold font-heading text-neutral-800">
                Materi Pembelajaran
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilter('')}
                className={`btn-neumorph px-4 py-1.5 text-sm ${
                  filter === '' ? 'shadow-neumorph-pressed' : ''
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilter('visual')}
                className={`btn-neumorph px-4 py-1.5 text-sm ${
                  filter === 'visual' ? 'shadow-neumorph-pressed' : ''
                }`}
              >
                Visual
              </button>
              <button
                onClick={() => setFilter('auditory')}
                className={`btn-neumorph px-4 py-1.5 text-sm ${
                  filter === 'auditory' ? 'shadow-neumorph-pressed' : ''
                }`}
              >
                Audio
              </button>
              <button
                onClick={() => setFilter('kinesthetic')}
                className={`btn-neumorph px-4 py-1.5 text-sm ${
                  filter === 'kinesthetic' ? 'shadow-neumorph-pressed' : ''
                }`}
              >
                Kinestetik
              </button>
            </div>
          </div>

          {/* Materials List */}
          {materiList.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {materiList.map((materi) => (
                <Link 
                  key={materi.id} 
                  to={`/materi/${materi.id}`}
                  className="card-neumorph-hover p-5 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(materi.type)}`}>
                      {getTypeIcon(materi.type)}
                      <span className="ml-1">{getTypeLabel(materi.type)}</span>
                    </span>
                    {materi.is_completed && (
                      <CheckCircle size={18} className="text-success-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{materi.title}</h3>
                  <p className="text-neutral-600 text-sm line-clamp-2">{materi.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...</p>
                </Link>
              ))}
            </motion.div>
          ) : (
            <div className="card-neumorph p-6 rounded-xl text-center">
              <p className="text-neutral-600">
                {filter ? `Tidak ada materi dengan tipe ${filter} untuk level ini.` : 'Tidak ada materi untuk level ini.'}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="card-neumorph p-8 rounded-xl text-center">
          <h3 className="text-xl font-semibold mb-2 text-neutral-800">Level Tidak Ditemukan</h3>
          <p className="text-neutral-600 mb-6">Level yang Anda cari tidak tersedia atau mungkin telah dihapus.</p>
          <Link to="/levels" className="btn-primary">
            Kembali ke Daftar Level
          </Link>
        </div>
      )}
    </div>
  );
};

export default LevelDetail;