export function ProgressBar({ value, max = 10, tone = "blueprint" }: { value: number; max?: number; tone?: "blueprint" | "moss" | "clay" }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color = tone === "moss" ? "bg-moss" : tone === "clay" ? "bg-clay" : "bg-blueprint-500";
  return (
    <div className="h-2 w-full rounded-full bg-ink-800/8">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
