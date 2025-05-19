import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const AdminLevels = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data for demonstration
  const levels = [
    { id: 1, name: 'Pengenalan Struktur Data', order: 1, status: 'active' },
    { id: 2, name: 'Array dan String', order: 2, status: 'active' },
    { id: 3, name: 'Linked List', order: 3, status: 'draft' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-heading text-neutral-800">
          Kelola Level
        </h1>
        <button className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Tambah Level
        </button>
      </div>

      <div className="card-neumorph p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari level..."
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
                <th className="text-left py-3 px-4">Order</th>
                <th className="text-left py-3 px-4">Nama Level</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((level) => (
                <motion.tr 
                  key={level.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="py-3 px-4">{level.order}</td>
                  <td className="py-3 px-4">{level.name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      level.status === 'active' 
                        ? 'bg-success-100 text-success-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {level.status === 'active' ? 'Aktif' : 'Draft'}
                    </span>
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

export default AdminLevels;