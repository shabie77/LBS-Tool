'use client';

import React, { useState, useEffect } from 'react';

const STEPS = [
  "Analyzing 160+ colleges...",
  "Checking your quota trends...",
  "Finding best colleges for your score..."
];

export const Loader: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-surface">
      {/* Ambient Background Layering */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[150vw] h-[150vw] sm:w-[800px] sm:h-[800px] rounded-full bg-gradient-to-br from-primary-container/5 to-transparent blur-[80px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-md px-6 py-12 flex flex-col items-center justify-center">
        {/* The "Probability Orbit" Loader Concept */}
        <div className="relative w-40 h-40 mb-16 flex items-center justify-center">
          {/* Background Ghost Track */}
          <svg className="absolute inset-0 w-full h-full text-surface-variant" viewBox="0 0 100 100">
            <circle cx="50" cy="50" fill="none" r="46" stroke="currentColor" strokeWidth="2"></circle>
          </svg>
          
          {/* Foreground Active Track (Animated based on step) */}
          <svg className="absolute inset-0 w-full h-full text-secondary-container transform -rotate-90 transition-all duration-1000" viewBox="0 0 100 100">
            <circle 
              className="drop-shadow-sm transition-all duration-1000" 
              cx="50" cy="50" fill="none" r="46" 
              stroke="currentColor" 
              strokeDasharray="289" 
              strokeDashoffset={289 - (289 * (activeStep + 1) / 3)} 
              strokeLinecap="round" strokeWidth="4">
            </circle>
          </svg>

          {/* Central Jewel */}
          <div className="w-24 h-24 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(27,27,33,0.06)] border border-outline-variant/15 relative z-10">
            <span className="material-symbols-outlined text-4xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              query_stats
            </span>
          </div>

          {/* Subtle pulsing aura behind jewel */}
          <div className="absolute inset-0 rounded-full shadow-[0_0_60px_rgba(26,35,126,0.1)] -z-10 animate-pulse"></div>
        </div>

        {/* Sequential Messages Deck */}
        <div className="w-full flex flex-col space-y-6">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeStep;
            const isActive = idx === activeStep;
            const isPending = idx > activeStep;

            if (isActive) {
              return (
                <div key={idx} className="flex items-center space-x-5 w-full bg-surface-container-lowest px-6 py-5 rounded-2xl shadow-[0_20px_40px_rgba(27,27,33,0.06)] border border-outline-variant/15 relative overflow-hidden transition-all duration-500">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container"></div>
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-secondary-container/20 flex items-center justify-center relative">
                    <div className="w-2 h-2 rounded-full bg-secondary-container"></div>
                    <div className="absolute inset-0 rounded-full border border-secondary-container/30 scale-150 animate-ping"></div>
                  </div>
                  <h2 className="font-headline text-xl font-bold text-primary-container tracking-tight">{step}</h2>
                </div>
              );
            }

            return (
              <div key={idx} className={`flex items-center space-x-5 w-full px-4 transition-all duration-500 ${isCompleted ? 'opacity-40' : 'opacity-20'}`}>
                <div className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center ${isCompleted ? 'bg-surface-variant' : 'border border-outline-variant/50'}`}>
                  {isCompleted && <span className="material-symbols-outlined text-[14px] text-on-surface-variant font-bold">check</span>}
                </div>
                <p className="font-body text-base font-medium text-on-surface-variant tracking-wide">{step}</p>
              </div>
            );
          })}
        </div>

        {/* Footnote / Reassurance */}
        <div className="mt-20 text-center">
          <p className="font-label text-sm text-outline tracking-wider uppercase font-semibold">Distilling Authority</p>
        </div>
      </main>
    </div>
  );
};
