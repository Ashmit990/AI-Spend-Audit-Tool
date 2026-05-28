'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpendForm from '@/components/SpendForm';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Layers,
  TrendingDown,
  ArrowRight,
  Loader2,
  Calculator,
  Mail,
  Zap,
  Sparkles,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { AuditInput } from '@/types';
import { motion } from 'framer-motion';

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
      if (json.auditId) {
        router.push(`/audit/${json.auditId}`);
      } else {
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
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 flex flex-col font-sans relative selection:bg-slate-900 selection:text-white overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 right-0 w-[1000px] h-[600px] bg-slate-200/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-50/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
      </div>

      {/* Navigation */}
      <header className="border-b-2 border-slate-200 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-2xl shadow-slate-900/20">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight block leading-none text-slate-900">Credex</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 block">Audit Engine</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-10">
            <a href="#how-it-works" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Methodology</a>
            <a href="#features" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Benchmarks</a>
            <a href="#pricing" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-6">
            <button className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Log in</button>
            <button 
              onClick={() => {
                const element = document.getElementById('audit-form');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black uppercase tracking-[0.15em] px-6 py-3 rounded-lg transition-all shadow-xl shadow-slate-900/10 active:scale-95 border-2 border-slate-900"
            >
              Start Audit
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow z-10">
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-32">
          <div className="flex flex-col gap-20">
            
            {/* Split Hero: Text Left, Image Right */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mx-auto lg:mx-0">
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                  <span>Enterprise Grade AI Analysis</span>
                </div>
                
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900">
                  Stop <span className="text-slate-200">Leakage.</span> <br />
                  Save 40%.
                </h1>
                
                <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Most startups overspend on AI by 35-50% due to seat redundancy and inefficient token usage. Credex audits your stack in seconds.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-2 text-slate-400">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-900">No API Keys Required</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200 hidden sm:block" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-900">Instant Result</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="relative hidden lg:block"
              >
                <div className="relative rounded-[2.5rem] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/ai-assistant.png" 
                    alt="Credex AI Assistant"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Decorative Elements for the image */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/5 blur-3xl -z-10 animate-pulse" />
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/5 blur-3xl -z-10 animate-pulse" />
              </motion.div>
            </div>

            {/* Downside: Audit Console */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="relative">
                {/* Visual Accent */}
                <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent blur-3xl -z-10 rounded-[4rem]" />
                
                <div className="text-center mb-10">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Configure Your Audit</h2>
                  <p className="font-black text-3xl tracking-tight text-slate-900">Interactive Spend Controller</p>
                </div>

                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3 max-w-md mx-auto">
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">!</span>
                    {submitError}
                  </div>
                )}
                
                <div id="audit-form" className="relative group mx-auto">
                  {submitting && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl">
                      <div className="w-16 h-16 relative">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                        <div className="absolute inset-0 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-slate-900 animate-pulse">Analyzing Stack...</p>
                    </div>
                  )}
                  <SpendForm onSubmit={handleAuditSubmit} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Logo Cloud */}
        <div className="pb-32 w-full">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-center text-slate-300 mb-12">
            AUDITING WORKSPACES ACROSS LEADING TEAMS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10 opacity-30 grayscale contrast-125">
             <span className="text-xl font-black tracking-tighter text-slate-900">ACME.INC</span>
             <span className="text-xl font-black tracking-tighter text-slate-900">SUPABASE</span>
             <span className="text-xl font-black tracking-tighter text-slate-900">LINEAR</span>
             <span className="text-xl font-black tracking-tighter text-slate-900">VERCEL</span>
             <span className="text-xl font-black tracking-tighter text-slate-900">CLERK</span>
          </div>
        </div>

        {/* Methodology Section */}
        <section id="how-it-works" className="py-32 border-t-2 border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Our Methodology</h2>
                <h3 className="text-5xl font-black tracking-tighter text-slate-900 leading-tight">
                  Data-driven audits for the <br /> 
                  <span className="text-slate-300">Efficiency Era.</span>
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  We don't just guess. Credex cross-references your seat counts against the industry's largest database of startup SaaS contracts.
                </p>
                <div className="space-y-4">
                  {[
                    "AI-powered redundancy detection",
                    "Real-time seat overlap analysis",
                    "Tier-based pricing optimization"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-black text-slate-700 tracking-tight uppercase">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-slate-900/5 rounded-[3rem] blur-2xl group-hover:bg-slate-900/10 transition-colors" />
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
                  alt="Methodology"
                  className="relative rounded-[2rem] border-2 border-slate-200 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benchmarks Section */}
        <section id="features" className="py-32 bg-slate-900 text-white rounded-[4rem] mx-6 mb-32 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1e293b,transparent)] opacity-50" />
          <div className="max-w-7xl mx-auto px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" 
                  alt="Benchmarks"
                  className="rounded-[2rem] border-2 border-white/10 shadow-2xl opacity-80"
                />
              </div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-10 order-1 lg:order-2"
              >
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Industry Benchmarks</h2>
                <h3 className="text-5xl font-black tracking-tighter leading-tight">
                  See where you stand <br />
                  <span className="text-slate-500">against the best.</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <span className="text-4xl font-black tracking-tighter">4.2x</span>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Avg. Seat Bloat</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-4xl font-black tracking-tighter text-emerald-400">$12k</span>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Annual Waste</p>
                  </div>
                </div>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                  Our benchmarks are refreshed daily, analyzing over 10,000 active AI subscriptions across Series A-E companies.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section Placeholder (Expanding Trust Section) */}
        <section id="pricing" className="bg-slate-50 border-y-2 border-slate-100 py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Pricing Strategy</h2>
              <p className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900">Why founders choose Credex</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-16">
              <div className="space-y-6 group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:-translate-y-2 border-2 border-slate-100">
                  <Calculator className="w-7 h-7" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-slate-900">Deep Benchmarking</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    We compare your spend against real anonymized data from 500+ YC and VC-backed startups.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6 group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:-translate-y-2 border-2 border-slate-100">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-slate-900">Privacy First</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Your data is never sold. We only store anonymized metrics to improve our audit engine.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6 group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:-translate-y-2 border-2 border-slate-100">
                  <Search className="w-7 h-7" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-slate-900">Redundancy Detection</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Instantly find overlapping seats between Cursor, Copilot, and Claude.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
