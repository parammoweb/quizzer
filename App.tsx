
import React, { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { GradeLevel, Question, UserProfile } from './types';
import { getLocalQuestions } from './storeService';

const App: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'quiz' | 'result' | 'admin-login' | 'admin'>('welcome');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = (userProfile: UserProfile) => {
    const localQs = getLocalQuestions(userProfile.grade);
    
    if (localQs.length < 1) {
      setError(`No questions found for ${userProfile.grade}. Admin needs to add questions first.`);
      return;
    }

    setProfile(userProfile);
    setError(null);
    setQuestions(localQs);
    setUserAnswers(new Array(localQs.length).fill(-1));
    setStep('quiz');
  };

  const completeQuiz = (finalAnswers: number[]) => {
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correctAnswerIndex) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setUserAnswers(finalAnswers);
    setStep('result');
  };

  const handleAdminAuth = () => {
    setIsAdminAuth(true);
    setStep('admin');
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
    setStep('welcome');
  };

  const resetQuiz = () => {
    setStep('welcome');
    setQuestions([]);
    setUserAnswers([]);
    setScore(0);
    setProfile(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center font-sans antialiased text-slate-900">
      {/* Navigation Header - Website style */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetQuiz}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
            <span className="font-bold text-xl tracking-tight text-slate-800">SmartQuiz<span className="text-blue-600">Pro</span></span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setStep(isAdminAuth ? 'admin' : 'admin-login')}
              className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </button>
            {isAdminAuth && (
              <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700">Logout</button>
            )}
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl mt-20 mb-10 px-4">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 overflow-hidden min-h-[600px] flex flex-col border border-white/50 backdrop-blur-xl">
          {step === 'welcome' && (
            <WelcomeScreen 
              onStart={startQuiz} 
              onAdmin={() => setStep('admin-login')}
              initialError={error} 
            />
          )}
          {step === 'admin-login' && (
            <AdminLogin onLogin={handleAdminAuth} onCancel={() => setStep('welcome')} />
          )}
          {step === 'admin' && (
            <AdminPanel onBack={() => setStep('welcome')} onLogout={handleLogout} />
          )}
          {step === 'quiz' && (
            <QuizScreen 
              questions={questions} 
              onComplete={completeQuiz} 
              grade={profile?.grade || 'Class 1-2'} 
            />
          )}
          {step === 'result' && (
            <ResultScreen 
              score={score} 
              total={questions.length} 
              profile={profile!} 
              onReset={resetQuiz} 
            />
          )}
        </div>
      </main>

      <footer className="w-full text-center py-8 text-slate-400 text-sm">
        <p>© 2024 SmartQuiz Pro • Educational Excellence Platform</p>
      </footer>
    </div>
  );
};

export default App;
