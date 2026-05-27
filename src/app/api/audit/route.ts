import { NextRequest, NextResponse } from 'next/server';
import { AuditInput } from '@/types';
import { runAudit, buildAuditPromptText } from '@/lib/auditEngine';
import { generateAuditSummary } from '@/lib/anthropic';
import { getSupabaseServerClient } from '@/lib/supabase';
import { validateAuditInput, sanitizeAuditInput } from '@/lib/validate';

export async function POST(req: NextRequest) {
  try {
    const body: AuditInput = await req.json();

    // 1. Validate input
    const validation = validateAuditInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    // 2. Sanitize input
    const sanitized = sanitizeAuditInput(body);

    // 3. Run deterministic audit logic
    const auditResult = runAudit(sanitized);

    // 4. Build Anthropic prompt text and get AI summary (falls back if no API key)
    const promptText = buildAuditPromptText(sanitized, auditResult);
    const aiSummary = await generateAuditSummary(promptText);

    // 5. Persist to Supabase
    const supabase = getSupabaseServerClient();
    const { data: insertedRow, error: dbError } = await supabase
      .from('audits')
      .insert({
        team_size: sanitized.teamSize,
        use_case: sanitized.useCase,
        tools_input: sanitized.tools,
        audit_result: auditResult,
        ai_summary: aiSummary,
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Supabase insert error:', dbError.message);
      return NextResponse.json(
        {
          auditResult,
          aiSummary,
          auditId: null,
          warning: 'Audit result could not be saved to database.',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { auditResult, aiSummary, auditId: insertedRow?.id ?? null },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    console.error('Audit API error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
