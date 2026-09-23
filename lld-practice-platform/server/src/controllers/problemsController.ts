import { Request, Response } from "express";
import { store, DEMO_USER } from "../data/repository";
import { ApiError } from "../middleware/errorHandler";

export function listProblems(req: Request, res: Response) {
  const { difficulty, tag, status, q } = req.query as Record<string, string | undefined>;
  let problems = store.listProblems();

  if (difficulty) problems = problems.filter((p) => p.difficulty === difficulty);
  if (tag) problems = problems.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
  if (q) {
    const needle = q.toLowerCase();
    problems = problems.filter(
      (p) => p.title.toLowerCase().includes(needle) || p.shortDescription.toLowerCase().includes(needle)
    );
  }

  const withProgress = problems.map((p) => {
    const attempts = store.listAttemptsForProblem(DEMO_USER.id, p.id);
    const evaluated = attempts.filter((a) => a.status === "evaluated");
    const last = attempts[0];
    const lastEval = last ? store.getEvaluationForAttempt(last.id) : undefined;
    const completed = evaluated.some((a) => {
      const ev = store.getEvaluationForAttempt(a.id);
      return ev && ev.overallScore >= 70;
    });

    return {
      ...p,
      attemptsCount: attempts.length,
      completionStatus: completed ? "completed" : attempts.length > 0 ? "in_progress" : "not_started",
      lastAttemptStatus: last ? last.status : null,
      lastScore: lastEval ? lastEval.overallScore : null,
    };
  });

  const filtered =
    status ? withProgress.filter((p) => p.completionStatus === status) : withProgress;

  res.json({ problems: filtered });
}

export function getProblem(req: Request, res: Response) {
  const problem = store.getProblem(req.params.id);
  if (!problem) throw new ApiError(404, "Problem not found");

  const attempts = store.listAttemptsForProblem(DEMO_USER.id, problem.id);
  res.json({ problem, attemptsCount: attempts.length });
}

export function listAttemptsForProblem(req: Request, res: Response) {
  const problem = store.getProblem(req.params.id);
  if (!problem) throw new ApiError(404, "Problem not found");

  const attempts = store.listAttemptsForProblem(DEMO_USER.id, problem.id).map((a) => ({
    ...a,
    evaluation: store.getEvaluationForAttempt(a.id) || null,
  }));
  res.json({ attempts });
}
