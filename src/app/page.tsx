'use client';

import React, { useState } from 'react';
import { InputForm } from '@/components/InputForm';
import { ResultCard } from '@/components/ResultCard';
import { Loader } from '@/components/Loader';
import { PredictionResult } from '@/lib/predictor';

interface ApiResponse {
  results: PredictionResult[];
  hasDream: boolean;
  topResult: PredictionResult | null;
  totalColleges: number;
  dataQuality: string;
  quota: string;
  indexMark: number;
  message?: string;
}

type ViewState = 'INPUT' | 'LOADING' | 'RESULTS';

export default function Home() {
  const [view, setView] = useState<ViewState>('INPUT');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (mark: number, quota: string, districts: string[]) => {
    setView('LOADING');
    setError(null);
    
    // Simulate loader time for premium feel
    const startTime = Date.now();

    try {
      const resp = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indexMark: mark, quota, districts })
      });
      
      const result = await resp.json();
      
      if (!resp.ok) {
        throw new Error(result.error || 'Prediction failed');
      }

      // Ensure loader shows for at least 4.5s (1.5s per step)
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 4600 - elapsed);
      
      setTimeout(() => {
        setData(result);
        setView('RESULTS');
      }, delay);

    } catch (err: any) {
      setError(err.message);
      setView('INPUT');
    }
  };

  const getWhatsAppLink = () => {
    if (!data) return '';
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918943644502';
    const message = `Hi Career Dreamz, I scored ${data.indexMark} marks (${data.quota} quota). I saw my Top matches like ${data.topResult?.college}. I want to unlock the full list and get your expert guidance for my BSc Nursing admission!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  if (view === 'LOADING') return <Loader />;

  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen flex flex-col items-center">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-40 bg-surface-container-low shadow-sm">
        <div className="flex items-center justify-between px-6 h-16 w-full max-w-md mx-auto">
          <button 
            onClick={() => { setView('INPUT'); setData(null); }}
            className="text-primary-container hover:bg-surface-variant transition-all rounded-full p-2 flex items-center justify-center active:scale-95"
          >
            <span className="material-symbols-outlined text-2xl">
              {view === 'RESULTS' ? 'arrow_back' : 'home'}
            </span>
          </button>
          <h1 className="font-headline font-bold text-lg tracking-tight text-primary-container font-black tracking-tighter">
            Nursing Predictor
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto flex-1 pb-32 px-6 pt-8 flex flex-col gap-8">
        
        {view === 'INPUT' ? (
          <>
            <div className="mb-4 relative z-10">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
              <h2 className="font-headline text-[32px] leading-[1.2] font-semibold text-on-surface tracking-tight mb-4">
                Find The Right Colleges For Your Marks
              </h2>
              <p className="font-body text-on-surface-variant text-base leading-relaxed">
                Get accurate college predictions based on real LBS allotment data
              </p>
            </div>

            <InputForm onPredict={handlePredict} isLoading={false} />

            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-semibold border border-error/20">
                {error}
              </div>
            )}
          </>
        ) : data && (
          <>
            {/* Hero Summary Section */}
            <section className="bg-surface-container-low rounded-xl p-8 relative overflow-hidden flex flex-col gap-4">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container rounded-full opacity-5 blur-3xl"></div>
              <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-secondary-container rounded-full opacity-10 blur-3xl"></div>
              <div className="relative z-10 flex flex-col gap-2">
                <h2 className="font-headline font-extrabold text-4xl text-primary-container leading-tight">
                  You have chances in <br/>
                  <span className="text-secondary">{data.totalColleges} colleges</span>
                </h2>
              <p className="font-body text-lg text-on-surface-variant">
                  {data.results.some((r) => r.isGovt) 
                    ? '🏛️ Government colleges are within your reach.' 
                    : 'Private college matches found for your score.'}
                </p>
              </div>
              <div className="relative z-10 mt-2 bg-surface-container-highest rounded-lg p-4 flex items-start gap-4">
                <span className="material-symbols-outlined text-primary-container mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                <div className="flex flex-col">
                  <p className="font-body text-sm font-medium text-on-surface">
                    Showing available matches for your score.
                  </p>
                  <a 
                    href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                    className="text-primary-container font-semibold text-sm mt-1 text-left hover:text-primary transition-colors flex items-center gap-1 w-fit"
                  >
                    Unlock full analysis <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </a>
                </div>
              </div>
            </section>

            {/* Results List Section */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-headline font-bold text-xl text-on-surface">Top Matches</h3>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Sorted by chance</span>
              </div>

              <div className="flex flex-col gap-6">
                {data.results.map((res) => <ResultCard key={res.college_code} result={res} />)}
              </div>
            </section>

              {/* Final Conversion Section */}
              <div className="mt-4 p-8 bg-primary-container rounded-[2rem] text-center text-on-primary">
                <span className="material-symbols-outlined text-4xl mb-4 text-secondary-container">workspace_premium</span>
                <h3 className="font-headline font-bold text-2xl mb-2">Unlock Full Guidance</h3>
                <p className="font-body text-sm opacity-90 mb-8">
                  Get the exact option order to avoid mistakes in your LBS allotment.
                </p>
                <a 
                  href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                  className="block w-full bg-secondary-container text-on-secondary-container font-headline font-bold py-5 rounded-full shadow-xl active:scale-95 transition-all"
                >
                  Unlock Full List →
                </a>
              </div>
            </>
          )}
        </main>

        {/* BottomNavBar */}
        <nav className="fixed bottom-0 w-full rounded-t-[3rem] border-none bg-background/80 backdrop-blur-xl shadow-2xl z-50 max-w-md mx-auto left-1/2 -translate-x-1/2">
          <div className="flex justify-around items-center px-4 pb-6 pt-3">
            <button 
              onClick={() => { setView('INPUT'); setData(null); }}
              className={`flex flex-col items-center justify-center rounded-full px-4 py-1 transition-all ${view === 'INPUT' ? 'text-primary-container bg-secondary-container/20' : 'text-outline hover:text-primary-container'}`}
            >
              <span className="material-symbols-outlined text-2xl" style={view === 'INPUT' ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
              <span className="font-label text-[11px] font-semibold tracking-wider uppercase mt-1">Home</span>
            </button>
            <a href="#" className="flex flex-col items-center justify-center text-outline hover:text-primary-container transition-all">
              <span className="material-symbols-outlined text-2xl">history</span>
              <span className="font-label text-[11px] font-semibold tracking-wider uppercase mt-1">History</span>
            </a>
            <button 
              onClick={() => { if(data) setView('RESULTS'); }}
              className={`flex flex-col items-center justify-center rounded-full px-4 py-1 transition-all ${view === 'RESULTS' ? 'text-primary-container bg-secondary-container/20' : 'text-outline hover:text-primary-container'}`}
            >
              <span className="material-symbols-outlined text-2xl" style={view === 'RESULTS' ? { fontVariationSettings: "'FILL' 1" } : {}}>school</span>
              <span className="font-label text-[11px] font-semibold tracking-wider uppercase mt-1">Colleges</span>
            </button>
            <a href="#" className="flex flex-col items-center justify-center text-outline hover:text-primary-container transition-all">
              <span className="material-symbols-outlined text-2xl">person</span>
              <span className="font-label text-[11px] font-semibold tracking-wider uppercase mt-1">Profile</span>
            </a>
          </div>
        </nav>
      </div>
  );
}
