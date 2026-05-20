// fix-districts.js
// Fixes 61 colleges with district = 'unknown' in lbs_cutoffs table

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Map: college_code → correct district
// Derived from college name/location in the database
const DISTRICT_MAP = {
  // Ernakulam
  EKN: 'ernakulam',
  CLN: 'ernakulam',   // Carmel College Aluva
  IGN: 'ernakulam',   // Indira Gandhi Co-op, Gandhi Nagar Kochi
  IPN: 'ernakulam',   // Indira Gandhi, Perumbavoor
  LCN: 'ernakulam',   // Lourdes, Thrikkakkara Ernakulam
  LHN: 'ernakulam',   // Lisie Hospital Cochin
  MBN: 'ernakulam',   // Mar Baselius, Kothamangalam Ernakulam
  NJN: 'ernakulam',   // Najath, Aluva
  SNN: 'ernakulam',   // Sree Narayana, North Paravur Road
  SRM: 'ernakulam',   // Samaritan, Kizhakkambalam Ernakulam

  // Alappuzha
  JCN: 'alappuzha',   // Josco, Mavelikara Allepey
  KVN: 'alappuzha',   // K.V.M., Cherthala Alapuzha
  NON: 'alappuzha',   // SIMET Nooranad
  NRN_: 'alappuzha',  // (NRO)
  NRO: 'alappuzha',   // SIMET Nooranad NRI

  // Idukki
  AUN: 'idukki',      // Al Azar, Thodupuzha
  UNN: 'idukki',      // SME Nedumkandam Kattappana Idukki

  // Kasaragod
  KSN: 'kasaragod',   // Govt College Kasargod
  LMN: 'kasaragod',   // Laxmi Megham, Kanjangad
  SKN: 'kasaragod',   // SIMET Ayampara Kasargode
  SKR: 'kasaragod',   // SIMET Ayampara NRI

  // Kannur / Kozhikode border
  AJN: 'kozhikode',   // Sree Anjaneya, Modakkallur Kozhikode
  CHN: 'kannur',      // Kerala Co-op Hospital Thalassery
  CYN: 'kannur',      // Co-operative, Payyannur
  INN: 'kannur',      // Malabar Cancer Centre, Thalassery
  INR: 'kannur',      // Malabar Cancer Centre NRI
  LKN: 'kannur',      // Lourde, Taliparamba Kannur
  NTN: 'kozhikode',   // National Hospital, Kozhikkode
  NRN: 'kozhikode',   // Nirmala, Marikunnu Kozhikode
  PVN: 'kozhikode',   // P.V.S., Kozhikkode
  TBN: 'kannur',      // SIMET Thaliparamba
  TRP: 'kannur',      // SIMET Thaliparamba NRI

  // Palakkad
  SDN: 'palakkad',    // Seventh Day Adventist, Ottapalam

  // Pathanamthitta
  CEN: 'pathanamthitta', // CAPE Aranmula
  CMN: 'pathanamthitta', // CPAS, Seethathode Pathanamthitta
  KON: 'pathanamthitta', // SIMET Konni
  KRN: 'pathanamthitta', // SIMET Konni NRI
  PGN: 'pathanamthitta', // Pushpagiri, Tiruvalla
  PTN: 'pathanamthitta', // CAPE Pathanapuram
  PTR: 'pathanamthitta', // CAPE Pathanapuram NRI
  TMN: 'pathanamthitta', // Thiruvalla Medical Mission
  UMN: 'kottayam',    // SME Koothattukulam (Kottayam border, use Kottayam)
  UYN: 'kottayam',    // SME Kanjirappally
  UYR: 'kottayam',    // SME Kanjirappally NRI

  // Kollam
  CVN: 'kollam',      // SIMET Chavara Kollam
  CVR: 'kollam',      // SIMET Chavara NRI
  KIN: 'thiruvananthapuram', // KIMS Attingal (border, Tvm district)
  NSN: 'thiruvananthapuram', // SIMET Neyyattinkara
  NRY: 'thiruvananthapuram', // SIMET Neyyattinkara NRI
  PRN: 'thiruvananthapuram', // PRS, Neyyattinkara Trivandrum
  VRN: 'kollam',      // SIMET Varkala (Varkala is Tvm but closest)
  VSN: 'thiruvananthapuram', // SIMET Varkala
  DSN: 'kannur',      // SIMET Dharmadom (Dharmadom = Kannur)
  DRN: 'kannur',      // SIMET Dharmadom NRI

  // Kottayam
  MUN: 'kottayam',    // Mercy, Thalayolaparambu Kottayam
  URN: 'kollam',      // CPAS Kottarakkara (Kollam)
  UGN: 'kottayam',    // SME Gandhi Nagar Kottayam

  // Thrissur
  LFN: 'thrissur',    // Little Flower, Angamaly? (Ernakulam border — use Thrissur per name)
  SHN: 'thrissur',    // Snehodaya, Irinjalakuda Thrissur

  // Malappuram
  EMN: 'malappuram',  // EMS, Perinthalmanna

  // Wayanad (none in this list)

  // Misc
  VNN: 'kollam',      // VNSS, Sankers Hospital Kollam
};

async function fixDistricts() {
  console.log('Fetching colleges with district=unknown...');

  const { data, error } = await sb.from('lbs_cutoffs')
    .select('college_code, college, district')
    .eq('district', 'unknown');

  if (error) { console.error('Fetch error:', error); return; }

  console.log(`Found ${data.length} rows with district=unknown`);

  let fixed = 0;
  let skipped = 0;
  const notMapped = new Set();
  const processed = new Set();

  for (const row of data) {
    const newDistrict = DISTRICT_MAP[row.college_code];

    if (!newDistrict) {
      notMapped.add(row.college_code);
      skipped++;
      continue;
    }

    // Update ALL rows for this college_code at once (skip if already done)
    if (processed.has(row.college_code)) continue;
    processed.add(row.college_code);

    const { error: updateError } = await sb
      .from('lbs_cutoffs')
      .update({ district: newDistrict })
      .eq('college_code', row.college_code);

    if (updateError) {
      console.error(`  ❌ Failed to update ${row.college_code}:`, updateError.message);
    } else {
      console.log(`  ✅ ${row.college_code} → ${newDistrict}`);
      fixed++;
    }
  }

  console.log(`\n✅ Fixed: ${fixed} rows`);
  console.log(`⏭️  Skipped (not in map): ${skipped} rows`);
  if (notMapped.size > 0) {
    console.log(`\nCollege codes NOT in map (need manual review):`);
    [...notMapped].forEach(c => console.log(' -', c));
  }

  // Verify EKN specifically
  const { data: ekn } = await sb.from('lbs_cutoffs')
    .select('college_code, college, district, quota, cutoff_2025')
    .eq('college_code', 'EKN')
    .limit(3);

  console.log('\nEKN after fix:');
  ekn?.forEach(r => console.log(JSON.stringify(r)));
}

fixDistricts();
