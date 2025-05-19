import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Award, BookOpen, Clock, BarChart, Gift } from 'lucide-react';
import apiService from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  obtained_at?: string;
}

interface QuizHistory {
  id: number;
  score: number;
  total_questions: number;
  passed: boolean;
  xp_gained: number;
  created_at: string;
  level: {
    name: string;
  };
}

const Profile = () => {
  const { user, logout } = useAuthStore();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('badges');

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Fetch user badges
        const badgesRes = await apiService.getUserBadges();
        setBadges(badgesRes.data.data || []);
        
        // Fetch quiz history
        const historyRes = await apiService.getQuizHistory();
        setQuizHistory(historyRes.data.data || []);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Calculate statistics
  const passedQuiz = quizHistory.filter(quiz => quiz.passed).length;
  const totalQuiz = quizHistory.length;
  const passRate = totalQuiz > 0 ? Math.round((passedQuiz / totalQuiz) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="card-neumorph p-6 rounded-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={40} className="text-primary-500" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 font-heading text-neutral-800">
              {user?.name || 'Pengguna'}
            </h1>
            <p className="text-neutral-600 mb-2">{user?.email}</p>
            <div className="flex items-center justify-center md:justify-start">
              <span className="badge bg-primary-100 text-primary-700 mr-2">
                {user?.role === 'admin' ? 'Admin' : 'Siswa'}
              </span>
              <span className="badge bg-secondary-100 text-secondary-700">
                {user?.xp || 0} XP
              </span>
            </div>
          </div>
          
          <div>
            <button 
              onClick={() => logout()} 
              className="btn-neumorph"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Award size={24} className="text-primary-500" />}
          title="Badge"
          value={badges.length.toString()}
          subtitle="Diperoleh"
        />
        <StatCard 
          icon={<BookOpen size={24} className="text-secondary-500" />}
          title="Kuis"
          value={quizHistory.filter(quiz => quiz.passed).length.toString()}
          subtitle="Diselesaikan"
        />
        <StatCard 
          icon={<BarChart size={24} className="text-success-500" />}
          title="Pass Rate"
          value={`${passRate}%`}
          subtitle="Tingkat Kelulusan"
        />
        <StatCard 
          icon={<Clock size={24} className="text-accent-500" />}
          title="Total XP"
          value={user?.xp?.toString() || '0'}
          subtitle="Diperoleh"
        />
      </div>
      
      {/* Tabs */}
      <div className="card-neumorph rounded-xl overflow-hidden">
        <div className="flex border-b border-neutral-200">
          <button
            className={`flex-1 py-3 font-medium text-center transition-colors ${
              activeTab === 'badges'
                ? 'bg-primary-50 text-primary-700 shadow-inner'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
            onClick={() => setActiveTab('badges')}
          >
            <Award size={18} className="inline mr-2" /> Badge
          </button>
          <button
            className={`flex-1 py-3 font-medium text-center transition-colors ${
              activeTab === 'history'
                ? 'bg-primary-50 text-primary-700 shadow-inner'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
            onClick={() => setActiveTab('history')}
          >
            <Clock size={18} className="inline mr-2" /> Riwayat Kuis
          </button>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin mb-4 mx-auto w-7 h-7">
                <Clock size={28} className="text-primary-500" />
              </div>
              <p className="text-neutral-600">Memuat data...</p>
            </div>
          ) : activeTab === 'badges' ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-neutral-800">Badge yang Diperoleh</h2>
              
              {badges.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {badges.map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award size={40} className="text-neutral-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-1">Belum Ada Badge</h3>
                  <p className="text-neutral-600">
                    Terus belajar dan selesaikan level untuk mendapatkan badge.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-neutral-800">Riwayat Kuis</h2>
              
              {quizHistory.length > 0 ? (
                <div className="space-y-4">
                  {quizHistory.map((quiz) => (
                    <QuizHistoryCard key={quiz.id} quiz={quiz} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen size={40} className="text-neutral-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-1">Belum Ada Riwayat Kuis</h3>
                  <p className="text-neutral-600">
                    Selesaikan beberapa kuis untuk melihat riwayat di sini.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}

const StatCard = ({ icon, title, value, subtitle }: StatCardProps) => {
  return (
    <motion.div 
      className="card-neumorph-hover p-6 rounded-xl"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="font-semibold ml-2 text-neutral-700">{title}</h3>
      </div>
      <div>
        <p className="text-3xl font-bold mb-1 text-neutral-800">{value}</p>
        <p className="text-sm text-neutral-600">{subtitle}</p>
      </div>
    </motion.div>
  );
};

interface BadgeCardProps {
  badge: Badge;
}

const BadgeCard = ({ badge }: BadgeCardProps) => {
  return (
    <motion.div 
      className="card-neumorph-hover p-6 rounded-xl text-center"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-secondary-200">
          {badge.icon ? (
            <img src={badge.icon} alt={badge.name} className="w-full h-full object-cover" />
          ) : (
            <Gift size={40} className="text-secondary-500" />
          )}
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-1 text-neutral-800 text-lg">{badge.name}</h3>
        <p className="text-sm text-neutral-600 mb-2 px-2">{badge.description}</p>
        
        {badge.obtained_at && (
          <p className="text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-200">
            Diperoleh: {new Date(badge.obtained_at).toLocaleDateString('id-ID')}
          </p>
        )}
      </div>
    </motion.div>
  );
};

interface QuizHistoryCardProps {
  quiz: QuizHistory;
}

const QuizHistoryCard = ({ quiz }: QuizHistoryCardProps) => {
  return (
    <div className={`card-neumorph p-4 rounded-xl border-l-4 ${
      quiz.passed ? 'border-success-500' : 'border-error-500'
    }`}>
      <div className="flex flex-col sm:flex-row justify-between">
        <div>
          <h3 className="font-semibold mb-1 text-neutral-800">{quiz.level.name}</h3>
          <div className="flex items-center">
            <span className={`badge ${
              quiz.passed ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'
            } mr-2`}>
              {quiz.passed ? 'Lulus' : 'Gagal'}
            </span>
            <span className="text-sm text-neutral-600">
              {quiz.score} soal benar
            </span>
          </div>
        </div>
        
        <div className="mt-2 sm:mt-0 text-right">
          <div className="badge bg-primary-100 text-primary-700">+{quiz.passed ? quiz.score * 25 : '0'} XP</div>
          <p className="text-xs text-neutral-500 mt-1">
            {new Date(quiz.created_at).toLocaleDateString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;