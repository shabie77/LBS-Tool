require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkQuotas() {
  const { data, error } = await supabase
    .from('lbs_cutoffs')
    .select('quota')
    .limit(20);
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log("Sample Quotas from DB:", data.map(d => `'${d.quota}'`));
    
    // Count distinct quotas
    const quotas = [...new Set(data.map(d => d.quota))];
    console.log("Distinct Sample Quotas:", quotas);
  } else {
    console.log("Table is empty or no data returned.");
  }
}

checkQuotas();
