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
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-lg border transition-all duration-200 ${
        copied
          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
          : 'bg-white border-slate-200 hover:border-slate-900 text-slate-700 hover:text-slate-900 shadow-sm active:scale-95'
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

function fmt(n: number | undefined | null) {
  if (typeof n !== 'number') return '0';
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ---------------------------------------------------------------------------
// Tool Savings Row
// ---------------------------------------------------------------------------
function ToolRow({ rec }: { rec: ToolRecommendation }) {
  const [expanded, setExpanded] = useState(false);
  const hasSavings = rec.savings > 0;

  return (
    <motion.div 
      layout
      className="premium-card group transition-all duration-500 hover:shadow-premium-hover border-2 border-slate-200"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-8 py-8 text-left"
      >
        <div className="flex items-center gap-6">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 ${
              rec.savings > 50
                ? 'bg-emerald-50 text-emerald-600'
                : rec.savings > 0
                ? 'bg-amber-50 text-amber-600'
                : 'bg-slate-50 text-slate-400'
            }`}
          >
            {rec.savings > 0 ? <TrendingDown className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 text-lg leading-tight mb-1 group-hover:text-primary transition-colors">{rec.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] leading-none">
                {rec.currentPlan}
              </span>
              <div className="w-1 h-1 rounded-full bg-slate-200" />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] leading-none">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
          {hasSavings ? (
            <div className="text-right">
              <span className="block text-lg font-black text-emerald-600 tabular-nums">
                −${fmt(rec.savings)}
              </span>
              <span className="block text-[9px] font-black text-emerald-500/60 uppercase tracking-widest mt-0.5">monthly saving</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Optimized
              </span>
            </div>
          )}
          <div className={`w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center transition-all duration-300 ${expanded ? 'rotate-180 bg-slate-900 border-slate-900 text-white shadow-lg' : 'text-slate-300 hover:text-slate-900'}`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-50 bg-slate-50/20"
          >
            <div className="p-8 md:p-10 space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <span className="w-1 h-3 bg-slate-200 rounded-full" />
                    Current Expenditure
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 tabular-nums">${fmt(rec.currentSpend)}</span>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">USD / Month</span>
                  </div>
                </div>
                <div className="bg-slate-950 rounded-2xl p-6 border-2 border-slate-800 shadow-xl transition-transform hover:scale-[1.02]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <span className="w-1 h-3 bg-amber-500 rounded-full" />
                    Target Recommendation
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white tabular-nums">${fmt(rec.recommendedSpend)}</span>
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">USD / Month</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-grow bg-slate-100" />
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 whitespace-nowrap">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Strategic Rationale
                  </h4>
                  <div className="h-px flex-grow bg-slate-100" />
                </div>
                
                <div className="bg-white/40 border-2 border-slate-200 rounded-2xl p-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0 text-xs font-black">
                      !
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed italic">
                      "{rec.reason}"
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Plan</span>
                      <span className="text-sm font-black text-slate-900">{rec.recommendedPlan}</span>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto btn-primary py-3 px-6 text-[11px] uppercase tracking-widest shadow-none hover:shadow-lg">Apply Optimization</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AuditReport({ auditId, auditResult, aiSummary }: AuditReportProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isOptimized = auditResult.totalMonthlySavings === 0;

  const handleSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          auditId,
          tools: auditResult.tools.map((r) => r.name),
          totalSavings: auditResult.totalMonthlySavings,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      {/* Result Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 sm:p-14 relative overflow-hidden"
      >
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-grid-pattern" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-12">
          <div className="space-y-8 flex-grow">
            <div className="flex items-center gap-3">
              <span className={isOptimized ? "badge-slate" : "badge-emerald"}>
                {isOptimized ? 'Audit Verified' : 'Savings Found'}
              </span>
              <div className="h-px w-12 bg-slate-100" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                Ref ID: {auditId?.slice(0, 8) || 'PREVIEW'}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-slate-900 leading-none">
                {isOptimized ? (
                  <span className="flex items-center gap-4">
                    100<span className="text-slate-200">%</span>
                  </span>
                ) : (
                  <span>${fmt(auditResult.totalMonthlySavings)}</span>
                )}
              </h1>
              <div className="flex items-center gap-2 ml-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isOptimized ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'}`} />
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                  {isOptimized ? 'Current Stack Efficiency' : 'Potential Monthly Savings'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-4 justify-center md:items-end">
            <ShareButton auditId={auditId} />
            <button 
              onClick={() => window.print()}
              className="btn-secondary text-[11px] h-12 px-8 flex items-center justify-center gap-2 group"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-slate-100/50 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBox label="Efficiency" value={`${auditResult.efficiencyScore ?? 100}%`} color="text-slate-900" />
          <StatBox label="Annual Net" value={`$${fmt(auditResult.totalAnnualSavings)}`} color="text-emerald-500" />
          <StatBox label="Overlaps" value={auditResult.redundantToolsCount ?? 0} color="text-amber-500" />
          <StatBox label="Tools Found" value={(auditResult.tools || []).length} color="text-slate-900" />
        </div>
      </motion.div>

      {/* Executive Summary Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="premium-dark p-10 md:p-14 relative"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <ShieldCheck className="w-48 h-48" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white/50">Intelligence Report</h3>
              <h4 className="text-lg font-black text-white">Executive Summary</h4>
            </div>
          </div>

          <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-200 text-balance max-w-3xl">
            {aiSummary || "We've analyzed your AI stack and identified key optimization opportunities to reduce licensing waste and eliminate tool overlap."}
          </p>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              Verified Analysis
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
              <Star className="w-4 h-4 text-amber-400" />
              Credex Certified
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Recommendations */}
      <div className="space-y-8">
        <div className="flex items-end justify-between px-2">
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">Optimization Matrix</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deep dive per tool</p>
          </div>
        </div>

        <div className="space-y-4">
          {auditResult.tools.map((rec, i) => (
            <motion.div
              key={rec.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 + 0.2 }}
            >
              <ToolRow rec={rec} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final Playbook CTA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-panel p-12 md:p-20 text-center relative overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-slate-900/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-10">
          <div className="space-y-4">
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900">Get the full playbook.</h3>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              We'll send you a detailed CSV with specific migration steps, coupon codes for alternatives, and a negotiation template for Enterprise plans.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                name="email"
                placeholder="founders@company.com"
                required
                className="flex-grow bg-white border-2 border-slate-100 rounded-2xl px-8 py-5 font-bold text-slate-900 placeholder:text-slate-300 focus:border-slate-900 transition-all outline-none"
              />
              <button
                disabled={submitting}
                className="btn-primary flex items-center justify-center gap-3 px-10 group whitespace-nowrap"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Unlock Playbook
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-50 text-emerald-700 py-8 px-10 rounded-[2rem] border border-emerald-100/50 flex flex-col items-center gap-2"
            >
              <CheckCircle className="w-12 h-12 mb-2" />
              <span className="font-black text-xl tracking-tight">Access Granted</span>
              <span className="font-bold text-emerald-600/70">Check your inbox for the playbook.</span>
            </motion.div>
          )}
          
          <div className="flex items-center justify-center gap-8 py-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default overflow-hidden whitespace-nowrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trusted by founders at</span>
            <div className="h-4 w-px bg-slate-200" />
            <div className="font-black text-xs text-slate-400">YC S24</div>
            <div className="font-black text-xs text-slate-400">TECHSTARS</div>
            <div className="font-black text-xs text-slate-400">SEQUOIA</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="space-y-1 group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">{label}</p>
      <p className={`text-2xl font-black tracking-tight ${color} group-hover:scale-105 transition-transform origin-left select-none`}>
        {value}
      </p>
    </div>
  );
}
