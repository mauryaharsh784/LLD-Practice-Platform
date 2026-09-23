import { Link } from "react-router-dom";
import { ProblemWithProgress } from "../types/domain";
import { Badge, DifficultyBadge, StatusBadge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./Card";

export function ProblemCard({ problem }: { problem: ProblemWithProgress }) {
  return (
    <Card className="flex flex-col justify-between p-5">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-ink-800">{problem.title}</h3>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-800/65">{problem.shortDescription}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {problem.tags.map((t) => (
            <Badge key={t} tone="outline">
              {t}
            </Badge>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-ink-800/8 pt-3">
        <div className="flex items-center gap-2 text-xs text-ink-800/50">
          <StatusBadge status={problem.completionStatus} />
          <span>
            {problem.attemptsCount} attempt{problem.attemptsCount === 1 ? "" : "s"}
            {problem.lastScore !== null ? ` · last ${problem.lastScore}/100` : ""}
          </span>
        </div>
      </div>
      <Link to={`/problems/${problem.id}`} className="mt-4">
        <Button size="sm" className="w-full">
          {problem.attemptsCount > 0 ? "Continue Practice" : "Start Practice"}
        </Button>
      </Link>
    </Card>
  );
}
