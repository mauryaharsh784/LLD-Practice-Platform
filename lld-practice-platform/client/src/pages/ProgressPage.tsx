import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { Card } from "../components/Card";
import { DifficultyBadge, StatusBadge } from "../components/Badge";
import { ProgressBar } from "../components/ProgressBar";

export function ProgressPage() {
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.getDashboard,
  });

  const problemsQuery = useQuery({
    queryKey: ["problems", {}],
    queryFn: () => api.listProblems(),
  });

  if (dashboardQuery.isLoading || problemsQuery.isLoading) {
    return <LoadingState label="Loading progress..." />;
  }

  if (
    dashboardQuery.isError ||
    problemsQuery.isError ||
    !dashboardQuery.data
  ) {
    return <ErrorState message="Couldn't load your progress." />;
  }

  const { metrics } = dashboardQuery.data;

  const problems = [...(problemsQuery.data?.problems ?? [])].sort(
    (a, b) => (b.lastScore ?? -1) - (a.lastScore ?? -1)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-800">
          Progress
        </h1>

        <p className="mt-1 text-sm text-ink-800/60">
          {metrics.problemsCompleted} of {problems.length} problems completed ·{" "}
          {metrics.averageScore} average score
        </p>
      </div>

      <Card className="p-0">
        <div className="divide-y divide-ink-800/8">
          {problems.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/problems/${p.id}`}
                    className="text-sm font-medium text-ink-800 hover:underline"
                  >
                    {p.title}
                  </Link>

                  <DifficultyBadge difficulty={p.difficulty} />
                </div>

                <p className="mt-0.5 text-xs text-ink-800/50">
                  {p.attemptsCount} attempt
                  {p.attemptsCount === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex items-center gap-3 sm:w-64">
                <div className="flex-1">
                  <ProgressBar
                    value={p.lastScore ?? 0}
                    max={100}
                    tone={
                      (p.lastScore ?? 0) >= 70
                        ? "moss"
                        : (p.lastScore ?? 0) >= 45
                        ? "blueprint"
                        : "clay"
                    }
                  />
                </div>

                <span className="w-10 shrink-0 text-right font-mono-data text-sm text-ink-800/70">
                  {p.lastScore ?? "—"}
                </span>

                <StatusBadge status={p.completionStatus} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}