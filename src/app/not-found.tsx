'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 font-sans">
      {/* Ambient glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.07),transparent_60%)] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6">
        {/* Number */}
        <div className="relative inline-block">
          <span className="text-[9rem] font-extrabold text-zinc-900 select-none leading-none">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[9rem] font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-zinc-600 to-zinc-800 select-none leading-none">
            404
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">Page not found</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            If you had an audit link, it may have expired.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-violet-950/40 transition-all duration-200 text-sm"
          >
            Run a New Audit
          </Link>
          <Link
            href="/#how-it-works"
            className="inline-flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-semibold py-3 px-6 rounded-xl transition text-sm"
          >
            How It Works
          </Link>
        </div>
      </div>
    </div>
  );
}
