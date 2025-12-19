
import React, { useState, useEffect, useCallback } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { GradeLevel, Question, UserProfile } from './types';
import { fetchQuestions } from './geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'loading' | 'quiz' | 'result'>('welcome');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = async (userProfile: UserProfile) => {
    setProfile(userProfile);
    setStep('loading');
    setError(null);
    try {
      const fetchedQuestions = await fetchQuestions(userProfile.grade);
      setQuestions(fetchedQuestions);
      setUserAnswers(new Array(fetchedQuestions.length).fill(-1));
      setStep('quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep('welcome');
    }
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

  const resetQuiz = () => {
    setStep('welcome');
    setQuestions([]);
    setUserAnswers([]);
    setScore(0);
    setProfile(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
        {step === 'welcome' && (
          <WelcomeScreen onStart={startQuiz} initialError={error} />
        )}
        {step === 'loading' && (
          <LoadingScreen />
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
    </div>
  );
};

export default App;
