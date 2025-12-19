
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
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row flex-1">
        {/* Left: Branding & Value Proposition */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 p-12 text-white flex flex-col justify-center">
          <div className="max-w-md">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-400/20 text-blue-200 text-xs font-bold uppercase tracking-widest mb-6">
              Empowering Students Globally
            </span>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Master Your Skills with <span className="text-blue-300">SmartQuiz Pro.</span>
            </h1>
            <p className="text-blue-100 text-lg mb-10 leading-relaxed opacity-90">
              The premier platform for curriculum-aligned assessments. Challenge yourself with 25 dynamic questions and earn a globally recognized certificate.
            </p>
            
            <div className="grid grid-cols-1 gap-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold">AI-Powered Questions</h4>
                  <p className="text-blue-200 text-sm">Every test is unique and tailored to your specific grade level.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold">10-Minute Sprint</h4>
                  <p className="text-blue-200 text-sm">Build focus and speed with our timed interactive environment.</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-800 bg-slate-300 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-200 font-medium">Joined by 12,000+ students this month</p>
            </div>
          </div>
        </div>

        {/* Right: Interactive Start Form */}
        <div className="md:w-1/2 bg-white p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Ready to Start?</h2>
            <p className="text-slate-500 mb-10">Fill in your details to begin your 25-question journey.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Student Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Grade</label>
                <div className="grid grid-cols-2 gap-3">
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
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-3 animate-pulse">
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold">{initialError}</span>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
              >
                Launch Assessment
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              <p className="text-center text-xs text-slate-400 font-medium">
                By clicking launch, you agree to our <span className="underline cursor-pointer">Learning Terms</span>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Trust & Features Footer Section */}
      <section className="bg-slate-50 py-12 px-12 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-8 opacity-70 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2 font-black text-slate-400 text-xl tracking-tighter">
            <div className="w-8 h-8 bg-slate-300 rounded flex items-center justify-center text-white">E</div>
            EduGlobal
          </div>
          <div className="flex items-center gap-2 font-black text-slate-400 text-xl tracking-tighter">
            <div className="w-8 h-8 bg-slate-300 rounded flex items-center justify-center text-white">S</div>
            ScholarSys
          </div>
          <div className="flex items-center gap-2 font-black text-slate-400 text-xl tracking-tighter">
            <div className="w-8 h-8 bg-slate-300 rounded flex items-center justify-center text-white">P</div>
            PeakAcademy
          </div>
          <div className="flex items-center gap-2 font-black text-slate-400 text-xl tracking-tighter">
            <div className="w-8 h-8 bg-slate-300 rounded flex items-center justify-center text-white">T</div>
            TechTutor
          </div>
        </div>
      </section>
    </div>
  );
};
