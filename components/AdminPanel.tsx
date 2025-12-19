
import React, { useState, useEffect } from 'react';
import { GradeLevel, Question } from '../types';
import { getLocalQuestions, saveLocalQuestions } from '../storeService';
import { fetchQuestions } from '../geminiService';

interface AdminPanelProps {
  onBack: () => void;
  onLogout: () => void;
}

const GRADES: GradeLevel[] = ['Class 1-2', 'Class 3-4', 'Class 5-6', 'Class 7-8', 'Class 9'];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, onLogout }) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Class 1-2');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [qText, setQText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIdx, setCorrectIdx] = useState(0);

  useEffect(() => {
    setQuestions(getLocalQuestions(selectedGrade));
  }, [selectedGrade]);

  const handleSave = () => {
    if (!qText.trim() || options.some(o => !o.trim())) {
      alert("Please fill all fields");
      return;
    }

    let updated: Question[];
    if (editingId) {
      updated = questions.map(q => q.id === editingId ? { ...q, question: qText, options, correctAnswerIndex: correctIdx } : q);
    } else {
      const newQ: Question = {
        id: Date.now().toString(),
        question: qText,
        options: [...options],
        correctAnswerIndex: correctIdx
      };
      updated = [...questions, newQ];
    }

    setQuestions(updated);
    saveLocalQuestions(selectedGrade, updated);
    resetForm();
  };

  const resetForm = () => {
    setQText('');
    setOptions(['', '', '', '']);
    setCorrectIdx(0);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (q: Question) => {
    setQText(q.question);
    setOptions(q.options);
    setCorrectIdx(q.correctAnswerIndex);
    setEditingId(q.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this question?")) {
      const updated = questions.filter(q => q.id !== id);
      setQuestions(updated);
      saveLocalQuestions(selectedGrade, updated);
    }
  };

  const generateWithAI = async () => {
    if (questions.length > 0 && !confirm("This will overwrite existing questions for this grade. Continue?")) return;
    
    setIsGenerating(true);
    try {
      const fetched = await fetchQuestions(selectedGrade);
      const mapped = fetched.map(q => ({ ...q, id: Math.random().toString(36).substr(2, 9) }));
      setQuestions(mapped);
      saveLocalQuestions(selectedGrade, mapped);
    } catch (err) {
      alert("AI Generation failed. Check API Key or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-[600px] bg-slate-50">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center font-bold text-xs">A</div>
            <span className="font-bold tracking-tight">Admin Dashboard</span>
          </div>
          
          <nav className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-2">Grades</p>
            {GRADES.map(g => (
              <button
                key={g}
                onClick={() => { setSelectedGrade(g); setIsAdding(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  selectedGrade === g ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {g}
                {selectedGrade === g && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-800 space-y-2">
          <button 
            onClick={onBack}
            className="w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
          <button 
            onClick={onLogout}
            className="w-full px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto">
        <header className="p-8 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Content Management</h2>
            <p className="text-slate-500 text-sm">Managing questions for <span className="text-blue-600 font-bold">{selectedGrade}</span></p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={generateWithAI}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 flex items-center gap-2 disabled:opacity-50 transition-all border border-indigo-100"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              AI Import
            </button>
            <button 
              onClick={() => { setIsAdding(true); setEditingId(null); setQText(''); setOptions(['', '', '', '']); setCorrectIdx(0); }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              Add Question
            </button>
          </div>
        </header>

        <div className="p-8">
          {isAdding ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-xl font-bold mb-8 text-slate-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  {editingId ? '✎' : '+'}
                </div>
                {editingId ? 'Edit Question' : 'Create New Question'}
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Question Title</label>
                  <textarea 
                    value={qText}
                    onChange={e => setQText(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none min-h-[120px] transition-all text-lg font-medium"
                    placeholder="Enter the question here..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Options (Select correct with radio button)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((opt, idx) => (
                      <div key={idx} className={`p-4 border rounded-2xl transition-all ${correctIdx === idx ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-100' : 'border-slate-100 bg-slate-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-slate-400">Option {String.fromCharCode(65+idx)}</span>
                          <input 
                            type="radio" 
                            name="correct" 
                            checked={correctIdx === idx}
                            onChange={() => setCorrectIdx(idx)}
                            className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={opt}
                          onChange={e => {
                            const next = [...options];
                            next[idx] = e.target.value;
                            setOptions(next);
                          }}
                          className="w-full bg-transparent p-0 border-none focus:ring-0 outline-none text-slate-700 font-medium text-base"
                          placeholder={`Enter choice ${idx+1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button onClick={handleSave} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                    {editingId ? 'Update Question' : 'Save Question'}
                  </button>
                  <button onClick={resetForm} className="px-8 py-4 bg-white text-slate-500 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 17.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 font-medium">No questions found in this category.</p>
                  <button onClick={() => setIsAdding(true)} className="mt-4 text-blue-600 font-bold hover:underline">Start adding questions</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start gap-5 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors flex items-center justify-center font-black shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 mb-3 text-lg leading-snug">{q.question}</p>
                        <div className="flex flex-wrap gap-2">
                          {q.options.map((opt, oIdx) => (
                            <span key={oIdx} className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-all ${oIdx === q.correctAnswerIndex ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                              {String.fromCharCode(65 + oIdx)}: {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 self-start">
                        <button onClick={() => handleEdit(q)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(q.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
