'use client';

import { useEffect, useState } from 'react';
import { TrendingDown, Users, Zap, DollarSign, RefreshCw, Lock } from 'lucide-react';

interface AdminStats {
  totalAudits: number;
  totalLeads: number;
  totalSavingsIdentified: string;
  avgMonthlySavings: string;
}

interface RecentAudit {
  id: string;
  team_size: number;
  use_case: string;
  total_monthly_savings: string;
  created_at: string;
}

interface RecentLead {
  id: string;
  email: string;
  company_name: string | null;
  role: string | null;
  team_size: number | null;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [token, setToken] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentAudits, setRecentAudits] = useState<RecentAudit[]>([]);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);

  const fetchStats = async (t: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/stats?token=${encodeURIComponent(t)}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Failed to load stats.');
        return;
      }
      setStats(json.stats);
      setRecentAudits(json.recentAudits);
      setRecentLeads(json.recentLeads);
      setSubmitted(true);
    } catch {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats(token);
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (!submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.07),transparent_60%)] pointer-events-none" />
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5 text-violet-400" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-zinc-500 text-sm">Enter your admin token to access real-time audit stats.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter admin token (or leave blank if none set)"
              className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none transition placeholder:text-zinc-600"
            />
            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-violet-950/40 transition-all duration-200 text-sm disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? 'Loading…' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent_60%)] pointer-events-none -z-10" />

      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <span className="font-extrabold text-white text-xs tracking-wider">CX</span>
            </div>
            <span className="font-bold text-white tracking-tight text-base">
              Credex <span className="text-zinc-500 text-sm font-normal">Admin</span>
            </span>
          </div>
          <button
            onClick={() => fetchStats(token)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Stats Grid */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Audits',
                value: stats?.totalAudits ?? 0,
                icon: <Zap className="w-5 h-5 text-violet-400" />,
                color: 'violet',
              },
              {
                label: 'Total Leads',
                value: stats?.totalLeads ?? 0,
                icon: <Users className="w-5 h-5 text-indigo-400" />,
                color: 'indigo',
              },
              {
                label: 'Total Savings Found',
                value: `$${Number(stats?.totalSavingsIdentified ?? 0).toLocaleString()}`,
                icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
                color: 'emerald',
              },
              {
                label: 'Avg Savings / Audit',
                value: `$${Number(stats?.avgMonthlySavings ?? 0).toLocaleString()}/mo`,
                icon: <TrendingDown className="w-5 h-5 text-amber-400" />,
                color: 'amber',
              },
            ].map((card) => (
              <div
                key={card.label}
                className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 hover:border-zinc-700 transition"
              >
                <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  {card.icon}
                </div>
                <div>
                  <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">{card.label}</p>
                  <p className="text-2xl font-bold text-white font-mono">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audits */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Recent Audits</h2>
          {recentAudits.length === 0 ? (
            <p className="text-zinc-600 text-sm">No audits yet.</p>
          ) : (
            <div className="border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900 border-b border-zinc-800">
                  <tr>
                    {['ID', 'Team Size', 'Use Case', 'Monthly Savings', 'Date'].map((h) => (
                      <th key={h} className="text-left text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentAudits.map((a, i) => (
                    <tr key={a.id} className={`border-b border-zinc-900 hover:bg-zinc-900/50 transition ${i % 2 === 0 ? '' : 'bg-zinc-950/50'}`}>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">{a.id.split('-')[0]}…</td>
                      <td className="px-4 py-3 text-zinc-300">{a.team_size}</td>
                      <td className="px-4 py-3 text-zinc-300 capitalize">{a.use_case}</td>
                      <td className="px-4 py-3 font-mono text-emerald-400 font-semibold">
                        ${Number(a.total_monthly_savings).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{fmt(a.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Recent Leads</h2>
          {recentLeads.length === 0 ? (
            <p className="text-zinc-600 text-sm">No leads captured yet.</p>
          ) : (
            <div className="border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900 border-b border-zinc-800">
                  <tr>
                    {['Email', 'Company', 'Role', 'Team Size', 'Date'].map((h) => (
                      <th key={h} className="text-left text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((l, i) => (
                    <tr key={l.id} className={`border-b border-zinc-900 hover:bg-zinc-900/50 transition ${i % 2 === 0 ? '' : 'bg-zinc-950/50'}`}>
                      <td className="px-4 py-3 text-violet-400 font-medium">{l.email}</td>
                      <td className="px-4 py-3 text-zinc-300">{l.company_name ?? '—'}</td>
                      <td className="px-4 py-3 text-zinc-300">{l.role ?? '—'}</td>
                      <td className="px-4 py-3 text-zinc-300">{l.team_size ?? '—'}</td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{fmt(l.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
