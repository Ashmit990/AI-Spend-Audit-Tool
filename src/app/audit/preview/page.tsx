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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!auditResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-card border border-border p-10 rounded-md text-center shadow-xl shadow-primary/5">
          <h1 className="text-2xl font-black text-foreground mb-4">No Preview Available</h1>
          <p className="text-foreground/50 text-base font-medium mb-8">
            No audit data found in this session. Please initiate a new scan.
          </p>
          <a
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-black px-6 py-4 rounded-md shadow-lg shadow-primary/20 transition-all duration-200"
          >
            ← Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <AuditReport auditId={null} auditResult={auditResult} aiSummary={aiSummary} />;
}
