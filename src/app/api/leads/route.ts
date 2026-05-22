import { NextRequest, NextResponse } from 'next/server';
import { LeadInput } from '@/types';
import { getSupabaseServerClient } from '@/lib/supabase';
import { sendConfirmationEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const body: LeadInput = await req.json();

    if (!body || !body.email || !body.auditId) {
      return NextResponse.json({ error: 'email and auditId are required' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    // 1. Fetch the audit record to get savings data for the email
    const { data: auditRow, error: fetchError } = await supabase
      .from('audits')
      .select('audit_result')
      .eq('id', body.auditId)
      .single();

    if (fetchError || !auditRow) {
      console.error('Failed to fetch audit for lead:', fetchError?.message);
    }

    const totalMonthlySavings: number =
      auditRow?.audit_result?.totalMonthlySavings ?? 0;

    // 2. Upsert the lead record (idempotent by email)
    const { error: leadError } = await supabase.from('leads').upsert(
      {
        audit_id: body.auditId,
        email: body.email,
        company_name: body.companyName ?? null,
        role: body.role ?? null,
        team_size: body.teamSize ?? null,
      },
      { onConflict: 'email' }
    );

    if (leadError) {
      console.error('Lead upsert error:', leadError.message);
    }

    // 3. Send confirmation email
    const auditUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/audit/${body.auditId}`;
    const emailResult = await sendConfirmationEmail({
      email: body.email,
      totalMonthlySavings,
      auditUrl,
    });

    return NextResponse.json(
      {
        success: true,
        emailSent: emailResult.success,
        message: 'Lead captured successfully.',
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    console.error('Leads API error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
