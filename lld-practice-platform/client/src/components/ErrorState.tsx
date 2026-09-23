import { Button } from "./Button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-clay/20 bg-clay/5 px-6 py-14 text-center">
      <p className="font-medium text-clay">Something went wrong</p>
      <p className="max-w-sm text-sm text-ink-800/60">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
