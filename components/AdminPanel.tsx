
import React, { useState, useEffect, useRef } from 'react';
import { GradeLevel, Question, CertificateConfig, CertFont } from '../types';
import { getLocalQuestions, saveLocalQuestions, getCertConfig, saveCertConfig } from '../storeService';
import { fetchQuestions } from '../geminiService';

interface AdminPanelProps {
  onBack: () => void;
  onLogout: () => void;
}

const GRADES: GradeLevel[] = ['Class 1-2', 'Class 3-4', 'Class 5-6', 'Class 7-8', 'Class 9'];
const FONTS: { label: string; value: CertFont }[] = [
  { label: 'Classic Script', value: 'Great Vibes' },
  { label: 'Handwritten', value: 'Dancing Script' },
  { label: 'Formal Serif', value: 'EB Garamond' },
  { label: 'Modern Sans', value: 'Plus Jakarta Sans' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'certificate'>('questions');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Class 1-2');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Question Form State
  const [qText, setQText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIdx, setCorrectIdx] = useState(0);

  // Certificate Form State
  const [certConfig, setCertConfig] = useState<CertificateConfig>(getCertConfig());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuestions(getLocalQuestions(selectedGrade));
  }, [selectedGrade]);

  const handleSaveQuestion = () => {
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
    resetQuestionForm();
  };

  const resetQuestionForm = () => {
    setQText('');
    setOptions(['', '', '', '']);
    setCorrectIdx(0);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEditQuestion = (q: Question) => {
    setQText(q.question);
    setOptions(q.options);
    setCorrectIdx(q.correctAnswerIndex);
    setEditingId(q.id);
    setIsAdding(true);
  };

  const handleDeleteQuestion = (id: string) => {
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

  const handleSaveCertificate = () => {
    saveCertConfig(certConfig);
    alert("Certificate settings saved!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertConfig({ ...certConfig, templateImage: reader.result as string, useCustomTemplate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const getPreviewFontStyle = () => {
    switch (certConfig.nameFontFamily) {
      case 'EB Garamond': return 'font-formal';
      case 'Dancing Script': return 'font-script';
      case 'Plus Jakarta Sans': return 'font-modern';
      default: return 'font-certificate';
    }
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-[600px] bg-slate-50">
      <div className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center font-bold text-xs">A</div>
            <span className="font-bold tracking-tight">Admin Dashboard</span>
          </div>
          <nav className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-2">Grades</p>
              <div className="space-y-1">
                {GRADES.map(g => (
                  <button
                    key={g}
                    onClick={() => { setActiveTab('questions'); setSelectedGrade(g); setIsAdding(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'questions' && selectedGrade === g ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-2">Design</p>
              <button
                onClick={() => setActiveTab('certificate')}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'certificate' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Edit Certificate
              </button>
            </div>
          </nav>
        </div>
        <div className="pt-6 mt-6 border-t border-slate-800 space-y-2">
          <button onClick={onBack} className="w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-2">Home</button>
          <button onClick={onLogout} className="w-full px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-all">Logout</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto">
        {activeTab === 'questions' ? (
          <>
            <header className="p-8 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div><h2 className="text-2xl font-bold text-slate-800">Questions</h2><p className="text-slate-500 text-sm">Managing <span className="text-blue-600 font-bold">{selectedGrade}</span></p></div>
              <div className="flex gap-2">
                <button onClick={generateWithAI} disabled={isGenerating} className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 flex items-center gap-2 disabled:opacity-50 transition-all border border-indigo-100">AI Import</button>
                <button onClick={() => { setIsAdding(true); setEditingId(null); setQText(''); setOptions(['', '', '', '']); setCorrectIdx(0); }} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Add Question</button>
              </div>
            </header>
            <div className="p-8">
              {isAdding ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-3xl">
                  <h3 className="text-xl font-bold mb-8 text-slate-800">{editingId ? 'Edit Question' : 'Create Question'}</h3>
                  <div className="space-y-6">
                    <div><label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Question</label><textarea value={qText} onChange={e => setQText(e.target.value)} className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none min-h-[120px]" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input type="radio" checked={correctIdx === idx} onChange={() => setCorrectIdx(idx)} />
                          <input type="text" value={opt} onChange={e => { const n = [...options]; n[idx] = e.target.value; setOptions(n); }} className="w-full p-2 border border-slate-200 rounded-lg" placeholder={`Option ${idx+1}`} />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <button onClick={handleSaveQuestion} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold">Save</button>
                      <button onClick={resetQuestionForm} className="px-8 py-4 bg-white text-slate-500 rounded-2xl border border-slate-200">Cancel</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div><p className="font-bold text-slate-800">{idx + 1}. {q.question}</p><p className="text-xs text-slate-400 mt-1">{q.options.length} Options</p></div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditQuestion(q)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">Edit</button>
                        <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <header className="p-8 border-b border-slate-200 bg-white">
              <h2 className="text-2xl font-bold text-slate-800">Certificate Designer</h2>
              <p className="text-slate-500 text-sm">Upload your ready PDF image and position the name precisely.</p>
            </header>
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div>Template Mode</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCertConfig({...certConfig, useCustomTemplate: false})}
                      className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${!certConfig.useCustomTemplate ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-slate-100 text-slate-400'}`}
                    >Dynamic Default</button>
                    <button 
                      onClick={() => setCertConfig({...certConfig, useCustomTemplate: true})}
                      className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${certConfig.useCustomTemplate ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-slate-100 text-slate-400'}`}
                    >Custom Image</button>
                  </div>
                </div>

                {certConfig.useCustomTemplate ? (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Upload Template Image</label>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:bg-slate-100 transition-all flex flex-col items-center gap-2">
                        {certConfig.templateImage ? 'Change Image' : 'Click to Upload Template Image'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Font Family</label>
                        <select 
                          value={certConfig.nameFontFamily} 
                          onChange={e => setCertConfig({...certConfig, nameFontFamily: e.target.value as CertFont})}
                          className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                        >
                          {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Name Color</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={certConfig.nameColor} 
                            onChange={e => setCertConfig({...certConfig, nameColor: e.target.value})}
                            className="w-10 h-10 rounded-lg cursor-pointer border-none"
                          />
                          <input 
                            type="text" 
                            value={certConfig.nameColor} 
                            onChange={e => setCertConfig({...certConfig, nameColor: e.target.value})}
                            className="flex-1 p-2 border border-slate-200 rounded-xl text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Horizontal (X) <span>{certConfig.nameXPos}%</span></label>
                        <input type="range" min="0" max="100" value={certConfig.nameXPos} onChange={e => setCertConfig({...certConfig, nameXPos: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                      </div>
                      <div>
                        <label className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Vertical (Y) <span>{certConfig.nameYPos}%</span></label>
                        <input type="range" min="0" max="100" value={certConfig.nameYPos} onChange={e => setCertConfig({...certConfig, nameYPos: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                      </div>
                      <div>
                        <label className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Size <span>{certConfig.nameFontSize}px</span></label>
                        <input type="range" min="10" max="150" value={certConfig.nameFontSize} onChange={e => setCertConfig({...certConfig, nameFontSize: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                      </div>
                    </div>
                  </div>
                ) : (
                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Branding Color</label>
                      <input type="color" value={certConfig.primaryColor} onChange={e => setCertConfig({...certConfig, primaryColor: e.target.value})} className="w-full h-12 rounded cursor-pointer" />
                    </div>
                  </div>
                )}
                <button onClick={handleSaveCertificate} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Save Designer Settings</button>
              </div>

              {/* Precise Preview */}
              <div className="sticky top-8 bg-slate-800 rounded-3xl p-6 overflow-hidden shadow-2xl flex flex-col items-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">Precision Placement Preview</p>
                <div className="w-full aspect-[1120/792] bg-white relative overflow-hidden ring-4 ring-white/10">
                  {certConfig.useCustomTemplate ? (
                    <>
                      {certConfig.templateImage && <img src={certConfig.templateImage} className="absolute inset-0 w-full h-full object-cover" />}
                      <div 
                        className={`absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap ${getPreviewFontStyle()}`} 
                        style={{ 
                          left: `${certConfig.nameXPos}%`, 
                          top: `${certConfig.nameYPos}%`, 
                          fontSize: `${certConfig.nameFontSize / 4}px`,
                          color: certConfig.nameColor
                        }}
                      >
                        Sample Student Name
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full p-4 border-8 flex flex-col items-center justify-center" style={{ borderColor: certConfig.primaryColor }}>
                       <h1 className="text-xl font-serif font-black" style={{ color: certConfig.primaryColor }}>{certConfig.title}</h1>
                       <span className="font-certificate text-2xl text-slate-800">Student Name</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-[10px] text-slate-500 font-medium text-center">
                  Drag the sliders to align the name exactly onto the blank line of your certificate.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
