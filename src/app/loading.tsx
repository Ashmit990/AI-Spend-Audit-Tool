export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        </div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] animate-pulse">
          Initializing Engine...
        </p>
      </div>
    </div>
  );
}
