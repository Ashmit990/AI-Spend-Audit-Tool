import React from 'react';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 border-t-2 border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 pb-12 border-b-2 border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight block leading-none text-slate-900">Credex</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 block">Audit Engine</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Security Audit</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Twitter</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">LinkedIn</a>
          </div>
        </div>
        
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black tracking-widest text-slate-300 uppercase">© 2026 Credex HQ. Built for the efficiency era.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">System Status: Optimal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}