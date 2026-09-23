import { Request, Response } from "express";
import { store, DEMO_USER } from "../data/repository";
import { ApiError } from "../middleware/errorHandler";
import { CreateAttemptInput, UpdateAttemptInput, validateSubmittable } from "../utils/validation";
import { evaluateSubmission } from "../services/evaluationService";
import { newId } from "../services/mockEvaluator";

export async function createAttempt(req: Request, res: Response) {
  const input = CreateAttemptInput.parse(req.body);
  const problem = store.getProblem(input.problemId);
  if (!problem) throw new ApiError(404, "Problem not found");

  if (input.status === "submitted") {
    const errors = validateSubmittable(input.submission);
    if (errors.length > 0) {
      return res.status(400).json({ error: "Submission incomplete", details: errors });
    }
  }

  const attempt = store.createAttempt({
    userId: DEMO_USER.id,
    problemId: problem.id,
    attemptNumber: store.nextAttemptNumber(DEMO_USER.id, problem.id),
    submission: input.submission,
    status: input.status,
  });

  if (input.status === "submitted") {
    return evaluateAndRespond(attempt.id, problem.id, res);
  }

  res.status(201).json({ attempt });
}

export function listAttempts(req: Request, res: Response) {
  const attempts = store.listAttempts(DEMO_USER.id).map((a) => ({
    ...a,
    evaluation: store.getEvaluationForAttempt(a.id) || null,
    problem: store.getProblem(a.problemId),
  }));
  res.json({ attempts });
}

export function getAttempt(req: Request, res: Response) {
  const attempt = store.getAttempt(req.params.id);
  if (!attempt) throw new ApiError(404, "Attempt not found");
  const evaluation = store.getEvaluationForAttempt(attempt.id) || null;
  const problem = store.getProblem(attempt.problemId);
  res.json({ attempt, evaluation, problem });
}

export async function updateAttempt(req: Request, res: Response) {
  const attempt = store.getAttempt(req.params.id);
  if (!attempt) throw new ApiError(404, "Attempt not found");
  if (attempt.status !== "draft") {
    throw new ApiError(400, "Only draft attempts can be edited. Start a new attempt instead.");
  }

  const input = UpdateAttemptInput.parse(req.body);
  const nextStatus = input.status ?? attempt.status;

  if (nextStatus === "submitted") {
    const submission = input.submission ?? attempt.submission;
    const errors = validateSubmittable(submission);
    if (errors.length > 0) {
      return res.status(400).json({ error: "Submission incomplete", details: errors });
    }
  }

  const updated = store.updateAttempt(attempt.id, {
    submission: input.submission ?? attempt.submission,
    status: nextStatus,
  })!;

  if (nextStatus === "submitted") {
    return evaluateAndRespond(updated.id, updated.problemId, res);
  }

  res.json({ attempt: updated });
}

export async function evaluateAttempt(req: Request, res: Response) {
  const attempt = store.getAttempt(req.params.id);
  if (!attempt) throw new ApiError(404, "Attempt not found");
  await evaluateAndRespond(attempt.id, attempt.problemId, res);
}

async function evaluateAndRespond(attemptId: string, problemId: string, res: Response) {
  const problem = store.getProblem(problemId)!;
  const attempt = store.getAttempt(attemptId)!;

  try {
    const result = await evaluateSubmission(problem, attempt.submission);
    const evaluation = store.saveEvaluation({
      ...result,
      id: newId("eval"),
      attemptId: attempt.id,
      createdAt: new Date().toISOString(),
    });
    const updated = store.updateAttempt(attempt.id, { status: "evaluated" })!;
    res.status(200).json({ attempt: updated, evaluation });
  } catch (err) {
    store.updateAttempt(attempt.id, { status: "failed" });
    console.error("Evaluation failed:", err);
    res.status(502).json({ error: "Evaluation failed. Please try submitting again." });
  }
}
