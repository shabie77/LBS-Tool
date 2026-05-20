import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { runPrediction, CutoffRow } from '@/lib/predictor';

const VALID_QUOTAS = [
  'SM', 'EZ', 'MU', 'SC', 'ST', 'LC', 'OBH', 'OBC',
  'EWS', 'KU', 'DV', 'VK', 'BH', 'BX', 'KN'
];

export async function POST(request: Request) {
  try {
    // ----------------------------
    // 1. Safe JSON Parsing
    // ----------------------------
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    const parsedMark = Number(body.indexMark);
    const normalizedQuota = body.quota?.toUpperCase();

    const selectedDistricts = Array.isArray(body.districts)
      ? body.districts.map((d: string) => d.toLowerCase())
      : [];

    // ----------------------------
    // 2. Validation
    // ----------------------------
    if (!normalizedQuota) {
      return NextResponse.json(
        { error: 'Quota selection is required.' },
        { status: 400 }
      );
    }

    if (isNaN(parsedMark) || parsedMark < 10 || parsedMark > 300) {
      return NextResponse.json(
        { error: 'Invalid Index Mark. Must be between 10 and 300.' },
        { status: 400 }
      );
    }

    if (!VALID_QUOTAS.includes(normalizedQuota)) {
      return NextResponse.json(
        { error: 'Invalid Quota selected.' },
        { status: 400 }
      );
    }

    // ----------------------------
    // 3. Fetch Data from Supabase
    // ----------------------------
    const { data, error } = await supabase
      .from('lbs_cutoffs')
      .select(`
        college,
        college_code,
        district,
        college_type,
        quota,
        cutoff_2024,
        cutoff_2025,
        safe_cutoff_2024,
        safe_cutoff_2025,
        trend,
        total_seats
      `)
      .eq('quota', normalizedQuota);

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json({
        results: [],
        totalColleges: 0,
        message: "No data found for this category."
      });
    }

    // ----------------------------
    // 4. Run Prediction Engine
    // ----------------------------
    const { results: rawResults, totalMatches } = runPrediction(
      data as CutoffRow[],
      parsedMark,
      selectedDistricts
    );

    if (!rawResults || rawResults.length === 0) {
      return NextResponse.json({
        results: [],
        totalColleges: totalMatches,
        message: "No valid predictions available."
      });
    }

    // ----------------------------
    // 5. Format Output
    // ----------------------------
    const formattedResults = rawResults.map(r => ({
      ...r,
      cutoff_2025: r.cutoff_2025 !== null
        ? Number(r.cutoff_2025.toFixed(2))
        : null,
      buffer: Number(r.buffer.toFixed(2)),
    }));

    // ----------------------------
    // 6. Categorization (for UI convenience)
    // ----------------------------
    const hasDream = formattedResults.some(r => r.display === 'DREAM');

    // ----------------------------
    // 7. Summary & Response
    // ----------------------------
    const topResult = formattedResults[0] || null;

    return NextResponse.json({
      results: formattedResults,     // 🔥 main list (important)
      hasDream,
      topResult,
      totalColleges: totalMatches,    // total available (not limited list)
      quota: normalizedQuota,
      indexMark: parsedMark,
      dataQuality: "High"
    });


  } catch (err: any) {
    console.error('Prediction API Error:', err);

    return NextResponse.json(
      { error: 'Something went wrong while processing prediction.' },
      { status: 500 }
    );
  }
}
