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
      <body className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 font-sans">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
            <span className="text-rose-400 text-2xl font-bold">!</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Something went wrong
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              An unexpected error occurred. This has been logged and we&apos;re on it.
            </p>
            {error.digest && (
              <p className="text-zinc-600 text-xs font-mono">Error ID: {error.digest}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-sm"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-semibold py-3 px-6 rounded-xl transition text-sm"
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
