// src/lib/predictor.ts
// v3.0 — Smart Composition: District-preferred colleges first, then best govt + quality picks

export type CutoffRow = {
  college: string;
  college_code: string;
  district: string;
  college_type: string;
  quota: string;
  cutoff_2024: number | null;
  cutoff_2025: number | null;
  safe_cutoff_2024: number | null;
  safe_cutoff_2025: number | null;
  trend: string | null;
  total_seats: number | null;
};

export type PredictionResult = CutoffRow & {
  buffer: number;
  score: number;
  display: 'SAFE' | 'POSSIBLE' | 'DREAM';
  displayLabel: string;
  explanation: string;
  trendLabel: string;
  microGuidance?: string;
  isPreferredDistrict: boolean;
  isGovt: boolean;
};

export function runPrediction(
  data: CutoffRow[],
  userMark: number,
  selectedDistricts: string[] = []
): { results: PredictionResult[]; totalMatches: number } {

  const normalizedSelected = selectedDistricts.map(d => d.toLowerCase());
  const hasDistrictPref = normalizedSelected.length > 0;

  // ── Step 1: Evaluate ALL colleges (no hard district filter) ──────────────
  const evaluated: PredictionResult[] = [];

  for (const row of data) {
    const cutoff = row.cutoff_2025 ?? row.safe_cutoff_2025;
    if (!cutoff) continue;

    const buffer = userMark - cutoff;

    const name = (row.college || '').toLowerCase();
    const isGovt = name.includes('govt') || name.includes('government');

    // We do NOT filter out any colleges here. We keep them all so we can pad the 5 slots with the "nearest" colleges.

    // Classification
    let display: 'SAFE' | 'POSSIBLE' | 'DREAM';
    if (buffer >= 8)       display = 'SAFE';
    else if (buffer >= -5) display = 'POSSIBLE';
    else                   display = 'DREAM';

    const collegeDistrict = (row.district || '').toLowerCase();
    const isPreferredDistrict = hasDistrictPref && normalizedSelected.includes(collegeDistrict);

    // Base score: Dynamic Quality
    // We value high cutoffs, but apply a massive penalty if the student is below the cutoff
    let score = cutoff * 3;
    if (buffer < 0) {
      score += buffer * 10; // Massive penalty for negative buffer
    } else {
      score += Math.min(buffer, 15) * 2; // Small bonus for safety, capped at +15
    }
    if (isGovt) score += 100;
    if (row.total_seats) score += Math.min(row.total_seats, 50);
    if (display === 'DREAM') score -= 30;

    evaluated.push({
      ...row,
      buffer,
      score,
      display,
      isGovt,
      isPreferredDistrict,
      displayLabel: display === 'SAFE'     ? 'Very Safe'   :
                    display === 'POSSIBLE' ? 'Good Chance' : 'Try Your Luck',
      explanation:   generateExplanation(buffer, display, isGovt),
      trendLabel:    getHumanTrend(row.trend || ''),
      microGuidance: getMicroGuidance(row, display, isGovt),
    });
  }

  // Sort by score
  evaluated.sort((a, b) => b.score - a.score);

  // Deduplicate helper
  const used = new Set<string>();
  function pickUnique(list: PredictionResult[]): PredictionResult | undefined {
    for (const item of list) {
      if (!used.has(item.college_code)) {
        used.add(item.college_code);
        return item;
      }
    }
    return undefined;
  }

  // ── Step 2: Smart Composition (Max 5 Slots) ──────────────────────────────
  // Strategy:
  //   Slot 1 : Best Govt college from anywhere (ALWAYS FIRST)
  //   Slots 2-3 : Top Private (or second Govt) colleges from preferred district
  //   Slots 4-5 : Top overall Private colleges

  const final: PredictionResult[] = [];
  let govtCount = 0;

  // -- 1. Force Top Govt College to be FIRST --
  const govtList = evaluated
    .filter(e => e.isGovt)
    .sort((a, b) => (b.cutoff_2025 ?? 0) - (a.cutoff_2025 ?? 0));
  
  // Prioritize a govt college from their district if possible, else best overall
  const localGovt = govtList.find(e => e.isPreferredDistrict);
  const bestGovt = localGovt || govtList[0];

  if (bestGovt && !used.has(bestGovt.college_code)) {
    used.add(bestGovt.college_code);
    final.push(bestGovt);
    govtCount++;
  }

  // -- 2. District picks (Slots 2-3) --
  if (hasDistrictPref) {
    const districtList = evaluated
      .filter(e => e.isPreferredDistrict)
      .sort((a, b) => (b.cutoff_2025 ?? 0) - (a.cutoff_2025 ?? 0));

    let addedDistrict = 0;
    for (const d of districtList) {
      if (addedDistrict >= 2) break;
      if (!used.has(d.college_code)) {
        if (d.isGovt && govtCount >= 2) continue; // Max 2 Govt colleges total
        if (!d.isGovt && d.buffer < -10) continue; // NEW RULE: Only force local private colleges if they are realistic (within 10 marks)
        
        used.add(d.college_code);
        final.push(d);
        addedDistrict++;
        if (d.isGovt) govtCount++;
      }
    }
  }

  // -- 3. Fill remaining up to 5 with Best Private Colleges --
  const privateList = evaluated
    .filter(e => !e.isGovt)
    .sort((a, b) => b.score - a.score); // Sort by our new dynamic quality score
    
  for (const p of privateList) {
    if (final.length >= 5) break;
    if (!used.has(p.college_code)) {
      used.add(p.college_code);
      final.push(p);
    }
  }

  // -- 4. Fallback (if we still don't have 5) --
  for (const item of evaluated) {
    if (final.length >= 5) break;
    if (!used.has(item.college_code)) {
      used.add(item.college_code);
      final.push(item);
    }
  }

  // Count realistic matches (exclude Govt colleges added only for hook if buffer < -10)
  const realisticTotal = evaluated.filter(e => e.buffer >= -10).length;

  return {
    results: final,
    totalMatches: realisticTotal, // True number of colleges student mathematically qualifies for
  };
}

// ────────────────────────────────────────────────────────────────────────────

function getHumanTrend(trend: string): string {
  const t = trend?.toLowerCase() || '';
  if (t.includes('dropped')   || t.includes('falling'))  return 'Cutoff dropped';
  if (t.includes('increased') || t.includes('rising'))   return 'Cutoff increased';
  return 'Stable trend';
}

function getMicroGuidance(row: CutoffRow, display: string, isGovt: boolean): string {
  if (isGovt && display === 'SAFE')     return 'Top government seat – strong chance';
  if (isGovt && display === 'POSSIBLE') return 'Government college – good chance if ranked well';
  if (isGovt)                           return 'Your index mark is low, you may have a chance in later allotments';
  if (display === 'SAFE')               return 'Safe option for guaranteed admission';
  if (display === 'POSSIBLE')           return 'Backup option with potential';
  return 'Try your luck – possible in later rounds';
}

function generateExplanation(buffer: number, display: string, isGovt: boolean): string {
  if (isGovt) {
    if (display === 'SAFE')     return 'Government seat within reach. High priority choice.';
    if (display === 'POSSIBLE') return 'Government college – good chance if ranked well.';
    return 'Dream government college – possible in later rounds.';
  }
  if (display === 'SAFE') return 'Strong chance of admission.';
  if (display === 'POSSIBLE') return 'Good chance if ranked well.';
  return 'Try your luck – possible in later rounds.';
}
