import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpenCheck, Award, Trophy, ChevronRight, Clock, Activity } from 'lucide-react';
import apiService from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import ProgressCard from '../../components/dashboard/ProgressCard';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState<any[]>([]);
  const [recentBadges, setRecentBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRankInfo, setUserRankInfo] = useState<{ rank: number | null; totalStudents: number | null }>({ rank: null, totalStudents: null });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch progress
        const progressRes = await apiService.getProgress();
        setProgress(progressRes.data.data || []);

        // Fetch badges
        const badgesRes = await apiService.getUserBadges();
        // Sort by obtained date (newest first) and take the first 3
        const sortedBadges = (badgesRes.data.data || [])
          .sort((a: any, b: any) => new Date(b.obtained_at).getTime() - new Date(a.obtained_at).getTime())
          .slice(0, 3);
        setRecentBadges(sortedBadges);

        // Fetch leaderboard data for rank
        const leaderboardRes = await apiService.getLeaderboard();
        if (leaderboardRes.data && user) {
          const allUsers = leaderboardRes.data.data || []; // leaderboardRes.data is the paginated object
          const currentUserEntry = allUsers.find((entry: any) => entry.id === user.id);
          setUserRankInfo({
            rank: currentUserEntry ? currentUserEntry.rank : null,
            totalStudents: leaderboardRes.data.total || 0, // total from pagination
          });
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate completion percentage
  const completedLevels = progress.filter(p => p.status === 'completed').length;
  const inProgressLevels = progress.filter(p => p.status === 'in-progress').length;
  const completionPercentage = progress.length > 0 
    ? Math.round((completedLevels / progress.length) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card-neumorph p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 font-heading text-neutral-800">
              Selamat Datang, {user?.name || 'Pengguna'}!
            </h1>
            <p className="text-neutral-600">
              Lanjutkan perjalanan belajar struktur data Anda dari mana Anda terakhir kali berhenti.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="card-neumorph p-3 rounded-xl flex flex-col items-center justify-center">
              <div className="text-sm text-neutral-500 mb-1">XP</div>
              <div className="text-xl font-bold text-primary-500">{user?.xp || 0}</div>
            </div>
            
            <Link to="/levels" className="btn-primary">
              Lanjutkan Belajar
            </Link>
          </div>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          className="card-neumorph-hover p-6 rounded-xl"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-primary-100 rounded-lg text-primary-500 mr-3">
              <BookOpenCheck size={24} />
            </div>
            <h3 className="font-semibold text-neutral-700">Kemajuan Belajar</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-600">Penyelesaian</span>
              <span className="font-medium text-primary-500">{isLoading ? '...' : `${completionPercentage}%`}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2.5">
              <div 
                className="bg-primary-500 h-2.5 rounded-full" 
                style={{ width: isLoading ? '0%' : `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-success-500 mr-1"></div>
                <span>Selesai: {isLoading ? '...' : completedLevels}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-warning-500 mr-1"></div>
                <span>Dalam Proses: {isLoading ? '...' : inProgressLevels}</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card-neumorph-hover p-6 rounded-xl"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-secondary-100 rounded-lg text-secondary-500 mr-3">
              <Award size={24} />
            </div>
            <h3 className="font-semibold text-neutral-700">Badge Terbaru</h3>
          </div>
          <div>
            {isLoading ? (
              <div className="text-center py-4">
                <p className="text-neutral-600">Memuat badge...</p>
              </div>
            ) : recentBadges.length > 0 ? (
              <div className="space-y-3">
                {recentBadges.map((badge) => (
                  <div key={badge.id} className="flex items-center">
                    <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center mr-3">
                      <Award size={20} className="text-secondary-500" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-700">{badge.name}</p>
                      <p className="text-xs text-neutral-500">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-600 text-center py-4">
                Belum ada badge yang diperoleh
              </p>
            )}
            <div className="mt-4 text-right">
              <Link to="/profile" className="text-sm text-primary-500 hover:underline flex items-center justify-end">
                Lihat Semua <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card-neumorph-hover p-6 rounded-xl"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-accent-100 rounded-lg text-accent-500 mr-3">
              <Trophy size={24} />
            </div>
            <h3 className="font-semibold text-neutral-700">Peringkat Anda</h3>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-500 mb-1">
                {isLoading ? '...' : userRankInfo.rank !== null ? `#${userRankInfo.rank}` : '-'}
              </div>
              <p className="text-neutral-600">
                {isLoading ? 'Memuat...' : userRankInfo.totalStudents !== null ? `dari ${userRankInfo.totalStudents} siswa` : 'Data tidak tersedia'}
              </p>
              <div className="mt-4">
                <Link to="/leaderboard" className="btn-neumorph text-sm px-4 py-1.5">
                  Lihat Papan Peringkat
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Progress Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-heading text-neutral-800">
            Progress Belajar
          </h2>
          <Link to="/levels" className="text-primary-500 hover:underline flex items-center text-sm">
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="card-neumorph p-8 rounded-xl text-center">
            <div className="animate-spin mb-4 mx-auto w-7 h-7">
              <Clock size={28} className="text-primary-500" />
            </div>
            <p className="text-neutral-600">Memuat data progress...</p>
          </div>
        ) : progress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {progress.slice(0, 3).map((item) => (
              <ProgressCard key={item.id} progress={item} />
            ))}
          </div>
        ) : (
          <div className="card-neumorph p-8 rounded-xl text-center">
            <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center">
              <Activity size={32} className="text-neutral-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Belum Ada Progress</h3>
            <p className="text-neutral-600 mb-6">
              Anda belum memulai level pembelajaran apapun.
            </p>
            <Link to="/levels" className="btn-primary inline-flex">
              Mulai Belajar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;