
import React, { useRef } from 'react';
import { UserProfile, CertificateConfig } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultScreenProps {
  score: number;
  total: number;
  profile: UserProfile;
  onReset: () => void;
  certConfig: CertificateConfig;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, total, profile, onReset, certConfig }) => {
  const percentage = Math.round((score / total) * 100);
  const certificateRef = useRef<HTMLDivElement>(null);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { title: "Outstanding!", desc: "You're a genius! Perfect score territory.", icon: "🏆", color: "text-yellow-600" };
    if (percentage >= 70) return { title: "Great Job!", desc: "You have a solid understanding of the material.", icon: "🌟", color: "text-blue-600" };
    if (percentage >= 50) return { title: "Good Effort!", desc: "You passed! Keep practicing to improve.", icon: "👍", color: "text-green-600" };
    return { title: "Keep Learning!", desc: "Every master was once a beginner. Try again!", icon: "📚", color: "text-orange-600" };
  };

  const performance = getPerformanceMessage();

  const getFontStyle = () => {
    switch (certConfig.nameFontFamily) {
      case 'EB Garamond': return 'font-formal';
      case 'Dancing Script': return 'font-script';
      case 'Plus Jakarta Sans': return 'font-modern';
      default: return 'font-certificate';
    }
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    const element = certificateRef.current;
    element.style.display = 'block';
    try {
      const canvas = await html2canvas(element, {
        scale: 4, // Ultra high scale for crisp PDF text
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        imageTimeout: 0
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
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
        <button onClick={downloadCertificate} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2">Download Certificate</button>
        <button onClick={onReset} className="w-full bg-white text-slate-600 py-4 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all">Take Another Quiz</button>
      </div>

      {/* High-Resolution Hidden Certificate Container */}
      <div ref={certificateRef} style={{ display: 'none', position: 'absolute', top: '-9999px', left: '-9999px', width: '1120px', height: '792px' }}>
        {certConfig.useCustomTemplate && certConfig.templateImage ? (
          <div className="w-full h-full relative bg-white">
            <img src={certConfig.templateImage} className="absolute inset-0 w-full h-full object-cover" />
            <div 
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap ${getFontStyle()}`} 
              style={{ 
                left: `${certConfig.nameXPos}%`, 
                top: `${certConfig.nameYPos}%`,
                fontSize: `${certConfig.nameFontSize}px`,
                color: certConfig.nameColor
              }}
            >
              {profile.name}
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-white border-[20px] p-2 relative flex flex-col items-center justify-center text-center overflow-hidden" style={{ borderColor: certConfig.primaryColor }}>
            <div className="absolute top-0 left-0 w-32 h-32 opacity-10 rounded-br-full" style={{ backgroundColor: certConfig.primaryColor }}></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10 rounded-tl-full" style={{ backgroundColor: certConfig.primaryColor }}></div>
            <div className="border-[2px] w-full h-full p-12 flex flex-col items-center justify-center relative" style={{ borderColor: `${certConfig.primaryColor}33` }}>
              <h1 className="text-6xl font-serif font-black mb-2" style={{ color: certConfig.primaryColor }}>{certConfig.title}</h1>
              <h2 className="text-2xl font-bold text-slate-600 uppercase tracking-[0.4em] mb-12">{certConfig.subTitle}</h2>
              <p className="text-xl text-slate-500 mb-4">This is proudly presented to</p>
              <div className="w-full max-w-2xl border-b-2 mb-8 py-2" style={{ borderColor: certConfig.primaryColor }}>
                <span className="font-certificate text-8xl" style={{ color: certConfig.primaryColor }}>{profile.name}</span>
              </div>
              <p className="text-xl text-slate-600 max-w-xl mb-16 leading-relaxed">
                For successfully completing the assessment for <span className="font-bold">{profile.grade}</span>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
