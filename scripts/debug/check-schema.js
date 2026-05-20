require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  // We can't directly get schema easily with just the client, 
  // but we can try to insert a dummy row or just fetch one row and see all keys.
  const { data, error } = await supabase
    .from('lbs_cutoffs')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  if (data && data.length > 0) {
    print("Columns in DB:", Object.keys(data[0]));
  } else {
    print("Table is empty. Use Supabase dashboard to check columns.");
  }
}

function print(...args) {
    console.log(...args);
}

checkSchema();
