import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, X, AlertTriangle, Trophy, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import apiService from '../../utils/api';

interface QuizQuestion {
  id: number;
  level_id: number;
  question: string;
  choices: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correct_answer: string;
}

interface QuizResult {
  score: number;
  total_questions: number;
  passed: boolean;
  xp_gained: number;
  new_badges?: { name: string; icon?: string }[];
}

const Quiz = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizLockMessage, setQuizLockMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!levelId) {
        console.log('Quiz.tsx: levelId tidak ditemukan.');
        return;
      }
      console.log('Quiz.tsx: Mencoba mengambil kuis untuk levelId:', levelId);

      setIsLoading(true);
      try {
        const response = await apiService.getLevelQuiz(parseInt(levelId));
        console.log('Quiz.tsx: Respons API mentah:', response);

        const quizData = response.data || [];
        console.log('Quiz.tsx: Data kuis yang diparsing:', quizData);

        setQuestions(quizData);
        
        // Set time based on number of questions (2 minutes per question)
        setTimeLeft(quizData.length * 120);
      } catch (error: any) {
        console.error('Quiz.tsx: Error saat mengambil kuis:', error);
        if (error.response && error.response.status === 403 && error.response.data && error.response.data.message) {
          setQuizLockMessage(error.response.data.message);
        } else {
          setQuizLockMessage('Gagal memuat kuis. Silakan coba lagi.');
        }
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [levelId]);

  useEffect(() => {
    // Timer countdown
    if (timeLeft > 0 && !result && !isLoading) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !result && questions.length > 0) {
      // Auto submit when time runs out
      handleSubmitQuiz();
    }
  }, [timeLeft, result, isLoading]);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!levelId || submitting) return;
    
    setSubmitting(true);
    try {
      const response = await apiService.submitQuiz({
        level_id: parseInt(levelId),
        answers
      });
      
      const responseData = response.data;
      setResult(responseData); 
      
      if (responseData.passed) {
        await apiService.updateProgress({
          level_id: parseInt(levelId),
          status: 'completed'
        });

        if (responseData.new_badges && responseData.new_badges.length > 0) {
          responseData.new_badges.forEach((badge: { name: string, icon?: string }) => {
            toast.success(<div><span role="img" aria-label="badge-icon">🏆</span> Selamat! Anda mendapatkan badge: <strong>{badge.name}</strong></div>);
          });
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Progress percentage
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = questions.length > 0 
    ? Math.round((answeredCount / questions.length) * 100) 
    : 0;

  const isCurrentQuestionAnswered = answers[questions[currentQuestion]?.id] !== undefined;

  if (isLoading) {
    return (
      <div className="card-neumorph p-8 rounded-xl text-center">
        <div className="animate-spin mb-4 mx-auto w-7 h-7">
          <Clock size={32} className="text-primary-500" />
        </div>
        <p className="text-neutral-600">Memuat soal kuis...</p>
      </div>
    );
  }

  if (quizLockMessage && questions.length === 0) {
    return (
      <div className="card-neumorph p-8 rounded-xl text-center">
        <AlertTriangle size={32} className="text-warning-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-neutral-800">Kuis Terkunci atau Tidak Tersedia</h3>
        <p className="text-neutral-600 mb-6">
          {quizLockMessage}
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="btn-primary"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-neumorph p-8 rounded-xl text-center">
          <div className="mb-6">
            {result.passed ? (
              <div className="w-24 h-24 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy size={48} className="text-success-500" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={48} className="text-error-500" />
              </div>
            )}
            
            <h2 className="text-2xl font-bold mb-2 font-heading text-neutral-800">
              {result.passed ? 'Selamat! Anda Lulus Kuis' : 'Belum Berhasil'}
            </h2>
            
            <p className="text-neutral-600">
              Anda mendapatkan {result.score} dari {result.total_questions} soal benar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="card-neumorph p-4 rounded-xl">
              <h3 className="text-sm font-medium text-neutral-500 mb-1">Skor</h3>
              <p className="text-2xl font-bold text-neutral-800">
                {Math.round((result.score / result.total_questions) * 100)}%
              </p>
            </div>
            
            <div className="card-neumorph p-4 rounded-xl">
              <h3 className="text-sm font-medium text-neutral-500 mb-1">XP Diperoleh</h3>
              <p className="text-2xl font-bold text-primary-500">+{result.xp_gained} XP</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate(`/levels/${levelId}`)}
              className="btn-neumorph w-full sm:w-auto"
            >
              Kembali ke Level
            </button>

            {result.passed && (
              <button 
                onClick={() => navigate('/levels')} 
                className="btn-primary w-full sm:w-auto" // Atau style lain yang sesuai
              >
                Lihat Daftar Level
              </button>
            )}
            
            {!result.passed && (
              <button 
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setCurrentQuestion(0);
                  setTimeLeft(questions.length * 120);
                }}
                className="btn-primary w-full sm:w-auto"
              >
                Coba Lagi
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-neutral-600 hover:text-primary-500 mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> Kembali
      </button>

      <div className="card-neumorph p-6 rounded-xl mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold font-heading text-neutral-800">
            Kuis Level
          </h1>
          
          <div className="card-neumorph px-4 py-2 rounded-full flex items-center text-neutral-700">
            <Clock size={18} className="mr-2" />
            <span className={`font-bold ${timeLeft < 60 ? 'text-error-500' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-neutral-600">Progress</span>
            <span className="font-medium">{answeredCount}/{questions.length} dijawab</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2.5">
            <div 
              className="bg-primary-500 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-10 gap-1 mb-2">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full ${
                index === currentQuestion 
                  ? 'bg-primary-500' 
                  : answers[questions[index]?.id] !== undefined
                    ? 'bg-success-500'
                    : 'bg-neutral-300'
              }`}
              onClick={() => setCurrentQuestion(index)}
              aria-label={`Pertanyaan ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="card-neumorph p-6 rounded-xl mb-8"
        >
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                Soal {currentQuestion + 1} dari {questions.length}
              </span>
            </div>
            
            <h2 className="text-xl font-semibold mb-6 text-neutral-800">
              {questions[currentQuestion]?.question}
            </h2>
            
            <div className="space-y-3">
              {Object.entries(questions[currentQuestion]?.choices || {}).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleAnswer(questions[currentQuestion].id, key)}
                  className={`w-full flex items-start p-4 rounded-xl transition-all ${
                    answers[questions[currentQuestion]?.id] === key
                      ? 'bg-primary-50 text-primary-700 shadow-neumorph-pressed'
                      : 'btn-neumorph text-neutral-700 hover:shadow-neumorph-pressed'
                  }`}
                >
                  <div className="mr-3 mt-0.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                      answers[questions[currentQuestion]?.id] === key
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-neutral-300'
                    }`}>
                      {answers[questions[currentQuestion]?.id] === key && <Check size={14} />}
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="font-medium">{key.toUpperCase()}.</span> {value}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          className="btn-neumorph"
          disabled={currentQuestion === 0}
        >
          Sebelumnya
        </button>
        
        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className={`btn-primary ${!isCurrentQuestionAnswered ? 'opacity-70' : ''}`}
            disabled={!isCurrentQuestionAnswered}
          >
            Selanjutnya
          </button>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            className="btn-primary"
            disabled={submitting || progressPercentage < 100}
          >
            {submitting ? 'Memproses...' : 'Selesai & Kirim'}
          </button>
        )}
      </div>
      
      {progressPercentage < 100 && currentQuestion === questions.length - 1 && (
        <div className="mt-4 p-4 bg-warning-50 border border-warning-200 rounded-lg text-warning-700">
          <div className="flex items-start">
            <AlertTriangle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Belum semua soal dijawab</p>
              <p className="text-sm">Jawab semua pertanyaan sebelum mengirimkan kuis.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;