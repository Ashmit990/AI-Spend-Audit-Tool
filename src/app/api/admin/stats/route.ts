import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  // Simple token check to protect admin route
  const token = req.nextUrl.searchParams.get('token');
  const adminToken = process.env.ADMIN_SECRET_TOKEN;

  if (adminToken && token !== adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServerClient();

    // Total audits count
    const { count: totalAudits } = await supabase
      .from('audits')
      .select('*', { count: 'exact', head: true });

    // Total leads count
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    // Total savings identified (sum of total_monthly_savings)
    const { data: savingsData } = await supabase
      .from('audits')
      .select('total_monthly_savings');

    const totalSavingsIdentified = savingsData?.reduce(
      (sum, row) => sum + (parseFloat(row.total_monthly_savings) || 0),
      0
    ) ?? 0;

    // Recent 10 audits
    const { data: recentAudits } = await supabase
      .from('audits')
      .select('id, team_size, use_case, total_monthly_savings, total_annual_savings, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // Recent 10 leads
    const { data: recentLeads } = await supabase
      .from('leads')
      .select('id, email, company_name, role, team_size, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      stats: {
        totalAudits: totalAudits ?? 0,
        totalLeads: totalLeads ?? 0,
        totalSavingsIdentified: totalSavingsIdentified.toFixed(2),
        avgMonthlySavings: totalAudits
          ? (totalSavingsIdentified / totalAudits).toFixed(2)
          : '0.00',
      },
      recentAudits: recentAudits ?? [],
      recentLeads: recentLeads ?? [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
