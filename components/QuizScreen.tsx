
import React, { useState, useEffect, useCallback } from 'react';
import { Question, GradeLevel } from '../types';

interface QuizScreenProps {
  questions: Question[];
  grade: GradeLevel;
  onComplete: (answers: number[]) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, grade, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answers, onComplete]);

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Header Info */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{grade}</span>
          <h3 className="text-sm font-semibold text-slate-700">Question {currentIndex + 1} of {questions.length}</h3>
        </div>
        <div className={`px-4 py-2 rounded-full font-mono text-lg font-bold flex items-center gap-2 ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-100">
        <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Question Content */}
      <div className="p-8 flex-1 flex flex-col">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-8 leading-tight">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3 flex-1">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all group flex items-center gap-4 ${
                answers[currentIndex] === idx
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                  : 'bg-white border-slate-100 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${
                answers[currentIndex] === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className={`text-lg ${answers[currentIndex] === idx ? 'text-blue-900 font-medium' : 'text-slate-700'}`}>
                {option}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            currentIndex === 0 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-50 active:bg-slate-100'
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={answers[currentIndex] === -1}
          className={`flex-1 md:flex-none md:min-w-[200px] px-8 py-3 rounded-xl font-semibold shadow-lg transition-all ${
            answers[currentIndex] === -1
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};
