'use client';

import { useEffect, useState } from 'react';
import AuditReport from '@/components/AuditReport';
import { AuditResult } from '@/types';
import { Loader2 } from 'lucide-react';

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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    );
  }

  if (!auditResult) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-xl font-bold text-white">No Preview Available</h1>
          <p className="text-zinc-400 text-sm">
            No audit data found. Please run a new audit first.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-sm font-medium px-5 py-2.5 rounded-xl transition"
          >
            ← Run a new audit
          </a>
        </div>
      </div>
    );
  }

  return <AuditReport auditId={null} auditResult={auditResult} aiSummary={aiSummary} />;
}
