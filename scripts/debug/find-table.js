require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function findTable() {
  // Try to query the table the error suggested
  const { data, error } = await supabase
    .from('LBS cutoff final v9_3')
    .select('*')
    .limit(1);
    
  if (error) {
    console.log("Could not find LBS cutoff final v9_3. Trying another...");
    const { data: data2, error: error2 } = await supabase.from('LBS_cutoff_final_v9_3').select('*').limit(1);
    if (error2) console.log("Still not found.");
    else console.log("Found: LBS_cutoff_final_v9_3. Columns:", Object.keys(data2[0]));
    return;
  }
  
  console.log("Found: LBS cutoff final v9_3. Columns:", Object.keys(data[0]));
}

findTable();
