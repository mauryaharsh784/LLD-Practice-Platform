export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-800/60">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink-800/20 border-t-blueprint-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-ink-800/8 ${className}`} />;
}
