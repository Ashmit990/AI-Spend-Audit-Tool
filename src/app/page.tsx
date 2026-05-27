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
  Sparkles,
  Calculator,
  Mail,
  Zap,
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
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 flex flex-col font-sans relative selection:bg-primary/10 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-20" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[100px] -z-10 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Navigation */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-black text-white text-[10px] tracking-tighter">CX</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block leading-none text-slate-900">Credex</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit Engine</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-10">
            <a href="#how-it-works" className="text-sm text-slate-600 hover:text-primary transition font-semibold">How It Works</a>
            <a href="#features" className="text-sm text-slate-600 hover:text-primary transition font-semibold">Features</a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-primary transition font-semibold">Pricing</a>
          </nav>

          <div className="flex items-center gap-5">
            <button className="hidden sm:block text-sm font-bold text-slate-600 hover:text-primary transition">Log in</button>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-6 py-2.5 rounded-md transition-all shadow-lg shadow-slate-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Configurator Section */}
      <main id="audit-configurator" className="flex-grow max-w-7xl mx-auto w-full px-6 pt-10 pb-12 lg:pt-16 lg:pb-24 z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Hero Content */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 fill-primary" />
              <span>Now in Public Beta</span>
            </div>
            
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.85] text-slate-900">
              Recapture <br />
              <span className="text-primary italic">AI Capital</span>
            </h1>
            
            <p className="text-slate-500 text-xl sm:text-2xl max-w-xl font-medium leading-relaxed">
              Most startups overspend on AI by 30-50%. Our audit identifies seat redundancy and API waste in under 60 seconds.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-5 py-3.5 rounded-md shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                No login required
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-5 py-3.5 rounded-md shadow-sm">
                <Layers className="w-5 h-5 text-blue-500" />
                8+ Tools Supported
              </div>
            </div>
            
            <div className="pt-8 flex items-center gap-4 text-slate-400">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover grayscale" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold tracking-tight">Joined by 400+ finance teams</p>
            </div>
          </div>

          {/* Configurator Card */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-blue-400 rounded-md blur opacity-20 -z-10" />
            <div className="bg-white border border-slate-200 rounded-md shadow-2xl shadow-primary/5 overflow-hidden transition-all duration-500">
              <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                <h2 className="text-xl font-black flex items-center gap-2 text-slate-900 tracking-tight">
                  <Calculator className="w-5 h-5 text-primary" />
                  Audit Configurator
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">Configure your current AI infrastructure</p>
              </div>
              
              <div className="p-8 relative">
                {submitting && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-lg font-black tracking-tight">Analyzing Spend Patterns...</p>
                  </div>
                )}
                <SpendForm onSubmit={handleAuditSubmit} />
                {submitError && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm font-bold flex gap-3">
                    <div className="w-5 h-5 rounded-md bg-red-100 flex items-center justify-center shrink-0">!</div>
                    {submitError}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Logo Cloud */}
        <div className="mt-32 w-full">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center text-slate-300 mb-12">
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
      </main>

      {/* Methodology Section */}
      <section id="how-it-works" className="w-full bg-white py-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900">Simple, Defensible Insight</h2>
            <p className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed">
              Managing a modern AI stack is complex. We simplify it by analyzing three core vectors of waste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 relative">
             {/* Connector line for desktop */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-px bg-slate-100 -z-0" />
            
            {[
              { step: "01", title: "List Your Tools", desc: "Select the AI tools your team uses daily, from coding assistants to raw LLM platform access." },
              { step: "02", title: "Analyze Redundancy", desc: "Our engine cross-references capabilities to find overlapping seats and unoptimized tiers." },
              { step: "03", title: "Recapture Capital", desc: "Get an actionable implementation guide with specific steps to reduce spend by 30%." }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 group">
                <div className="w-20 h-20 rounded-md bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-center text-3xl font-black text-primary group-hover:scale-110 transition-all duration-300 mb-8">
                  {item.step}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Detail Grid */}
      <section id="features" className="w-full bg-slate-50 py-32 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl text-left mb-20 space-y-6">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 leading-[0.9]">Built for Growth Teams</h2>
            <p className="text-slate-500 text-xl leading-relaxed font-medium">
              Every month, growing startups bleed thousands on duplicate coding assistant seats and unoptimized API structures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-white border border-slate-200 rounded-md shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 border-b-primary">
              <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center mb-10 border border-primary/20">
                <Layers className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Overlap Detection</h3>
              <p className="text-slate-500 text-base leading-relaxed font-medium mb-8">
                Identify team members provisioned with redundant access to Cursor, GitHub Copilot, Claude, and ChatGPT simultaneously.
              </p>
              <div className="flex items-center text-xs font-black text-primary uppercase tracking-widest gap-2">
                Learn More <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="p-10 bg-white border border-slate-200 rounded-md shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 border-b-emerald-500">
              <div className="w-14 h-14 rounded-md bg-emerald-500/10 flex items-center justify-center mb-10 border border-emerald-500/20">
                <TrendingDown className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Tier-Level Resizing</h3>
              <p className="text-slate-500 text-base leading-relaxed font-medium mb-8">
                Evaluate seat distribution and determine when to transition custom API accounts to standard group plans.
              </p>
              <div className="flex items-center text-xs font-black text-emerald-600 uppercase tracking-widest gap-2">
                View Matrix <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="p-10 bg-white border border-slate-200 rounded-md shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 border-b-blue-500">
              <div className="w-14 h-14 rounded-md bg-blue-500/10 flex items-center justify-center mb-10 border border-blue-500/20">
                <ShieldCheck className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Defensible Reports</h3>
              <p className="text-slate-500 text-base leading-relaxed font-medium mb-8">
                Export board-ready implementation guides that prove your efficiency gains with hard data, not estimates.
              </p>
              <div className="flex items-center text-xs font-black text-blue-600 uppercase tracking-widest gap-2">
                Download Sample <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-md p-12 sm:p-20 relative overflow-hidden text-center sm:text-left">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-6 leading-none">
                Ready to cut your <br />
                <span className="text-primary">AI spend by 30%?</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium mb-10">
                Join 400+ forward-thinking teams using Credex to audit their AI infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('audit-configurator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-primary hover:bg-primary/90 text-white text-sm font-black px-10 py-5 rounded-md shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  Generate Audit Now <ArrowRight className="w-5 h-5" />
                </button>
                <a 
                  href="mailto:demo@credex.ai"
                  className="bg-white/10 hover:bg-white/20 text-white text-sm font-black px-10 py-5 rounded-md transition-all border border-white/10 flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" /> Get Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
                  <span className="font-black text-white text-[8px] tracking-tighter">CX</span>
                </div>
                <span className="font-bold text-slate-900 text-xl tracking-tight">Credex</span>
              </div>
              <p className="text-slate-400 text-sm font-medium max-w-xs leading-relaxed">
                The definitive platform for AI spend auditing and infrastructure efficiency for modern teams.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 lg:gap-24">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm font-semibold text-slate-400 hover:text-primary transition">Features</a></li>
                  <li><a href="#" className="text-sm font-semibold text-slate-400 hover:text-primary transition">How it Works</a></li>
                  <li><a href="#" className="text-sm font-semibold text-slate-400 hover:text-primary transition">Pricing</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm font-semibold text-slate-400 hover:text-primary transition">About</a></li>
                  <li><a href="#" className="text-sm font-semibold text-slate-400 hover:text-primary transition">Privacy</a></li>
                  <li><a href="#" className="text-sm font-semibold text-slate-400 hover:text-primary transition">Terms</a></li>
                </ul>
              </div>
              <div className="space-y-4 hidden sm:block">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800">Social</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm font-semibold text-slate-400 hover:text-primary transition">Twitter</a></li>
                  <li><a href="#" className="text-sm font-semibold text-slate-400 hover:text-primary transition">LinkedIn</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} Credex Technologies. All rights reserved.
            </p>
            <div className="flex gap-6">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status: Optimal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
