import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Edit, Trash2, Shield, User } from 'lucide-react';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data for demonstration
  const users = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com',
      role: 'student',
      status: 'active',
      xp: 1250
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com',
      role: 'admin',
      status: 'active',
      xp: 0
    },
    { 
      id: 3, 
      name: 'Bob Wilson', 
      email: 'bob@example.com',
      role: 'student',
      status: 'inactive',
      xp: 850
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-heading text-neutral-800">
          Kelola Pengguna
        </h1>
        <button className="btn-primary flex items-center">
          <UserPlus size={20} className="mr-2" />
          Tambah Pengguna
        </button>
      </div>

      <div className="card-neumorph p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-neumorph pl-10 pr-4 py-2"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4">Nama</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Peran</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">XP</th>
                <th className="text-right py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {user.role === 'admin' ? (
                        <Shield size={16} className="text-primary-500 mr-2" />
                      ) : (
                        <User size={16} className="text-neutral-500 mr-2" />
                      )}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-success-100 text-success-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {user.role === 'student' ? user.xp : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end space-x-2">
                      <button className="btn-neumorph p-2" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="btn-neumorph p-2 text-error-500" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;