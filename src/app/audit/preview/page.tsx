'use client';

import { useEffect, useState } from 'react';
import AuditReport from '@/components/AuditReport';
import { AuditResult } from '@/types';

export default function AuditPreviewPage() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('audit-result');
      if (raw) {
        const parsed = JSON.parse(raw);
        setAuditResult(parsed.auditResult);
        setAiSummary(parsed.aiSummary ?? '');
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!auditResult) {
    return (
      <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center px-6">
        <div className="max-w-md w-full glass-panel p-10 text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">No Preview Available</h1>
          <p className="text-slate-500 text-base font-medium mb-8 leading-relaxed">
            No audit data found in this session. Please initiate a new scan.
          </p>
          <a
            href="/"
            className="w-full btn-primary inline-flex items-center justify-center"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-20 px-6">
      <div className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="font-black text-white text-[8px] tracking-tighter">CX</span>
          </div>
          <span className="font-black text-sm tracking-tight text-slate-900">Credex Preview</span>
        </a>
      </div>
      <AuditReport auditId={null} auditResult={auditResult} aiSummary={aiSummary} />
    </div>
  );
}
