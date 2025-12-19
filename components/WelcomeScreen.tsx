
import React, { useState } from 'react';
import { GradeLevel, UserProfile } from '../types';

interface WelcomeScreenProps {
  onStart: (profile: UserProfile) => void;
  initialError: string | null;
}

const GRADES: GradeLevel[] = ['Class 1-2', 'Class 3-4', 'Class 5-6', 'Class 7-8', 'Class 9'];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, initialError }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('Class 1-2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart({ name, grade });
    }
  };

  return (
    <div className="p-8 md:p-12 flex flex-col flex-1">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Smart-Quiz AI</h1>
        <p className="text-slate-500 mt-2">Test your knowledge and earn a certificate!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Your Full Name</label>
          <input 
            type="text" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter your name for the certificate"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Your Grade</label>
          <div className="grid grid-cols-2 gap-3">
            {GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                  grade === g 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {initialError && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {initialError}
          </div>
        )}

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 active:transform active:scale-[0.98] transition-all"
          >
            Start Quiz (25 Qs | 10 Min)
          </button>
        </div>
      </form>
    </div>
  );
};
