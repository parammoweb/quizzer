
import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674a1 1 0 00.707-.293l4.816-4.816A1 1 0 0019.561 10H14a1 1 0 01-1-1V4.439a1 1 0 00-1.707-.707l-4.816 4.816A1 1 0 006 8v7a1 1 0 001 1h2.663z" />
          </svg>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Generating Your Quiz</h2>
        <p className="text-slate-500 max-w-xs mx-auto mt-2">
          Our AI is hand-crafting 25 unique questions just for your grade level...
        </p>
      </div>
      <div className="flex gap-2">
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></span>
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></span>
      </div>
    </div>
  );
};
