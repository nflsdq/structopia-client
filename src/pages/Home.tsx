import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Cuboid as Cube3d, BookOpen, Award, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Home = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container mx-auto px-6 pt-8 pb-24 relative z-10">
          <nav className="flex justify-between items-center mb-16">
            <Link to="/" className="flex items-center space-x-2 text-primary-500 font-bold text-xl">
              <Cube3d size={28} />
              <span className="font-heading">Structopia</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-neumorph">
                    Masuk
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </nav>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading leading-tight text-neutral-800">
                Belajar <span className="text-primary-500">Struktur Data</span> dengan Cara yang Menyenangkan
              </h1>
              <p className="text-lg text-neutral-600 mb-8">
                Platform pembelajaran interaktif yang dirancang khusus untuk siswa SMK. Kuasai konsep struktur data dengan cara yang menyenangkan dan efektif.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn-primary flex items-center gap-2">
                  Mulai Belajar <ArrowRight size={18} />
                </Link>
                <Link to="/levels" className="btn-neumorph">
                  Lihat Materi
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="card-neumorph p-3 md:p-6 rounded-2xl overflow-hidden">
                <div className="relative">
                  <img 
                    src="https://images.pexels.com/photos/8423046/pexels-photo-8423046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Belajar Struktur Data" 
                    className="w-full h-auto rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-neutral-700">Visualisasi Struktur Data</h3>
                  <p className="text-sm text-neutral-600">Memahami konsep dengan cara interaktif</p>
                </div>
              </div>
              
              <div className="hidden md:block absolute -top-10 -right-10 animate-float">
                <div className="card-neumorph p-3 rounded-full flex items-center justify-center w-20 h-20 bg-accent-500 text-white">
                  <Cube3d size={30} />
                </div>
              </div>
              
              <div className="hidden md:block absolute -bottom-6 -left-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="card-neumorph p-3 rounded-full flex items-center justify-center w-16 h-16 bg-success-500 text-white">
                  <Award size={24} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </header>
      
      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-neutral-800">
              Fitur <span className="text-primary-500">Utama</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Structopia menyediakan berbagai fitur untuk membantu Anda memahami struktur data dengan cara yang efektif
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BookOpen size={28} className="text-primary-500" />}
              title="Materi Interaktif"
              description="Materi pembelajaran disajikan dalam berbagai format: visual, audio, dan kinestetik untuk mengakomodasi semua gaya belajar."
            />
            <FeatureCard 
              icon={<Award size={28} className="text-secondary-500" />}
              title="Sistem Penghargaan"
              description="Dapatkan badge dan poin XP saat menyelesaikan level dan tantangan untuk tetap termotivasi."
            />
            <FeatureCard 
              icon={<Users size={28} className="text-accent-500" />}
              title="Papan Peringkat"
              description="Bersaing dengan teman sekelas dan seluruh pengguna Structopia untuk mendapatkan posisi teratas."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-6">
          <div className="card-neumorph p-8 md:p-12 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading text-neutral-800">
                Siap Menjelajahi <span className="text-primary-500">Structopia</span>?
              </h2>
              <p className="text-lg mb-8 text-neutral-600">
                Bergabunglah dengan ribuan siswa yang sudah memahami struktur data dengan cara yang menyenangkan. Daftar sekarang dan mulai perjalanan strukturmu!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn-primary">
                  {isAuthenticated ? "Lanjutkan Belajar" : "Mulai Sekarang"}
                </Link>
                <Link to="/login" className="btn-neumorph">
                  {isAuthenticated ? "Dashboard" : "Sudah Punya Akun"}
                </Link>
              </div>
            </div>
            
            <div className="absolute -bottom-8 -right-8 opacity-20">
              <Cube3d size={160} className="text-primary-300" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-primary-500 font-bold text-xl mb-4 md:mb-0">
              <Cube3d size={24} />
              <span className="font-heading">Structopia</span>
            </div>
            
            <p className="text-neutral-600 text-sm">
              © {new Date().getFullYear()} Structopia. Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div 
      className="card-neumorph-hover p-6"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-neutral-800">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </motion.div>
  );
};

export default Home;