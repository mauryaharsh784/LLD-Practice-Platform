import { ReactNode } from "react";

type Tone = "neutral" | "blueprint" | "moss" | "clay" | "outline";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-ink-800/8 text-ink-800",
  blueprint: "bg-blueprint-500/10 text-blueprint-600",
  moss: "bg-moss/10 text-moss",
  clay: "bg-clay/10 text-clay",
  outline: "border border-ink-800/15 text-ink-800/70",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: "Easy" | "Medium" | "Hard" }) {
  const tone: Tone = difficulty === "Easy" ? "moss" : difficulty === "Medium" ? "blueprint" : "clay";
  return <Badge tone={tone}>{difficulty}</Badge>;
}

export function StatusBadge({ status }: { status: "not_started" | "in_progress" | "completed" }) {
  if (status === "completed") return <Badge tone="moss">Completed</Badge>;
  if (status === "in_progress") return <Badge tone="blueprint">In progress</Badge>;
  return <Badge tone="outline">Not started</Badge>;
}
