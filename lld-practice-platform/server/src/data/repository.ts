import { Attempt, Evaluation, Problem, User } from "../types/domain";
import { problems as seedProblems } from "./problems";
import { newId } from "../services/mockEvaluator";

// Single demo user — see README section on Authentication for why a full
// auth system was intentionally left out of this MVP.
export const DEMO_USER: User = {
  id: "user_demo",
  name: "Demo Learner",
  email: "demo@lldpractice.dev",
  createdAt: new Date().toISOString(),
};

class InMemoryStore {
  problems: Map<string, Problem> = new Map();
  attempts: Map<string, Attempt> = new Map();
  evaluations: Map<string, Evaluation> = new Map(); // keyed by attemptId
  users: Map<string, User> = new Map();

  constructor() {
    seedProblems.forEach((p) => this.problems.set(p.id, p));
    this.users.set(DEMO_USER.id, DEMO_USER);
  }

  // ---- Problems ----
  listProblems(): Problem[] {
    return Array.from(this.problems.values());
  }

  getProblem(idOrSlug: string): Problem | undefined {
    return (
      this.problems.get(idOrSlug) ||
      Array.from(this.problems.values()).find((p) => p.slug === idOrSlug)
    );
  }

  // ---- Attempts ----
  listAttempts(userId: string): Attempt[] {
    return Array.from(this.attempts.values())
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  listAttemptsForProblem(userId: string, problemId: string): Attempt[] {
    return this.listAttempts(userId).filter((a) => a.problemId === problemId);
  }

  getAttempt(id: string): Attempt | undefined {
    return this.attempts.get(id);
  }

  nextAttemptNumber(userId: string, problemId: string): number {
    const existing = this.listAttemptsForProblem(userId, problemId);
    return existing.length + 1;
  }

  createAttempt(attempt: Omit<Attempt, "id" | "createdAt" | "updatedAt">): Attempt {
    const now = new Date().toISOString();
    const full: Attempt = { ...attempt, id: newId("attempt"), createdAt: now, updatedAt: now };
    this.attempts.set(full.id, full);
    return full;
  }

  updateAttempt(id: string, patch: Partial<Attempt>): Attempt | undefined {
    const existing = this.attempts.get(id);
    if (!existing) return undefined;
    const updated: Attempt = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    this.attempts.set(id, updated);
    return updated;
  }

  // ---- Evaluations ----
  saveEvaluation(evaluation: Evaluation): Evaluation {
    this.evaluations.set(evaluation.attemptId, evaluation);
    return evaluation;
  }

  getEvaluationForAttempt(attemptId: string): Evaluation | undefined {
    return this.evaluations.get(attemptId);
  }
}

export const store = new InMemoryStore();
