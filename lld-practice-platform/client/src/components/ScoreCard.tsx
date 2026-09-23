export function ScoreCard({ score, label = "Overall" }: { score: number; label?: string }) {
  const tone = score >= 70 ? "text-moss" : score >= 45 ? "text-blueprint-600" : "text-clay";
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#12213D14" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            className={tone}
            strokeWidth="10"
            strokeDasharray={`${(score / 100) * 264} 264`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono-data text-2xl font-semibold text-ink-800">{score}</span>
          <span className="text-[10px] text-ink-800/50">/ 100</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-ink-800/60">{label} score</p>
        <p className={`text-sm font-medium ${tone}`}>
          {score >= 70 ? "Strong design" : score >= 45 ? "Solid start, room to grow" : "Needs another pass"}
        </p>
      </div>
    </div>
  );
}
