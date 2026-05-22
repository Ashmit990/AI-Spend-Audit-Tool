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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
          <p className="text-sm font-medium">Loading your audit report…</p>
        </div>
      </div>
    );
  }

  if (error || !auditResult) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
            <span className="text-rose-400 text-xl">!</span>
          </div>
          <h1 className="text-xl font-bold text-white">Audit Not Found</h1>
          <p className="text-zinc-400 text-sm">{error ?? 'This audit report does not exist or may have expired.'}</p>
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

  return <AuditReport auditId={id} auditResult={auditResult} aiSummary={aiSummary} />;
}
