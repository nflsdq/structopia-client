import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Video, Music, Play, FileText, Info, CheckCircle, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import apiService from '../../utils/api';
import ClassificationDragDrop from '../../components/kinesthetic/ClassificationDragDrop';
import ArraySimulator from '../../components/kinesthetic/ArraySimulator';
import StackQueueSimulator from '../../components/kinesthetic/StackQueueSimulator';
import LinkedListBuilder from '../../components/kinesthetic/LinkedListBuilder';
import GraphTraversalSimulator from '../../components/kinesthetic/GraphTraversalSimulator';

interface Materi {
  id: number;
  level_id: number;
  title: string;
  type: 'visual' | 'auditory' | 'kinesthetic';
  content: string;
  media_url: string | null;
  meta: {
    description: string;
    objective: string;
    presentation_data?: {
      type: string;
      image_url?: string;
      diagrams?: Array<{
        title: string;
        image_url: string;
        notes: string;
      }>;
      interactive_elements?: Array<{
        area_coords: string;
        tooltip: string;
      }>;
      zoom_enabled?: boolean;
      comparison_points?: string[];
    };
    media_data?: {
      type: string;
      audio_url: string;
      transcript_available?: boolean;
      transcript_url?: string;
      duration_seconds: number;
      key_points?: string[];
      key_takeaways?: string[];
      analogies_explained?: Array<{
        concept: string;
        analogy: string;
      }>;
      story_elements?: string[];
      interview_questions_covered?: string[];
    };
    activity_data?: {
      type: string;
      instructions_detail: string | { [key: string]: string };
      items_to_classify?: any[];
      categories?: any[];
      correct_mappings?: any;
      initial_array_elements?: number[];
      array_capacity?: number;
      max_elements?: number;
      operation_type?: 'stack' | 'queue';
      max_nodes?: number;
      available_operations?: string[];
      default_graph?: {
        nodes: Array<{ id: string; label: string }>;
        edges: Array<{ from: string; to: string }>;
        is_directed: boolean;
      };
      traversal_methods?: Array<{ id: string; name: string }>;
    };
  };
  xp_value?: number;
  is_completed?: boolean;
}

const MaterialDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [materi, setMateri] = useState<Materi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    const fetchMateriDetail = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await apiService.getMateriById(parseInt(id));
        const materiData = response.data.data || response.data;
        setMateri(materiData);

      } catch (error) {
        console.error('Error fetching materi details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMateriDetail();
  }, [id]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderMetaContent = () => {
    if (!materi?.meta) return null;

    const presentation_data = materi.meta.presentation_data;
    const media_data = materi.meta.media_data;
    const activity_data = materi.meta.activity_data;

    switch (materi.type) {
      case 'visual':
        return presentation_data && (
          <div className="space-y-4">
            {presentation_data.image_url && (
              <div className="card-neumorph p-2 rounded-xl overflow-hidden">
                <img 
                  src={presentation_data.image_url} 
                  alt={materi.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
            
            {presentation_data.diagrams && (
              <div className="space-y-4">
                {presentation_data.diagrams.map((diagram, index) => (
                  <div key={index} className="card-neumorph p-4 rounded-xl">
                    <h3 className="font-semibold mb-2">{diagram.title}</h3>
                    <img 
                      src={diagram.image_url} 
                      alt={diagram.title}
                      className="w-full h-auto rounded-lg mb-2"
                    />
                    <p className="text-sm text-neutral-600">{diagram.notes}</p>
                  </div>
                ))}
              </div>
            )}

            {presentation_data.comparison_points && (
              <div className="card-neumorph p-4 rounded-xl">
                <h3 className="font-semibold mb-2">Poin Perbandingan</h3>
                <ul className="list-disc list-inside space-y-1 text-neutral-700">
                  {presentation_data.comparison_points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'auditory':
        return media_data && (
          <div className="space-y-4">
            <div className="card-neumorph p-4 rounded-xl">
              <audio 
                controls 
                className="w-full mb-4"
                src={media_data.audio_url}
              >
                Browser Anda tidak mendukung pemutaran audio.
              </audio>
              
              <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
                <span>Durasi: {formatDuration(media_data.duration_seconds)}</span>
                {media_data.transcript_available && (
                  <a 
                    href={media_data.transcript_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline"
                  >
                    Lihat Transkrip
                  </a>
                )}
              </div>

              {media_data.key_points && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Poin Kunci</h3>
                  <ul className="list-disc list-inside space-y-1 text-neutral-700">
                    {media_data.key_points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {media_data.analogies_explained && (
                <div>
                  <h3 className="font-semibold mb-2">Analogi</h3>
                  <div className="space-y-3">
                    {media_data.analogies_explained.map((analogy, index) => (
                      <div key={index} className="bg-neutral-50 p-3 rounded-lg">
                        <p className="font-medium">{analogy.concept}</p>
                        <p className="text-sm text-neutral-600">{analogy.analogy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'kinesthetic':
        return activity_data && (
          <div className="space-y-6">
            <div className="card-neumorph p-6 rounded-xl">
              <div className="flex items-start space-x-3 mb-6">
                <div className="p-2 bg-accent-100 rounded-lg">
                  <Play size={20} className="text-accent-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Instruksi Aktivitas</h3>
                  <p className="text-neutral-600">
                    {typeof activity_data.instructions_detail === 'string' 
                      ? activity_data.instructions_detail
                      : Object.values(activity_data.instructions_detail).join(' ')}
                  </p>
                </div>
              </div>

              {activity_data.type === 'classification_drag_and_drop' && activity_data.items_to_classify && activity_data.categories && (
                <ClassificationDragDrop
                  items={activity_data.items_to_classify}
                  categories={activity_data.categories}
                  correctMappings={activity_data.correct_mappings}
                />
              )}

              {activity_data.type === 'array_insertion_deletion_simulation' && 
                typeof activity_data.initial_array_elements !== 'undefined' && 
                typeof activity_data.array_capacity !== 'undefined' && (
                <ArraySimulator
                  initialElements={activity_data.initial_array_elements}
                  capacity={activity_data.array_capacity}
                />
              )}

              {activity_data.type === 'stack_queue_operations_simulation' && 
                typeof activity_data.max_elements !== 'undefined' && 
                activity_data.instructions_detail && 
                typeof activity_data.instructions_detail === 'object' && 
                activity_data.instructions_detail.stack && 
                activity_data.instructions_detail.queue && (
                <StackQueueSimulator
                  maxElements={activity_data.max_elements}
                  allInstructions={activity_data.instructions_detail as { stack: string; queue: string }}
                />
              )}

              {activity_data.type === 'linked_list_construction_simulation' && 
                typeof activity_data.max_nodes !== 'undefined' && (
                <LinkedListBuilder
                  maxNodes={activity_data.max_nodes}
                />
              )}

              {activity_data.type === 'graph_traversal_simulation' && 
                activity_data.default_graph && 
                activity_data.traversal_methods && (
                <GraphTraversalSimulator
                  nodes={activity_data.default_graph.nodes}
                  edges={activity_data.default_graph.edges}
                  isDirected={activity_data.default_graph.is_directed}
                  traversalMethods={activity_data.traversal_methods}
                />
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleCompleteMateri = async () => {
    if (!id || !materi || materi.is_completed || isCompleting) return;

    setIsCompleting(true);
    try {
      const response = await apiService.markMateriAsCompleted(parseInt(id));
      setMateri(prevMateri => prevMateri ? { ...prevMateri, is_completed: true } : null);
      
      if (response.data && response.data.new_badges && response.data.new_badges.length > 0) {
        response.data.new_badges.forEach((badge: { name: string, icon?: string }) => {
          toast.success(<div><span role="img" aria-label="badge-icon">🏆</span> Selamat! Anda mendapatkan badge: <strong>{badge.name}</strong></div>);
        });
      }
    } catch (error) {
      console.error('Error marking materi as completed:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const getTypeIcon = () => {
    if (!materi) return <FileText size={20} />;
    
    switch (materi.type) {
      case 'visual':
        return <Video size={20} className="text-primary-500" />;
      case 'auditory':
        return <Music size={20} className="text-secondary-500" />;
      case 'kinesthetic':
        return <Play size={20} className="text-accent-500" />;
      default:
        return <FileText size={20} className="text-neutral-500" />;
    }
  };

  const getTypeLabel = () => {
    if (!materi) return 'Materi';
    
    switch (materi.type) {
      case 'visual':
        return 'Materi Visual';
      case 'auditory':
        return 'Materi Audio';
      case 'kinesthetic':
        return 'Materi Kinestetik';
      default:
        return 'Materi';
    }
  };

  const getBackgroundGradient = () => {
    if (!materi) return '';
    
    switch (materi.type) {
      case 'visual':
        return 'bg-gradient-to-br from-primary-50/50 to-transparent';
      case 'auditory':
        return 'bg-gradient-to-br from-secondary-50/50 to-transparent';
      case 'kinesthetic':
        return 'bg-gradient-to-br from-accent-50/50 to-transparent';
      default:
        return '';
    }
  };

  return (
    <div>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-neutral-600 hover:text-primary-500 mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> Kembali
      </button>

      {isLoading ? (
        <div className="card-neumorph p-8 rounded-xl text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-neutral-200 rounded w-3/4 mx-auto"></div>
            <div className="h-64 bg-neutral-200 rounded w-full mx-auto"></div>
            <div className="h-4 bg-neutral-200 rounded w-full mx-auto"></div>
            <div className="h-4 bg-neutral-200 rounded w-full mx-auto"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      ) : materi ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`card-neumorph rounded-xl overflow-hidden mb-8 ${getBackgroundGradient()}`}>
            <div className="p-6">
              <div className="flex items-center mb-3">
                {getTypeIcon()}
                <span className="ml-2 text-sm font-medium text-neutral-600">
                  {getTypeLabel()}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-6 font-heading text-neutral-800">
                {materi.title}
              </h1>

              {materi.meta && (
                <div className="mb-6 space-y-4">
                  <div className="card-neumorph p-4 rounded-xl bg-white/50">
                    <div className="flex items-start space-x-3">
                      <Info size={20} className="text-primary-500 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">Tujuan Pembelajaran</h3>
                        <p className="text-neutral-600">{materi.meta.objective}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {renderMetaContent()}
              
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Deskripsi</h2>
                <div 
                  className="prose prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: materi.content }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Link 
              to={`/levels/${materi.level_id}`} 
              className="btn-neumorph px-6"
            >
              Kembali ke Level
            </Link>
            
            <div className="flex items-center space-x-4">
              {materi.xp_value && !materi.is_completed && (
                <div className="flex items-center text-sm text-neutral-600">
                  <Award size={18} className="mr-1 text-primary-500" />
                  <span>+{materi.xp_value} XP</span>
                </div>
              )}
              <button 
                onClick={handleCompleteMateri}
                className={`btn-primary ${ (materi.is_completed || isCompleting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={materi.is_completed || isCompleting}
              >
                {isCompleting ? 'Memproses...' : materi.is_completed ? (
                  <>
                    <CheckCircle size={16} className="mr-1" /> Selesai
                  </>
                ) : 'Tandai Selesai'}
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="card-neumorph p-8 rounded-xl text-center">
          <h3 className="text-xl font-semibold mb-2 text-neutral-800">Materi Tidak Ditemukan</h3>
          <p className="text-neutral-600 mb-6">Materi yang Anda cari tidak tersedia atau mungkin telah dihapus.</p>
          <Link to="/levels" className="btn-primary">
            Kembali ke Daftar Level
          </Link>
        </div>
      )}
    </div>
  );
};

export default MaterialDetail;