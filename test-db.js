const { createClient } = require('@supabase/supabase-js');
const { config } = require('dotenv');
config();

async function testConnection() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Testing connection to URL:', url);
  console.log('Key length:', key?.length);

  const supabase = createClient(url, key);

  try {
    console.log('Attempting to fetch audits...');
    const { data, error } = await supabase.from('audits').select('*').limit(1);
    if (error) {
      console.error('Supabase Error:', error.message);
      console.error('Error Code:', error.code);
      process.exit(1);
    }
    console.log('Successfully connected!');
    console.log('Records found:', data.length);
  } catch (err) {
    console.error('Runtime Error:', err.message);
    process.exit(1);
  }
}

testConnection();
