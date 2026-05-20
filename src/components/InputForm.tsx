'use client';

import React, { useState } from 'react';

const QUOTAS = [
  { id: 'SM', label: 'State Merit' },
  { id: 'EZ', label: 'Ezhava' },
  { id: 'MU', label: 'Muslim' },
  { id: 'SC', label: 'Scheduled Caste' },
  { id: 'ST', label: 'Scheduled Tribe' },
  { id: 'LC', label: 'Latin Catholic' },
  { id: 'OBH', 'label': 'Other Backward Hindu' },
  { id: 'OBC', 'label': 'Other Backward Christian' },
  { id: 'EWS', 'label': 'EWS' },
  { id: 'KU', 'label': 'Kudumbi' },
  { id: 'DV', 'label': 'Dheevara' },
  { id: 'VK', 'label': 'Viswakarma' },
  { id: 'BH', 'label': 'Boarding Hindu' },
  { id: 'BX', 'label': 'Boarding Christian' },
  { id: 'KN', 'label': 'Kerala Nadar' }
];

const DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", 
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", 
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

interface InputFormProps {
  onPredict: (mark: number, quota: string, districts: string[]) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onPredict, isLoading }) => {
  const [method, setMethod] = useState<'direct' | 'pcb'>('direct');
  const [mark, setMark] = useState<string>('');
  const [quota, setQuota] = useState<string>('');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  
  // PCB State
  const [p, setP] = useState<string>('');
  const [c, setC] = useState<string>('');
  const [b, setB] = useState<string>('');

  const calculatedIndex = (parseFloat(p) || 0) + (parseFloat(c) || 0) + (parseFloat(b) || 0);

  const toggleDistrict = (dist: string) => {
    if (selectedDistricts.includes(dist)) {
      setSelectedDistricts(prev => prev.filter(d => d !== dist));
    } else if (selectedDistricts.length < 3) {
      setSelectedDistricts(prev => [...prev, dist]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    const finalMark = method === 'direct' ? parseFloat(mark) : calculatedIndex;
    if (!finalMark || !quota) return;

    onPredict(finalMark, quota, selectedDistricts);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {/* Field: Index Mark Input Toggle */}
      <div className="flex flex-col gap-5">
        <label className="font-label text-sm text-on-surface-variant font-semibold tracking-wider uppercase ml-2">Your Marks</label>
        
        {/* Toggle Buttons */}
        <div className="flex bg-surface-container rounded-xl p-1 mb-2">
          <button 
            type="button"
            onClick={() => setMethod('direct')}
            className={`flex-1 py-3 rounded-lg font-body text-sm font-medium transition-all duration-300 ${
              method === 'direct' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant'
            }`}
          >
            Enter Index Mark
          </button>
          <button 
            type="button"
            onClick={() => setMethod('pcb')}
            className={`flex-1 py-3 rounded-lg font-body text-sm font-medium transition-all duration-300 ${
              method === 'pcb' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant'
            }`}
          >
            Calculate from PCB
          </button>
        </div>

        {method === 'direct' ? (
          <div className="relative group">
            <input 
              type="number"
              step="0.01"
              value={mark}
              onChange={(e) => setMark(e.target.value)}
              placeholder="e.g. 280 (max 300)"
              className="w-full bg-surface-container-low text-on-surface font-headline font-semibold text-2xl px-6 py-5 rounded-xl border-none outline-none placeholder:text-outline-variant placeholder:font-medium focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-fixed-dim transition-all duration-300"
            />
            <p className="text-xs text-outline font-medium mt-2 ml-2">Enter your index mark (0–300)</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="font-label text-xs text-on-surface-variant font-medium ml-2">Physics</label>
                <input 
                  type="number" value={p} onChange={(e) => setP(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-headline font-semibold text-lg px-4 py-4 rounded-xl border-none outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-fixed-dim" 
                  placeholder="0" 
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="font-label text-xs text-on-surface-variant font-medium ml-2">Chemistry</label>
                <input 
                  type="number" value={c} onChange={(e) => setC(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-headline font-semibold text-lg px-4 py-4 rounded-xl border-none outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-fixed-dim" 
                  placeholder="0" 
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="font-label text-xs text-on-surface-variant font-medium ml-2">Biology</label>
                <input 
                  type="number" value={b} onChange={(e) => setB(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-headline font-semibold text-lg px-4 py-4 rounded-xl border-none outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-fixed-dim" 
                  placeholder="0" 
                />
              </div>
            </div>
            <div className="mt-2 bg-primary-container/10 border border-primary-container/20 rounded-xl p-4 flex justify-between items-center">
              <span className="font-body text-sm font-medium text-primary">Calculated Index:</span>
              <span className="font-headline font-semibold text-xl text-primary">{calculatedIndex.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Field: Quota Selection */}
      <div className="flex flex-col gap-3">
        <label className="font-label text-sm text-on-surface-variant font-semibold tracking-wider uppercase ml-2">Your Category</label>
        <div className="relative">
          <select 
            value={quota}
            onChange={(e) => setQuota(e.target.value)}
            className="w-full appearance-none bg-surface-container-low text-on-surface font-body text-lg px-6 py-5 rounded-xl border-none outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-fixed-dim transition-all duration-300"
          >
            <option value="" disabled>Select your category</option>
            {QUOTAS.map(q => <option key={q.id} value={q.id}>{q.id} – {q.label}</option>)}
          </select>
          <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
        </div>
      </div>

      {/* Field: Preferred Districts */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end ml-2 mr-2">
          <label className="font-label text-sm text-on-surface-variant font-semibold tracking-wider uppercase">Preferred Districts</label>
          <span className="font-label text-xs text-outline font-medium">Max 3</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {DISTRICTS.map(dist => {
            const isSelected = selectedDistricts.includes(dist);
            return (
              <button 
                key={dist}
                type="button"
                onClick={() => toggleDistrict(dist)}
                className={`flex items-center gap-1 font-body text-sm font-medium px-5 py-3 rounded-full transition-all duration-300 active:scale-95 ${
                  isSelected ? 'bg-primary-container text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                {dist}
                {isSelected && <span className="material-symbols-outlined text-[16px]">close</span>}
              </button>
            );
          })}
        </div>
      </div>

      <button 
        type="submit"
        disabled={isLoading || (!mark && method === 'direct') || (calculatedIndex === 0 && method === 'pcb') || !quota}
        className="group relative w-full rounded-full overflow-hidden shadow-[0_20px_40px_rgba(27,27,33,0.06)] transition-all duration-300 active:scale-95 disabled:opacity-50"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container z-0"></div>
        <div className="relative z-10 flex items-center justify-center gap-3 w-full px-8 py-5">
          <span className="font-headline font-semibold text-[18px] text-secondary-container tracking-wide">
            {isLoading ? 'ANALYZING...' : 'Show My Colleges →'}
          </span>
        </div>
      </button>
    </form>
  );
};
