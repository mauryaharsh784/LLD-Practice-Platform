import { Request, Response } from "express";
import { store, DEMO_USER } from "../data/repository";

export function getDashboard(_req: Request, res: Response) {
  const attempts = store.listAttempts(DEMO_USER.id);
  const evaluated = attempts
    .map((a) => ({ attempt: a, evaluation: store.getEvaluationForAttempt(a.id) }))
    .filter((x) => x.evaluation);

  const scores = evaluated.map((x) => x.evaluation!.overallScore);
  const problemsAttempted = new Set(attempts.map((a) => a.problemId)).size;
  const problemsCompleted = new Set(
    evaluated.filter((x) => x.evaluation!.overallScore >= 70).map((x) => x.attempt.problemId)
  ).size;

  const averageScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;

  const recentAttempts = attempts.slice(0, 5).map((a) => ({
    attempt: a,
    evaluation: store.getEvaluationForAttempt(a.id) || null,
    problem: store.getProblem(a.problemId),
  }));

  const attemptedProblemIds = new Set(attempts.map((a) => a.problemId));
  const recommended = store
    .listProblems()
    .filter((p) => !attemptedProblemIds.has(p.id))
    .slice(0, 3);

  res.json({
    metrics: {
      problemsAttempted,
      problemsCompleted,
      totalAttempts: attempts.length,
      averageScore,
      bestScore,
    },
    recentAttempts,
    recommendedProblems: recommended,
  });
}
