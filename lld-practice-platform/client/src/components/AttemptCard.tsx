import { Link } from "react-router-dom";
import { Attempt, Evaluation, Problem } from "../types/domain";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./Card";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function AttemptCard({
  attempt,
  evaluation,
  problem,
}: {
  attempt: Attempt;
  evaluation: Evaluation | null;
  problem: Problem;
}) {
  const scoreTone = !evaluation ? "outline" : evaluation.overallScore >= 70 ? "moss" : evaluation.overallScore >= 45 ? "blueprint" : "clay";
  return (
    <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-ink-800">{problem.title}</p>
        <p className="text-xs text-ink-800/50">
          Attempt #{attempt.attemptNumber} · {formatDate(attempt.createdAt)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone={scoreTone as any}>
          {evaluation ? `${evaluation.overallScore}/100` : attempt.status === "draft" ? "Draft" : attempt.status}
        </Badge>
        {evaluation ? (
          <Link to={`/attempts/${attempt.id}`}>
            <Button size="sm" variant="secondary">
              View Feedback
            </Button>
          </Link>
        ) : (
          <Link to={`/practice/${problem.id}?attempt=${attempt.id}`}>
            <Button size="sm" variant="secondary">
              Resume Draft
            </Button>
          </Link>
        )}
        <Link to={`/practice/${problem.id}`}>
          <Button size="sm" variant="ghost">
            Try Again
          </Button>
        </Link>
      </div>
    </Card>
  );
}
