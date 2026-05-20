'use client';

import React from 'react';
import { PredictionResult } from '@/lib/predictor';

interface ResultCardProps {
  result: PredictionResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const isGovt = result.isGovt;
  
  const getBadgeColors = () => {
    switch (result.display) {
      case 'SAFE': return 'text-tertiary-container bg-tertiary-fixed';
      case 'POSSIBLE': return 'text-on-secondary-fixed-variant bg-secondary-fixed';
      case 'DREAM': return 'text-on-error-container bg-error-container';
      default: return 'text-on-surface-variant bg-surface-variant';
    }
  };

  const getBadgeIcon = () => {
    switch (result.display) {
      case 'SAFE': return 'check_circle';
      case 'POSSIBLE': return 'thumb_up';
      case 'DREAM': return 'casino';
      default: return 'info';
    }
  };

  const getTrendIcon = () => {
    const t = result.trendLabel.toLowerCase();
    if (t.includes('dropped')) return 'trending_down';
    if (t.includes('increased')) return 'trending_up';
    return 'equal';
  };

  const getTrendColor = () => {
    const t = result.trendLabel.toLowerCase();
    if (t.includes('dropped')) return 'text-primary-container';
    if (t.includes('increased')) return 'text-error';
    return 'text-secondary';
  };

  return (
    <article className={`bg-surface-container-lowest rounded-xl p-6 shadow-[0_20px_40px_rgba(27,27,33,0.06)] flex flex-col gap-5 transition-all hover:shadow-lg ${isGovt ? 'border-2 border-primary/30 bg-primary-container/5' : 'border border-outline-variant/15'}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1 flex-1">
          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mb-1">
            <span className={`font-label text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${getBadgeColors()}`}>
              <span className="material-symbols-outlined text-[14px]">{getBadgeIcon()}</span> 
              {result.displayLabel}
            </span>
            {isGovt && (
              <span className="font-label text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                🏛️ Government
              </span>
            )}
            {result.isPreferredDistrict && (
              <span className="font-label text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                📍 Your District
              </span>
            )}
          </div>
          <h4 className="font-headline font-bold text-xl text-on-surface mt-1 leading-tight">
            {result.college}
          </h4>
          <p className="font-body text-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">location_on</span> 
            {result.district ? result.district.charAt(0).toUpperCase() + result.district.slice(1) : ''} • Code: {result.college_code}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-surface-container-low rounded-lg p-3">
        <div className="flex-1 flex flex-col border-r border-outline-variant/30 pr-4">
          <span className="font-label text-[10px] uppercase font-bold text-on-surface-variant">Type</span>
          <span className={`font-body font-semibold ${isGovt ? 'text-primary' : 'text-on-surface'}`}>
            {isGovt ? 'Government' : 'Private'}
          </span>
        </div>
        <div className="flex-1 flex flex-col border-r border-outline-variant/30 pr-4">
          <span className="font-label text-[10px] uppercase font-bold text-on-surface-variant">2025 Cutoff</span>
          <span className="font-body font-semibold text-on-surface">{result.cutoff_2025 ?? 'N/A'}</span>
        </div>
        <div className="flex-1 flex flex-col pl-2">
          <span className="font-label text-[10px] uppercase font-bold text-on-surface-variant">Total Seats</span>
          <span className="font-body font-semibold text-on-surface">{result.total_seats ?? 'N/A'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`material-symbols-outlined text-[20px] ${getTrendColor()}`}>
          {getTrendIcon()}
        </span>
        <div className="font-body text-sm text-on-surface">
          <span className={`font-semibold ${getTrendColor()}`}>{result.explanation}</span>. {result.trendLabel}.
          {result.microGuidance && (
             <p className="text-[11px] text-outline font-medium mt-1 uppercase tracking-wider">{result.microGuidance}</p>
          )}
        </div>
      </div>
    </article>
  );
};
