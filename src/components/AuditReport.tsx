'use client';

import React, { useState } from 'react';
import { AuditResult, ToolRecommendation } from '@/types';
import {
  TrendingDown,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Zap,
  Mail,
  Loader2,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Share Button
// ---------------------------------------------------------------------------
function ShareButton({ auditId }: { auditId: string | null }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = auditId
      ? `${window.location.origin}/audit/${auditId}`
      : window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-md border transition-all duration-200 ${
        copied
          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
          : 'bg-background border-border hover:border-primary/50 text-foreground/60 hover:text-primary shadow-sm'
      }`}
      title="Copy shareable link"
    >
      {copied ? (
        <><Check className="w-3.5 h-3.5" /> Copied!</>
      ) : (
        <><Copy className="w-3.5 h-3.5" /> Share Report</>
      )}
    </button>
  );
}

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
    <div className="bg-card border border-border rounded-md overflow-hidden transition-all duration-300 hover:shadow-md">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-3 h-3 rounded-full flex-shrink-0 shadow-sm ${
              rec.savings > 50
                ? 'bg-emerald-500 shadow-emerald-500/20'
                : rec.savings > 0
                ? 'bg-amber-500 shadow-amber-500/20'
                : 'bg-slate-300 dark:bg-slate-700'
            }`}
          />
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-sm leading-none mb-1">{rec.name}</span>
            <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">
              {rec.currentPlan}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {hasSavings ? (
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 px-3 py-1.5 rounded-md">
              −${fmt(rec.savings)}/mo
            </span>
          ) : (
            <span className="text-xs font-bold text-foreground/30 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-md">
              No Waste
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-foreground/20" />
          ) : (
            <ChevronDown className="w-5 h-5 text-foreground/20" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 border-t border-border pt-6 space-y-5 bg-slate-50/30 dark:bg-slate-900/10">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background rounded-md p-5 border border-border shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 mb-2">
                Current Spend
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-foreground font-mono">${fmt(rec.currentSpend)}</span>
                <span className="text-[10px] text-foreground/40 font-bold uppercase">/mo</span>
              </div>
              <p className="text-xs text-foreground/40 mt-1 font-medium">{rec.currentPlan}</p>
            </div>
            <div className="bg-primary/5 rounded-md p-5 border border-primary/10 shadow-sm shadow-primary/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">
                Optimized
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-primary font-mono">${fmt(rec.recommendedSpend)}</span>
                <span className="text-[10px] text-primary/40 font-bold uppercase">/mo</span>
              </div>
              <p className="text-xs text-primary/60 mt-1 font-medium truncate">{rec.recommendedPlan}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-foreground/60 leading-relaxed bg-background rounded-md p-5 border border-border shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600/60">Optimization Insight</p>
              <p className="text-xs font-medium">{rec.reason}</p>
            </div>
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
      <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <div className="w-16 h-16 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm shadow-emerald-500/10">
          <BadgeCheck className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="space-y-1">
          <p className="font-black text-foreground text-lg">Report Dispatched!</p>
          <p className="text-sm text-foreground/40 max-w-xs mx-auto font-medium">
            We&apos;ve sent the implementation guide and full audit PDF to your inbox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="lead-email" className="block text-[10px] font-bold uppercase tracking-wider text-foreground/40 px-1">
          Work Email
        </label>
        <input
          id="lead-email"
          type="email"
          required
          placeholder="email@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-background border border-border hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-md py-3.5 px-5 text-foreground placeholder-foreground/20 focus:outline-none transition text-sm font-medium shadow-sm"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="lead-company" className="block text-[10px] font-bold uppercase tracking-wider text-foreground/40 px-1">
          Company <span className="text-foreground/20 italic font-normal">(optional)</span>
        </label>
        <input
          id="lead-company"
          type="text"
          placeholder="e.g. Acme SaaS"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full bg-background border border-border hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-md py-3.5 px-5 text-foreground placeholder-foreground/20 focus:outline-none transition text-sm font-medium shadow-sm"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-md text-red-600 text-xs font-bold animate-pulse">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/95 text-white font-black py-4 px-6 rounded-md shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Mail className="w-5 h-5" />
            Send PDF Implementation Guide
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
  const { totalCurrentSpend, totalRecommendedSpend, totalMonthlySavings, totalAnnualSavings, tools, isAlreadyOptimal } = auditResult;

  const savingsPercent =
    totalCurrentSpend > 0 ? Math.round((totalMonthlySavings / totalCurrentSpend) * 100) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none -z-10" />
      
      {/* Dynamic Background Gradients */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-20 pointer-events-none translate-x-1/4 -translate-y-1/4" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] -z-20 pointer-events-none -translate-x-1/4 translate-y-1/4" />

      {/* Modern Navbar */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-black text-white text-xs tracking-tighter">CX</span>
            </div>
            <span className="font-black text-foreground tracking-tight text-lg">
              Credex <span className="text-foreground/30 font-bold ml-1">Audit</span>
            </span>
          </a>
          <div className="flex items-center gap-4">
            <ShareButton auditId={auditId} />
            <div className="w-px h-6 bg-border mx-2" />
            <a
              href="/"
              className="text-xs text-primary font-black hover:underline transition"
            >
              New Audit
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-12 gap-12 items-start relative z-10">

        {/* Left Column: Summary & Tools */}
        <div className="lg:col-span-7 space-y-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-md text-xs font-black tracking-wide mb-6">
              <BadgeCheck className="w-4 h-4" />
              INTELLIGENCE ANALYSIS VERIFIED
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-foreground">
              {isAlreadyOptimal ? (
                <>Your AI stack is <span className="text-primary italic">perfectly lean.</span></>
              ) : (
                <>
                  We found <span className="text-emerald-500 italic">${fmt(totalMonthlySavings)}</span> <br />
                  in monthly waste.
                </>
              )}
            </h1>
            <p className="mt-6 text-foreground/50 text-lg font-medium max-w-2xl leading-relaxed">
              Based on your stack, you are currently overpaying by roughly <span className="text-foreground font-bold">{savingsPercent}%</span>.
              Following these recommendations could recover <span className="text-emerald-500 font-bold">${fmt(totalAnnualSavings)}</span> annually.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: 'Current Carry',
                value: `$${fmt(totalCurrentSpend)}`,
                icon: <TrendingUp className="w-4 h-4 text-foreground/40" />,
              },
              {
                label: 'Ideal Cost',
                value: `$${fmt(totalRecommendedSpend)}`,
                icon: <TrendingDown className="w-4 h-4 text-primary" />,
              },
              {
                label: 'Monthly Gain',
                value: `$${fmt(totalMonthlySavings)}`,
                icon: <Zap className="w-4 h-4 text-emerald-500" />,
              },
              {
                label: 'Waste Ratio',
                value: `${savingsPercent}%`,
                icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-md p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                    {stat.label}
                  </p>
                </div>
                <p className="text-2xl font-black text-foreground font-mono leading-none">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black text-foreground tracking-tight">
              Tool-by-Tool Breakdown
            </h2>
            <div className="space-y-3">
              {tools.map((rec) => (
                <ToolRow key={rec.name} rec={rec} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Summary & Lead Capture */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
          {/* AI Summary Card */}
          {aiSummary && (
            <div className="bg-primary/5 border border-primary/10 rounded-md p-8 relative overflow-hidden shadow-sm shadow-primary/5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-primary">
                  AI Analyst Insight
                </p>
              </div>
              <p className="text-foreground/70 text-sm font-medium leading-relaxed italic">
                &quot;{aiSummary}&quot;
              </p>
            </div>
          )}

          {/* Lead Capture Panel */}
          <div className="bg-card border border-border rounded-md p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="mb-8">
              <h3 className="text-xl font-black text-foreground tracking-tight mb-2">
                Download Savings Guide
              </h3>
              <p className="text-foreground/40 text-sm font-medium leading-relaxed">
                Receive the full implementation roadmap and vendor negotiation templates via email.
              </p>
            </div>
            <LeadCaptureForm auditId={auditId} />
            
            <div className="mt-8 pt-8 border-t border-border space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 text-center">Included in the PDF</p>
              <ul className="grid grid-cols-2 gap-3">
                {[
                  'Cancellation Templates',
                  'Seat Clean-up Guide',
                  'API Usage Benchmarks',
                  'Migration Checklists'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[11px] font-bold text-foreground/50">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
