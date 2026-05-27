'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fcfdfe] text-slate-900 flex items-center justify-center px-6 font-sans">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-20 h-20 rounded-md bg-red-50 border border-red-100 flex items-center justify-center mx-auto shadow-sm">
            <span className="text-red-500 text-3xl font-black">!</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              System Interruption
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              We encountered an unexpected error. The infrastructure has been notified.
            </p>
            {error.digest && (
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50 py-1 px-3 rounded-md inline-block">Error ID: {error.digest}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-md shadow-lg shadow-primary/20 transition-all text-sm"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-slate-900 font-bold py-4 px-8 rounded-md transition-all text-sm shadow-sm"
            >
              Back to Safety
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
