'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AuditReport from '@/components/AuditReport';
import { AuditResult } from '@/types';
import { Loader2 } from 'lucide-react';

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-foreground/40">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold tracking-tight">Accessing Audit Intelligence…</p>
        </div>
      </div>
    );
  }

  if (error || !auditResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-card border border-border p-10 rounded-md text-center shadow-xl shadow-primary/5">
          <div className="w-16 h-16 rounded-md bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-2xl font-black">!</span>
          </div>
          <h1 className="text-2xl font-black text-foreground mb-4">Report Unavailable</h1>
          <p className="text-foreground/50 text-base font-medium mb-8 leading-relaxed">{error ?? 'This audit report does not exist or may have expired.'}</p>
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

  return <AuditReport auditId={id} auditResult={auditResult} aiSummary={aiSummary} />;
}
