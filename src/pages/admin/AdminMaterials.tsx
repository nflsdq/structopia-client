import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Video, Music, Play } from 'lucide-react';

const AdminMaterials = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data for demonstration
  const materials = [
    { 
      id: 1, 
      title: 'Pengenalan Array', 
      level: 'Level 1: Pengenalan Struktur Data',
      type: 'visual',
      status: 'published'
    },
    { 
      id: 2, 
      title: 'Operasi pada Array', 
      level: 'Level 1: Pengenalan Struktur Data',
      type: 'auditory',
      status: 'draft'
    },
    { 
      id: 3, 
      title: 'Latihan Array', 
      level: 'Level 1: Pengenalan Struktur Data',
      type: 'kinesthetic',
      status: 'published'
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'visual':
        return <Video size={16} className="text-primary-500" />;
      case 'auditory':
        return <Music size={16} className="text-secondary-500" />;
      case 'kinesthetic':
        return <Play size={16} className="text-accent-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-heading text-neutral-800">
          Kelola Materi
        </h1>
        <button className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Tambah Materi
        </button>
      </div>

      <div className="card-neumorph p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari materi..."
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
                <th className="text-left py-3 px-4">Judul</th>
                <th className="text-left py-3 px-4">Level</th>
                <th className="text-left py-3 px-4">Tipe</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <motion.tr 
                  key={material.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="py-3 px-4">{material.title}</td>
                  <td className="py-3 px-4">{material.level}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {getTypeIcon(material.type)}
                      <span className="ml-2 capitalize">{material.type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      material.status === 'published' 
                        ? 'bg-success-100 text-success-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {material.status === 'published' ? 'Dipublikasi' : 'Draft'}
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

export default AdminMaterials;