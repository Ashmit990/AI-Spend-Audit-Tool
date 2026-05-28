'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AuditReport from '@/components/AuditReport';
import Footer from '@/components/Footer';
import { AuditResult } from '@/types';
import { Loader2, Zap } from 'lucide-react';

export default function AuditPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    const fetchAudit = async () => {
      try {
        const res = await fetch(`/api/audit/${id}`);
        if (!res.ok) {
          const json = await res.json();
          setError(json.error || 'Failed to load audit.');
          return;
        }
        const json = await res.json();
        setAuditResult(json.auditResult);
        setAiSummary(json.aiSummary ?? '');
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Accessing Audit Intelligence…</p>
        </div>
      </div>
    );
  }

  if (error || !auditResult) {
    return (
      <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center px-6">
        <div className="max-w-md w-full glass-panel p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-2xl font-black">!</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">Report Unavailable</h1>
          <p className="text-slate-500 text-base font-medium mb-8 leading-relaxed">{error ?? 'This audit report does not exist or may have expired.'}</p>
          <a
            href="/"
            className="w-full btn-primary inline-flex items-center justify-center gap-2"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex flex-col">
      <div className="flex-grow px-6">
        <div className="max-w-4xl mx-auto py-10 flex items-center justify-between border-b border-slate-100 mb-10">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight text-slate-900">Credex Audit</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Intelligence Platform</span>
            </div>
          </a>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Live</span>
          </div>
        </div>
        <AuditReport auditId={id} auditResult={auditResult} aiSummary={aiSummary} />
      </div>
      <Footer />
    </div>
  );
}
