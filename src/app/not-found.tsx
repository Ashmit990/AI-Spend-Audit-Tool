'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 flex items-center justify-center px-6 font-sans">
      <div className="max-w-md w-full text-center space-y-10">
        <div className="relative inline-block">
          <span className="text-[9rem] font-black text-slate-50 select-none leading-none tracking-tighter">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-7xl font-black text-slate-900 select-none leading-none tracking-tighter">
            Lost
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Page not found</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-md shadow-lg shadow-primary/20 transition-all text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
