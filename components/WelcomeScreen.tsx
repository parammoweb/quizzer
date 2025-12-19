
import React, { useState } from 'react';
import { GradeLevel, UserProfile } from '../types';

interface WelcomeScreenProps {
  onStart: (profile: UserProfile) => void;
  onAdmin: () => void;
  initialError: string | null;
}

const GRADES: GradeLevel[] = ['Class 1-2', 'Class 3-4', 'Class 5-6', 'Class 7-8', 'Class 9'];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onAdmin, initialError }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('Class 1-2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart({ name, grade });
    }
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
      {/* Left Column: Visual/Marketing */}
      <div className="hidden md:flex md:w-5/12 bg-blue-600 p-12 text-white flex-col justify-between">
        <div>
          <h1 className="text-4xl font-black leading-tight mb-6">Interactive Learning for Tomorrow's Leaders.</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Take our curriculum-aligned tests, challenge your mind, and earn certified recognition for your achievements.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">10-Min Timer</p>
              <p className="text-blue-200 text-sm">Quick, focused assessments.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Verified Certificates</p>
              <p className="text-blue-200 text-sm">Instantly downloadable results.</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-blue-300 font-medium">
          Trusted by over 50,000 students worldwide.
        </div>
      </div>

      {/* Right Column: Interaction */}
      <div className="flex-1 p-8 md:p-12 bg-white flex flex-col justify-center">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Get Started</h2>
          <p className="text-slate-500">Enter your details to begin the assessment.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-sm">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-medium"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grade Level</label>
            <div className="grid grid-cols-2 gap-2">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                    grade === g 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' 
                      : 'bg-white border-slate-100 text-slate-500 hover:border-blue-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {initialError && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{initialError}</span>
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-2xl shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all"
            >
              Launch Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
