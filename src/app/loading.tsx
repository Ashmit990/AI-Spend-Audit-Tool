export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        {/* Spinner ring */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
        </div>
        <p className="text-zinc-500 text-sm font-medium tracking-wide animate-pulse">
          Loading…
        </p>
      </div>
    </div>
  );
}
