import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Audit ID is required' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('audits')
      .select('id, audit_result, ai_summary, created_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        auditId: data.id,
        auditResult: data.audit_result,
        aiSummary: data.ai_summary ?? '',
        createdAt: data.created_at,
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    console.error('Audit GET error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
