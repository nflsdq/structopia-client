import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Search, User } from 'lucide-react';
import apiService from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

interface LeaderboardEntry {
  id: number;
  name: string;
  xp: number;
  rank: number;
}

const Leaderboard = () => {
  const { user } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getLeaderboard();
        setLeaderboard(response.data.data || []);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const filteredLeaderboard = leaderboard.filter(
    entry => entry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const findUserRank = () => {
    if (!user) return null;
    return leaderboard.find(entry => entry.id === user.id);
  };

  const userRank = findUserRank();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 font-heading text-neutral-800">
        Papan Peringkat
      </h1>
      <p className="text-neutral-600 mb-8">
        Lihat siapa yang memiliki XP tertinggi dalam mempelajari struktur data di Structopia.
      </p>

      {userRank && (
        <motion.div 
          className="card-neumorph p-6 mb-8 rounded-xl bg-gradient-to-r from-primary-50 to-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-neutral-800">Peringkat Anda</h2>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
              <User size={24} className="text-primary-500" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-neutral-800">{userRank.name}</p>
                  <p className="text-sm text-neutral-600">{userRank.xp} XP</p>
                </div>
                <div className="bg-primary-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
                  #{userRank.rank}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="card-neumorph p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">
            Top Pembelajar
          </h2>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Cari pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-neumorph py-2 pl-9 pr-4 text-sm"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin mb-4 mx-auto w-7 h-7">
              <Trophy size={32} className="text-primary-500" />
            </div>
            <p className="text-neutral-600">Memuat data peringkat...</p>
          </div>
        ) : filteredLeaderboard.length > 0 ? (
          <div className="space-y-4">
            {filteredLeaderboard.slice(0, 3).map((entry, index) => (
              <motion.div 
                key={entry.id}
                className={`p-4 rounded-xl ${
                  index === 0 
                    ? 'bg-yellow-50 border border-yellow-200' 
                    : index === 1 
                      ? 'bg-neutral-100 border border-neutral-200' 
                      : index === 2 
                        ? 'bg-amber-50 border border-amber-200' 
                        : 'bg-white'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    {index === 0 ? (
                      <Trophy size={24} className="text-yellow-500" />
                    ) : index === 1 ? (
                      <Medal size={24} className="text-neutral-500" />
                    ) : index === 2 ? (
                      <Medal size={24} className="text-amber-700" />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                        {entry.rank}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{entry.name}</p>
                        <div className="flex items-center text-sm text-neutral-600">
                          <Star size={14} className="text-secondary-500 mr-1" />
                          {entry.xp} XP
                        </div>
                      </div>
                      <div className={`font-bold ${
                        index === 0 
                          ? 'text-yellow-600' 
                          : index === 1 
                            ? 'text-neutral-600' 
                            : index === 2 
                              ? 'text-amber-700' 
                              : 'text-neutral-800'
                      }`}>
                        #{entry.rank}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-neutral-500">Peringkat</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-neutral-500">Nama</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-neutral-500">XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredLeaderboard.slice(3).map((entry) => (
                    <tr 
                      key={entry.id}
                      className={entry.id === user?.id ? "bg-primary-50" : ""}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-neutral-800">#{entry.rank}</td>
                      <td className="px-4 py-3 text-sm text-neutral-800">{entry.name}</td>
                      <td className="px-4 py-3 text-sm text-neutral-800 text-right">{entry.xp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-600">Tidak ada pengguna yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;