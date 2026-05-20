'use client';

import SpendForm from '@/components/SpendForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0f19] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-slate-100 flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-extrabold text-white text-sm tracking-tighter">CX</span>
            </div>
            <span className="font-bold text-white tracking-tight text-lg">Credex Spend Audit</span>
          </div>
          <div>
            <span className="text-xs font-semibold px-3 py-1 bg-white/[0.04] border border-white/10 rounded-full text-indigo-300">
              ⚡ Lead-Gen Edition
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
            <span>Free Cost Audit</span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
            Cut Your AI Spend <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
              By Up To 50%
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-normal">
            Enter your active team seats and subscriptions. Get an instant, defensible audit showing precisely where you are overspending and how to optimize.
          </p>
        </div>

        {/* Spend Form */}
        <div className="w-full">
          <SpendForm onSubmit={(data) => console.log('Audit submitted:', data)} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-slate-950/40">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; 2026 Credex Inc. All rights reserved. Powered by discounted enterprise credit pooling.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition">Terms of Service</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
