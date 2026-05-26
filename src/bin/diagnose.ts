import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';

// 1. Load Next.js Environment Variables
const projectDir = process.cwd();
const { loadedEnvFiles } = loadEnvConfig(projectDir);

console.log('====================================================');
console.log('🩺 CREDEX SPEND AUDIT TOOL — DIAGNOSTICS');
console.log('====================================================');
console.log('📁 Loaded environment files:');
if (loadedEnvFiles.length === 0) {
  console.log('  ⚠️  No environment files loaded (.env.local, .env, etc.). Using system environments.');
} else {
  loadedEnvFiles.forEach((f) => console.log(`  ✓ ${f.path}`));
}
console.log('');

// 2. Define Diagnostic Helpers
async function checkSupabase() {
  console.log('🗄️ Checking Supabase integration...');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    console.log('  ❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in env.');
    return false;
  }

  console.log(`  - Supabase URL: ${url}`);
  console.log(`  - Service Key defined: ${serviceKey ? 'Yes' : 'No (Using Anon Key)'}`);

  try {
    const key = serviceKey || anonKey;
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    console.log('  - Attempting to query audits table...');
    const { data, error } = await client.from('audits').select('id').limit(1);

    if (error) {
      console.log(`  ❌ Query failed: ${error.message}`);
      return false;
    }

    console.log(`  ✓ Supabase connection successful! (Fetched ${data.length} records successfully)`);
    return true;
  } catch (err) {
    console.log(`  ❌ Connection exception: ${err instanceof Error ? err.message : err}`);
    return false;
  }
}

async function checkAnthropic() {
  console.log('\n🧠 Checking Anthropic Claude integration...');
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.log('  ⚠️  Missing ANTHROPIC_API_KEY. The app will fall back to static text summaries.');
    return true;
  }

  console.log('  - Anthropic Key defined. Testing API connectivity...');
  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 5,
      messages: [{ role: 'user', content: 'Verify connectivity by replying with "Ready".' }],
    });

    const contentBlock = response.content[0];
    const reply = contentBlock && contentBlock.type === 'text' ? contentBlock.text.trim() : '';
    
    console.log(`  ✓ Anthropic connection successful! Response: "${reply}"`);
    return true;
  } catch (err) {
    console.log(`  ❌ Anthropic API failed: ${err instanceof Error ? err.message : err}`);
    return false;
  }
}

async function checkResend() {
  console.log('\n✉️ Checking Resend Email integration...');
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('  ⚠️  Missing RESEND_API_KEY. The app will skip sending confirmation emails.');
    return true;
  }

  console.log('  - Resend API Key defined. Testing API authorization...');
  try {
    const resend = new Resend(apiKey);
    
    // Resend has a simple api to list API keys or domains to check connection
    const { error, data } = await resend.apiKeys.list();
    if (error) {
      console.log(`  ❌ Resend API failed: ${error.message}`);
      return false;
    }

    console.log(`  ✓ Resend connection successful! (Validated key. Found ${data?.data?.length ?? 0} API keys)`);
    return true;
  } catch (err) {
    console.log(`  ❌ Resend API failed: ${err instanceof Error ? err.message : err}`);
    return false;
  }
}

// 3. Run all diagnostics
async function run() {
  let ok = true;
  
  const supabaseOk = await checkSupabase();
  const anthropicOk = await checkAnthropic();
  const resendOk = await checkResend();

  console.log('\n====================================================');
  console.log('📊 DIAGNOSTICS SUMMARY');
  console.log('====================================================');
  
  if (supabaseOk) {
    console.log('  🗄️  Supabase Connection: OK');
  } else {
    ok = false;
    console.log('  🗄️  Supabase Connection: FAILED');
  }

  if (anthropicOk) {
    console.log('  🧠  Anthropic Claude API: OK');
  } else {
    ok = false;
    console.log('  🧠  Anthropic Claude API: FAILED');
  }

  if (resendOk) {
    console.log('  ✉️  Resend Email API:    OK');
  } else {
    ok = false;
    console.log('  ✉️  Resend Email API:    FAILED');
  }

  console.log('====================================================');
  if (ok) {
    console.log('✅ Status: ALL CONFIGURATIONS WORKING PROPERLY!');
    process.exit(0);
  } else {
    console.log('⚠️  Status: SOME INTEGRATIONS ENCOUNTERED PROBLEMS.');
    process.exit(1);
  }
}

run();
