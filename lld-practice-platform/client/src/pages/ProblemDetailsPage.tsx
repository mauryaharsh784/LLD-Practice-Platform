import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { DifficultyBadge, Badge } from "../components/Badge";

export function ProblemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["problem", id],
    queryFn: () => api.getProblem(id!),
    enabled: !!id,
  });

  if (isLoading) return <LoadingState label="Loading problem..." />;
  if (isError || !data) return <ErrorState message="Couldn't load this problem." onRetry={() => refetch()} />;

  const { problem, attemptsCount } = data;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to="/problems" className="text-xs font-medium text-blueprint-600 hover:underline">
          ← Back to Problem Library
        </Link>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-ink-800">{problem.title}</h1>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <p className="mt-1 text-sm text-ink-800/55">
          ~{problem.estimatedTimeMinutes} min · {problem.tags.join(", ")}
        </p>
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink-800">Problem statement</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-800/75">{problem.problemStatement}</p>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink-800">Functional requirements</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-800/75">
          {problem.functionalRequirements.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink-800">Assumptions you can make</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-800/75">
          {problem.assumptions.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink-800">Expected design areas</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {problem.expectedDesignAreas.map((a, i) => (
            <Badge key={i} tone="blueprint">
              {a}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink-800">What your submission should include</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-800/75">
          {problem.submissionExpectations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </Card>

      <div className="flex items-center justify-between rounded-lg border border-blueprint-500/20 bg-blueprint-500/5 p-4">
        <p className="text-sm text-ink-800/70">
          {attemptsCount > 0
            ? `You've attempted this ${attemptsCount} time${attemptsCount === 1 ? "" : "s"} before.`
            : "You haven't attempted this problem yet."}
        </p>
        <Button onClick={() => navigate(`/practice/${problem.id}`)}>
          {attemptsCount > 0 ? "Practice Again" : "Start Practice"}
        </Button>
      </div>
    </div>
  );
}
