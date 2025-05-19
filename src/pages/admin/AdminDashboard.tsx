import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-heading text-neutral-800">
          Dashboard Admin
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/users">
          <motion.div 
            className="card-neumorph-hover p-6 rounded-xl"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-primary-100 rounded-lg text-primary-500">
                <Users size={24} />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1">Kelola Pengguna</h3>
            <p className="text-neutral-600 text-sm">
              Atur dan kelola pengguna aplikasi
            </p>
          </motion.div>
        </Link>

        <Link to="/admin/levels">
          <motion.div 
            className="card-neumorph-hover p-6 rounded-xl"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-secondary-100 rounded-lg text-secondary-500">
                <BookOpen size={24} />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1">Kelola Level</h3>
            <p className="text-neutral-600 text-sm">
              Atur level pembelajaran
            </p>
          </motion.div>
        </Link>

        <Link to="/admin/materials">
          <motion.div 
            className="card-neumorph-hover p-6 rounded-xl"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-accent-100 rounded-lg text-accent-500">
                <FileText size={24} />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1">Kelola Materi</h3>
            <p className="text-neutral-600 text-sm">
              Atur konten pembelajaran
            </p>
          </motion.div>
        </Link>

        <Link to="/admin/statistics">
          <motion.div 
            className="card-neumorph-hover p-6 rounded-xl"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-success-100 rounded-lg text-success-500">
                <BarChart size={24} />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1">Statistik</h3>
            <p className="text-neutral-600 text-sm">
              Lihat statistik aplikasi
            </p>
          </motion.div>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="card-neumorph p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Statistik Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-neutral-600">Total Pengguna</p>
            <p className="text-2xl font-bold text-primary-500">1,234</p>
          </div>
          <div className="p-4 bg-secondary-50 rounded-lg">
            <p className="text-sm text-neutral-600">Level Aktif</p>
            <p className="text-2xl font-bold text-secondary-500">12</p>
          </div>
          <div className="p-4 bg-accent-50 rounded-lg">
            <p className="text-sm text-neutral-600">Total Materi</p>
            <p className="text-2xl font-bold text-accent-500">48</p>
          </div>
          <div className="p-4 bg-success-50 rounded-lg">
            <p className="text-sm text-neutral-600">Quiz Selesai</p>
            <p className="text-2xl font-bold text-success-500">856</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;