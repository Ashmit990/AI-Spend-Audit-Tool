'use client';

import React, { useState } from 'react';
import { AuditResult, ToolRecommendation } from '@/types';
import {
  TrendingDown,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Zap,
  ArrowRight,
  Mail,
  Loader2,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AuditReportProps {
  auditId: string | null;
  auditResult: AuditResult;
  aiSummary: string;
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ---------------------------------------------------------------------------
// Tool Savings Row
// ---------------------------------------------------------------------------
function ToolRow({ rec }: { rec: ToolRecommendation }) {
  const [expanded, setExpanded] = useState(false);
  const hasSavings = rec.savings > 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-zinc-700">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              rec.savings > 50
                ? 'bg-emerald-400'
                : rec.savings > 0
                ? 'bg-amber-400'
                : 'bg-zinc-600'
            }`}
          />
          <span className="font-semibold text-white text-sm">{rec.name}</span>
          <span className="text-xs text-zinc-500 font-mono bg-zinc-800 px-2 py-0.5 rounded-md">
            {rec.currentPlan}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {hasSavings ? (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              −${fmt(rec.savings)}/mo
            </span>
          ) : (
            <span className="text-xs font-bold text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-lg">
              Optimal
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-zinc-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-zinc-800 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Current Spend
              </p>
              <p className="text-xl font-bold text-white font-mono">${fmt(rec.currentSpend)}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{rec.currentPlan} plan/mo</p>
            </div>
            <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                Recommended
              </p>
              <p className="text-xl font-bold text-white font-mono">${fmt(rec.recommendedSpend)}</p>
              <p className="text-xs text-emerald-400 mt-0.5 truncate">{rec.recommendedPlan}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-sm text-zinc-400 leading-relaxed bg-zinc-950 rounded-xl p-4 border border-zinc-800">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs">{rec.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lead Capture Form
// ---------------------------------------------------------------------------
function LeadCaptureForm({ auditId }: { auditId: string | null }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, companyName: company, auditId }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Something went wrong.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <BadgeCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <p className="font-bold text-white">Report sent to your inbox!</p>
        <p className="text-xs text-zinc-500 max-w-xs">
          Check your email for the full interactive audit report and savings guide.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="lead-email" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Work Email
        </label>
        <input
          id="lead-email"
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none transition text-sm"
        />
      </div>
      <div>
        <label htmlFor="lead-company" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Company Name <span className="text-zinc-600 font-normal normal-case">(optional)</span>
        </label>
        <input
          id="lead-company"
          type="text"
          placeholder="Acme Inc."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none transition text-sm"
        />
      </div>

      {error && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-violet-950/40 transition-all duration-200 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Mail className="w-4 h-4" />
            Email Me the Full Report
          </>
        )}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Main Report Component
// ---------------------------------------------------------------------------
export default function AuditReport({ auditId, auditResult, aiSummary }: AuditReportProps) {
  const { totalCurrentSpend, totalRecommendedSpend, totalMonthlySavings, totalAnnualSavings, tools, isAlreadyOptimal, showCredexUpsell } = auditResult;

  const savingsPercent =
    totalCurrentSpend > 0 ? Math.round((totalMonthlySavings / totalCurrentSpend) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Ambient glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent_60%)] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[500px] bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.04),transparent_70%)] pointer-events-none -z-10" />

      {/* Navbar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <span className="font-extrabold text-white text-xs">CX</span>
            </div>
            <span className="font-bold text-white tracking-tight text-base">
              Credex <span className="text-zinc-500 text-sm font-normal">Spend Audit</span>
            </span>
          </a>
          <a
            href="/"
            className="text-xs text-zinc-400 hover:text-white transition font-medium flex items-center gap-1.5"
          >
            ← New Audit
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* Hero Summary Numbers */}
        <section>
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Audit Complete
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {isAlreadyOptimal ? (
                <>Your stack is already well-optimized 🎯</>
              ) : (
                <>
                  You could save{' '}
                  <span className="text-emerald-400">${fmt(totalMonthlySavings)}/mo</span>
                  <br />
                  <span className="text-zinc-400 text-2xl font-bold">
                    (${fmt(totalAnnualSavings)} annually)
                  </span>
                </>
              )}
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Current Monthly Spend',
                value: `$${fmt(totalCurrentSpend)}`,
                icon: <TrendingUp className="w-4 h-4 text-zinc-400" />,
                accent: 'zinc',
              },
              {
                label: 'Optimized Monthly Cost',
                value: `$${fmt(totalRecommendedSpend)}`,
                icon: <TrendingDown className="w-4 h-4 text-emerald-400" />,
                accent: 'emerald',
              },
              {
                label: 'Monthly Savings',
                value: `$${fmt(totalMonthlySavings)}`,
                icon: <Zap className="w-4 h-4 text-violet-400" />,
                accent: 'violet',
              },
              {
                label: 'Potential Savings %',
                value: `${savingsPercent}%`,
                icon: <CheckCircle className="w-4 h-4 text-indigo-400" />,
                accent: 'indigo',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    {stat.label}
                  </p>
                </div>
                <p className="text-2xl font-extrabold text-white font-mono">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Summary */}
        {aiSummary && (
          <section className="bg-gradient-to-br from-zinc-900 to-zinc-900/60 border border-violet-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-400">
                AI Analyst Summary
              </p>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">{aiSummary}</p>
          </section>
        )}

        {/* Per-tool breakdown */}
        <section>
          <h2 className="text-xl font-bold text-white tracking-tight mb-5">
            Tool-by-Tool Breakdown
          </h2>
          <div className="space-y-3">
            {tools.map((rec) => (
              <ToolRow key={rec.name} rec={rec} />
            ))}
          </div>
        </section>

        {/* Credex Upsell / Lead Capture */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upsell panel */}
          {showCredexUpsell && (
            <div className="bg-gradient-to-br from-violet-900/20 to-indigo-900/10 border border-violet-500/25 rounded-2xl p-7 flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-violet-400">
                    Credex Advantage
                  </p>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                  Unlock even deeper savings
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Credex consolidates your API billing and negotiates enterprise credit bundles at
                  bulk rates — typically saving startups an additional 15–20% on top of plan
                  optimizations.
                </p>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Pre-purchased bulk API credits at wholesale pricing',
                  'Unified billing dashboard across all tools',
                  'Expert license right-sizing consultation',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:hello@credex.com"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-violet-200 transition"
              >
                Talk to a Credex advisor <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Lead capture card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-white tracking-tight mb-1.5">
                Get the Full Report
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Receive a detailed savings breakdown with actionable steps straight to your inbox.
              </p>
            </div>
            <LeadCaptureForm auditId={auditId} />
          </div>
        </section>
      </main>
    </div>
  );
}
