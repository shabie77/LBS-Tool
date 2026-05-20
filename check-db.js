require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase
    .from('lbs_cutoffs')
    .select('*')
    .eq('college_code', 'MAN')
    .eq('quota', 'SM');
    
  console.log('Error:', error);
  console.log('Data:', JSON.stringify(data, null, 2));
}

check();
