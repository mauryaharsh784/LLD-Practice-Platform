import { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-ink-800/15 bg-white/50 px-6 py-14 text-center">
      <p className="font-medium text-ink-800">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ink-800/60">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
