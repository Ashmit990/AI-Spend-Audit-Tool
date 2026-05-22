'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpendForm from '@/components/SpendForm';
import {
  ShieldCheck,
  Layers,
  TrendingDown,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { AuditInput } from '@/types';

export default function Home() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAuditSubmit = async (data: AuditInput) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json.error || 'Something went wrong. Please try again.');
        return;
      }
      // If we got an auditId, navigate to the report page
      if (json.auditId) {
        router.push(`/audit/${json.auditId}`);
      } else {
        // No Supabase configured — store result in sessionStorage and redirect
        sessionStorage.setItem('audit-result', JSON.stringify(json));
        router.push('/audit/preview');
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between font-sans relative overflow-hidden">
      
      {/* 1. Ambient Background Grid & Glows (Eye-Soothing and Sleek) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.012)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none -z-20" />
      
      {/* Top Center Ambient Indigo Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_60%)] pointer-events-none -z-10" />
      
      {/* Left Ambient Emerald Savings Glow */}
      <div className="absolute top-[400px] -left-[250px] w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_70%)] pointer-events-none -z-10" />
      
      {/* Right Ambient Violet Tech Glow */}
      <div className="absolute top-[700px] -right-[250px] w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03),transparent_70%)] pointer-events-none -z-10" />

      {/* 2. Premium Navbar (Solid & Precise Border) */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-sm">
              <span className="font-extrabold text-white text-xs tracking-wider">CX</span>
            </div>
            <span className="font-bold text-white tracking-tight text-base">Credex <span className="text-zinc-500 text-sm font-normal">Spend Audit</span></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-xs text-zinc-400 hover:text-white transition font-medium">Features</a>
            <a href="#how-it-works" className="text-xs text-zinc-400 hover:text-white transition font-medium">How It Works</a>
          </nav>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-violet-400 shadow-sm">
              ⚡ Lead-Gen Engine
            </span>
          </div>
        </div>
      </header>

      {/* 3. Hero & Core Form Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-16 sm:py-24 max-w-6xl mx-auto w-full z-10">
        
        {/* Hero Title & Text */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm hover:border-zinc-700 transition">
            <span>Free Cost Audit</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-100 to-zinc-400">
            Cut Your AI Subscriptions <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-emerald-400">
              By Up To 50%
            </span>
          </h1>
          
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Enter your active team seats and developer subscriptions. Get an instant, defensible audit showing exactly where you are overpaying, duplicate licenses, and how to optimize.
          </p>
        </div>

        {/* Dynamic Spend Form */}
        <div className="w-full mb-28 relative">
          {submitting && (
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-3xl gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
              <p className="text-sm text-zinc-300 font-medium">Running your AI spend audit…</p>
            </div>
          )}
          <SpendForm onSubmit={handleAuditSubmit} />
          {submitError && (
            <p className="mt-4 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-center">
              {submitError}
            </p>
          )}
        </div>

        {/* 4. Trust/Partner Logo Proof Grid (Premium Minimalist Look) */}
        <div className="w-full text-center mb-28">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-8">
            AUDITING WORKSPACES ACROSS LEADING DESIGN & DEV TEAMS
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-40 grayscale contrast-200">
            {/* Logo 1 */}
            <div className="text-sm font-semibold tracking-wider font-mono text-white select-none">ACME.INC</div>
            {/* Logo 2 */}
            <div className="text-sm font-semibold tracking-widest font-mono text-white select-none">SUPABASE</div>
            {/* Logo 3 */}
            <div className="text-sm font-bold tracking-wider font-mono text-white select-none">LINEAR</div>
            {/* Logo 4 */}
            <div className="text-sm font-semibold tracking-wider font-mono text-white select-none">VERCEL</div>
            {/* Logo 5 */}
            <div className="text-sm font-semibold tracking-widest font-mono text-white select-none">CLERK</div>
          </div>
        </div>

        {/* 5. Features Grid Section (Solid Slate Card Styling) */}
        <div id="features" className="w-full border-t border-zinc-900 pt-20 mb-28">
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Stop Wasting Capital on AI Subscriptions</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Every month, growing startups bleed thousands on duplicate coding assistant seats, idle accounts, and unoptimized API credit structures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition duration-200 shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 mb-6">
                  <Layers className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 tracking-tight">License Overlap Detection</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Identify team members provisioned with redundant access to Cursor, GitHub Copilot, Claude, and ChatGPT simultaneously.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center text-xs text-violet-400 font-semibold">
                Instant Scan <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition duration-200 shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6">
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 tracking-tight">Tier-Level Right-Sizing</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Evaluate seat distribution and determine when to transition custom API accounts or high-rate enterprise packages to standard group plans.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center text-xs text-emerald-400 font-semibold">
                Savings Matrix <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition duration-200 shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-6">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 tracking-tight">API Key Billing Guard</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Flag usage anomalies, check token credit pricing, and establish rate limits to prevent dev servers from racking up surprise bills.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center text-xs text-indigo-400 font-semibold">
                Usage Audits <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </div>
          </div>
        </div>

        {/* 6. Step Timeline Section ("How It Works") */}
        <div id="how-it-works" className="w-full border-t border-zinc-900 pt-20 mb-20">
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">How the Spend Audit Works</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Three clean steps to uncover hidden savings and regain full visibility over your team&apos;s software expenses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                1
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">Define Your Stack</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Add your current subscriptions, plan levels, and team seat counts using our configuration panel above.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                2
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">Analyze Pricing Tiers</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Our calculation database compares your inputs against standard pricing sheets and API averages to detect overlap.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                3
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">Get Defensible Savings</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Unlock immediate steps to downgrade, clean up licenses, and pool developer credit pools to slash costs up to 50%.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* 7. Footer (Clean Slate Borders) */}
      <footer className="border-t border-zinc-900 py-8 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            &copy; 2026 Credex Inc. All rights reserved. Powered by discounted enterprise credit pooling.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition font-medium">Privacy Policy</a>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition font-medium">Terms of Service</a>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition font-medium">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
