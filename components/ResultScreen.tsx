
import React, { useRef } from 'react';
import { UserProfile } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultScreenProps {
  score: number;
  total: number;
  profile: UserProfile;
  onReset: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, total, profile, onReset }) => {
  const percentage = Math.round((score / total) * 100);
  const certificateRef = useRef<HTMLDivElement>(null);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { title: "Outstanding!", desc: "You're a genius! Perfect score territory.", icon: "🏆", color: "text-yellow-600" };
    if (percentage >= 70) return { title: "Great Job!", desc: "You have a solid understanding of the material.", icon: "🌟", color: "text-blue-600" };
    if (percentage >= 50) return { title: "Good Effort!", desc: "You passed! Keep practicing to improve.", icon: "👍", color: "text-green-600" };
    return { title: "Keep Learning!", desc: "Every master was once a beginner. Try again!", icon: "📚", color: "text-orange-600" };
  };

  const performance = getPerformanceMessage();

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    
    // Temporarily show the hidden certificate
    const element = certificateRef.current;
    element.style.display = 'block';
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate_${profile.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
    } finally {
      element.style.display = 'none';
    }
  };

  return (
    <div className="p-8 flex flex-col flex-1 items-center justify-center text-center">
      <div className="text-6xl mb-4">{performance.icon}</div>
      <h2 className={`text-3xl font-bold mb-2 ${performance.color}`}>{performance.title}</h2>
      <p className="text-slate-500 mb-8 max-w-sm">{performance.desc}</p>

      <div className="w-full grid grid-cols-2 gap-4 mb-10">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Score</div>
          <div className="text-3xl font-black text-slate-800">{score} <span className="text-lg font-normal text-slate-400">/ {total}</span></div>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Accuracy</div>
          <div className="text-3xl font-black text-slate-800">{percentage}%</div>
        </div>
      </div>

      <div className="space-y-3 w-full max-w-xs">
        <button
          onClick={downloadCertificate}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Certificate
        </button>
        <button
          onClick={onReset}
          className="w-full bg-white text-slate-600 py-4 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all"
        >
          Take Another Quiz
        </button>
      </div>

      {/* Hidden Certificate Template */}
      <div 
        ref={certificateRef} 
        style={{ display: 'none', position: 'absolute', top: '-9999px', left: '-9999px', width: '1120px', height: '792px' }}
      >
        <div className="w-full h-full bg-white border-[20px] border-blue-900 p-2 relative flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Border Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600 opacity-10 rounded-br-full"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600 opacity-10 rounded-tl-full"></div>
          
          <div className="border-[2px] border-blue-200 w-full h-full p-12 flex flex-col items-center justify-center relative">
            <h1 className="text-6xl font-serif font-black text-blue-900 mb-2">CERTIFICATE</h1>
            <h2 className="text-2xl font-bold text-slate-600 uppercase tracking-[0.4em] mb-12">Of Achievement</h2>
            
            <p className="text-xl text-slate-500 mb-4">This is proudly presented to</p>
            <div className="w-full max-w-2xl border-b-2 border-blue-900 mb-8 py-2">
              <span className="font-certificate text-8xl text-blue-800">{profile.name}</span>
            </div>
            
            <p className="text-xl text-slate-600 max-w-xl mb-16 leading-relaxed">
              For successfully completing the <span className="font-bold text-blue-900">Smart-Quiz AI assessment</span> for 
              <span className="font-bold text-blue-900"> {profile.grade} </span> with a score of 
              <span className="font-bold text-blue-900"> {score} out of {total} </span> ({percentage}%) on this day.
            </p>
            
            <div className="w-full flex justify-around mt-8">
              <div className="flex flex-col items-center">
                <div className="w-48 border-b border-slate-400 mb-2"></div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">School Director</p>
              </div>
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-12 opacity-30">
                  <svg className="w-24 h-24 text-blue-900" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                    <circle cx="50" cy="50" r="35" fill="currentColor" />
                  </svg>
                </div>
                <div className="w-48 border-b border-slate-400 mb-2"></div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">AI Examination Body</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
