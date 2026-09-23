import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Card } from "../components/Card";
import { LoadingState, SkeletonBlock } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { Button } from "../components/Button";
import { DifficultyBadge } from "../components/Badge";

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-800/45">{label}</p>
      <p className="mt-1 font-mono-data text-2xl font-semibold text-ink-800">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-800/45">{sub}</p>}
    </Card>
  );
}

export function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonBlock className="h-8 w-64" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState message="Couldn't load your dashboard." onRetry={() => refetch()} />;
  }

  const { metrics, recentAttempts, recommendedProblems } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-ink-800">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-800/60">
          Practice → Feedback → Improve → Retry. Here's where you stand.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <MetricCard label="Problems attempted" value={metrics.problemsAttempted} />
        <MetricCard label="Problems completed" value={metrics.problemsCompleted} />
        <MetricCard label="Total attempts" value={metrics.totalAttempts} />
        <MetricCard label="Average score" value={`${metrics.averageScore}`} sub="out of 100" />
        <MetricCard label="Best score" value={`${metrics.bestScore}`} sub="out of 100" />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-800">Recent activity</h2>
          <Link to="/attempts" className="text-xs font-medium text-blueprint-600 hover:underline">
            View all attempts
          </Link>
        </div>
        {recentAttempts.length === 0 ? (
          <EmptyState
            title="No attempts yet"
            description="Pick a problem from the library and submit your first design to see activity here."
            action={
              <Link to="/problems">
                <Button size="sm">Browse problems</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-2">
            {recentAttempts.map(({ attempt, evaluation, problem }) => (
              <Card key={attempt.id} className="flex items-center justify-between p-3.5">
                <div>
                  <p className="text-sm font-medium text-ink-800">{problem.title}</p>
                  <p className="text-xs text-ink-800/50">Attempt #{attempt.attemptNumber}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono-data text-sm text-ink-800/70">
                    {evaluation ? `${evaluation.overallScore}/100` : "Draft"}
                  </span>
                  <Link to={evaluation ? `/attempts/${attempt.id}` : `/practice/${problem.id}?attempt=${attempt.id}`}>
                    <Button size="sm" variant="secondary">
                      {evaluation ? "View" : "Resume"}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink-800">Recommended practice</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {recommendedProblems.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink-800">{p.title}</p>
                <DifficultyBadge difficulty={p.difficulty} />
              </div>
              <p className="mt-1.5 text-xs text-ink-800/55">{p.shortDescription}</p>
              <Link to={`/problems/${p.id}`} className="mt-3 block">
                <Button size="sm" variant="secondary" className="w-full">
                  Start Practice
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
