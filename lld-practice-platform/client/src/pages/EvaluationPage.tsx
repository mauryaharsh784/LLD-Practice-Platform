import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ScoreCard } from "../components/ScoreCard";
import { ProgressBar } from "../components/ProgressBar";
import { Badge } from "../components/Badge";

export function EvaluationPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["attempt", id],
    queryFn: () => api.getAttempt(id!),
    enabled: !!id,
  });

  const historyQuery = useQuery({
    queryKey: ["problem-attempts", data?.problem.id],
    queryFn: () => api.listAttemptsForProblem(data!.problem.id),
    enabled: !!data?.problem.id,
  });

  if (isLoading) return <LoadingState label="Loading evaluation..." />;
  if (isError || !data) return <ErrorState message="Couldn't load this attempt." onRetry={() => refetch()} />;

  const { attempt, evaluation, problem } = data;

  if (!evaluation) {
    return (
      <div className="mx-auto max-w-2xl">
        <ErrorState message="This attempt hasn't been evaluated yet." />
      </div>
    );
  }

  const priorAttempts = (historyQuery.data?.attempts ?? [])
    .filter((a) => a.id !== attempt.id && a.evaluation)
    .sort((a, b) => a.attemptNumber - b.attemptNumber);
  const previous = priorAttempts.filter((a) => a.attemptNumber < attempt.attemptNumber).at(-1);
  const delta = previous?.evaluation ? evaluation.overallScore - previous.evaluation.overallScore : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to={`/problems/${problem.id}`} className="text-xs font-medium text-blueprint-600 hover:underline">
          ← {problem.title}
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-ink-800">
          Evaluation — Attempt #{attempt.attemptNumber}
        </h1>
      </div>

      <Card className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <ScoreCard score={evaluation.overallScore} />
        <div className="flex flex-col items-start gap-2 sm:items-end">
          {delta !== null && (
            <Badge tone={delta > 0 ? "moss" : delta < 0 ? "clay" : "outline"}>
              {delta > 0 ? `+${delta}` : delta} vs. attempt #{previous!.attemptNumber}
            </Badge>
          )}
          <Badge tone="outline">Evaluated by: {evaluation.provider === "mock" ? "Rubric engine" : evaluation.provider}</Badge>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink-800">Rubric breakdown</h2>
        <div className="mt-4 space-y-4">
          {evaluation.dimensions.map((d) => (
            <div key={d.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-ink-800">{d.name}</span>
                <span className="font-mono-data text-ink-800/60">{d.score}/10</span>
              </div>
              <div className="mt-1.5">
                <ProgressBar value={d.score} tone={d.score >= 7 ? "moss" : d.score >= 4 ? "blueprint" : "clay"} />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-800/65">{d.feedback}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-moss">✓ What you did well</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-800/70">
          {evaluation.strengths.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-clay">⚠ What needs improvement</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-800/70">
          {evaluation.improvements.length > 0 ? (
            evaluation.improvements.map((s, i) => <li key={i}>{s}</li>)
          ) : (
            <li>No major gaps flagged in this attempt.</li>
          )}
        </ul>
      </Card>

      {evaluation.missingConcepts.length > 0 && (
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-800">Missing concepts</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {evaluation.missingConcepts.map((c, i) => (
              <Badge key={i} tone="clay">
                {c}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink-800">Recommended next steps</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-800/70">
          {evaluation.nextSteps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </Card>

      <div className="flex items-center justify-between pb-6">
        <Link to="/attempts" className="text-xs font-medium text-blueprint-600 hover:underline">
          View all attempts
        </Link>
        <Link to={`/practice/${problem.id}`}>
          <Button>Try Again</Button>
        </Link>
      </div>
    </div>
  );
}
