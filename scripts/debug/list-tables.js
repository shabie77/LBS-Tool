require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listTables() {
  // Supabase JS doesn't have a direct "list tables" method for clients, 
  // but we can try to query common names or use the postgres extension if available.
  // Alternatively, we can try to query the RPC if they have one, or just try common names.
  
  const commonNames = ['lbs_cutoffs', 'LBS cutoff final', 'LBS_cutoff_final_v9_3', 'lbs_cutoffs_v9_3'];
  for (const name of commonNames) {
    const { count, error } = await supabase
      .from(name)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
       // console.log(`Table '${name}' not found.`);
    } else {
       console.log(`Table '${name}' found with ${count} rows.`);
    }
  }
}

listTables();
