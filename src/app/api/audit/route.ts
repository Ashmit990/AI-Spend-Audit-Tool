import { NextRequest, NextResponse } from 'next/server';
import { AuditInput } from '@/types';
import { runAudit, buildAuditPromptText } from '@/lib/audit';
import { generateAuditSummary } from '@/lib/anthropic';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body: AuditInput = await req.json();

    // Validate basic shape
    if (!body || !Array.isArray(body.tools) || body.tools.length === 0) {
      return NextResponse.json({ error: 'Invalid audit input' }, { status: 400 });
    }

    // 1. Run deterministic audit logic
    const auditResult = runAudit(body);

    // 2. Build Anthropic prompt text and get AI summary (gracefully falls back if no API key)
    const promptText = buildAuditPromptText(body, auditResult);
    const aiSummary = await generateAuditSummary(promptText);

    // 3. Persist to Supabase
    const supabase = getSupabaseServerClient();
    const { data: insertedRow, error: dbError } = await supabase
      .from('audits')
      .insert({
        team_size: body.teamSize,
        use_case: body.useCase,
        tools_input: body.tools,
        audit_result: auditResult,
        ai_summary: aiSummary,
      })
      .select('id')
      .single();

    if (dbError) {
      // Log but don't fail — return result without a persisted ID
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
      {
        auditResult,
        aiSummary,
        auditId: insertedRow?.id ?? null,
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    console.error('Audit API error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
