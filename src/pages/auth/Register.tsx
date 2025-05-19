import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Cuboid as Cube3d } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await register({ name, email, password, role: 'student' });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="card-neumorph p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Cube3d size={40} className="text-primary-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2 font-heading text-neutral-800">Mulai Perjalanan Belajar</h1>
            <p className="text-neutral-600">Buat akun Structopia baru</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg text-error-700 relative">
              <button
                onClick={clearError}
                className="absolute top-2 right-2 text-error-500 hover:text-error-700"
                aria-label="Tutup pesan error"
              >
                &times;
              </button>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-neumorph"
                placeholder="Masukkan nama lengkap Anda"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-neumorph"
                placeholder="Masukkan email Anda"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-neumorph pr-10"
                  placeholder="Buat password (minimal 8 karakter)"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-1 text-sm text-neutral-500">
                Password harus minimal 8 karakter
              </p>
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Sudah memiliki akun?{' '}
              <Link to="/login" className="text-primary-500 hover:underline font-medium">
                Masuk
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center text-neutral-600 hover:text-primary-500">
            <ArrowLeft size={16} className="mr-1" /> Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;