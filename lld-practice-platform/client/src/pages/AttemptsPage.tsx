import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { AttemptCard } from "../components/AttemptCard";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";

export function AttemptsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["attempts"],
    queryFn: api.listAttempts,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-800">My Attempts</h1>
        <p className="mt-1 text-sm text-ink-800/60">Every submission you've made, most recent first.</p>
      </div>

      {isLoading && <LoadingState label="Loading attempts..." />}
      {isError && <ErrorState message="Couldn't load your attempts." onRetry={() => refetch()} />}
      {data && data.attempts.length === 0 && (
        <EmptyState
          title="No attempts yet"
          description="Start with a problem from the library — your submissions and feedback will show up here."
          action={
            <Link to="/problems">
              <Button size="sm">Browse problems</Button>
            </Link>
          }
        />
      )}
      {data && data.attempts.length > 0 && (
        <div className="space-y-2">
          {data.attempts.map((a) => (
            <AttemptCard key={a.id} attempt={a} evaluation={a.evaluation} problem={a.problem} />
          ))}
        </div>
      )}
    </div>
  );
}
