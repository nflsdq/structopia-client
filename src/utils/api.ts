import axios from 'axios';
import { toast } from 'react-toastify';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors to handle token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized, clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          toast.error(data.message || 'Sesi habis, silakan login kembali');
          break;
        case 403:
          toast.error(data.message || 'Anda tidak memiliki akses');
          break;
        case 404:
          toast.error(data.message || 'Data tidak ditemukan');
          break;
        case 422:
          // Validation errors
          if (data.errors) {
            Object.values(data.errors).forEach((errorMessages: any) => {
              if (Array.isArray(errorMessages)) {
                errorMessages.forEach((message) => toast.error(message));
              }
            });
          } else {
            toast.error(data.message || 'Terjadi kesalahan validasi');
          }
          break;
        case 500:
          toast.error('Terjadi kesalahan pada server');
          break;
        default:
          toast.error('Terjadi kesalahan');
          break;
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
      toast.error('Gagal terhubung ke server. Periksa koneksi Anda.');
    } else {
      // Error in setting up the request
      console.error('API Error:', error.message);
      toast.error('Terjadi kesalahan saat menghubungi server');
    }
    return Promise.reject(error);
  }
);

// Service wrapper to handle API calls
const apiService = {
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    return await api.post('/login', credentials);
  },

  register: async (userData: { name: string; email: string; password: string; role: string }) => {
    return await api.post('/register', userData);
  },

  logout: async () => {
    return await api.post('/logout');
  },

  getUser: async () => {
    return await api.get('/user');
  },

  // Levels
  getLevels: async () => {
    return await api.get('/levels');
  },

  getLevelById: async (id: number) => {
    return await api.get(`/levels/${id}`);
  },

  getLevelMateri: async (levelId: number, type?: string) => {
    const url = type ? `/levels/${levelId}/materi?type=${type}` : `/levels/${levelId}/materi`;
    return await api.get(url);
  },

  getLevelQuiz: async (levelId: number) => {
    return await api.get(`/levels/${levelId}/quiz`);
  },

  // Materi
  getMateriById: async (id: number) => {
    return await api.get(`/materi/${id}`);
  },

  markMateriAsCompleted: async (id: number) => {
    return await api.post(`/materi/${id}/complete`);
  },

  // Quiz
  submitQuiz: async (data: { level_id: number; answers: Record<string, string> }) => {
    return await api.post('/quiz/submit', data);
  },

  getQuizHistory: async () => {
    return await api.get('/quiz/history');
  },

  // Progress
  getProgress: async () => {
    return await api.get('/progress');
  },

  updateProgress: async (data: { level_id: number; status: string }) => {
    return await api.post('/progress/update', data);
  },

  getUnlockedLevels: async () => {
    return await api.get('/progress/unlocked-levels');
  },

  // Badges
  getBadges: async () => {
    return await api.get('/badges');
  },

  getUserBadges: async () => {
    return await api.get('/user/badges');
  },

  // Leaderboard
  getLeaderboard: async () => {
    return await api.get('/leaderboard');
  },
};

export default apiService;