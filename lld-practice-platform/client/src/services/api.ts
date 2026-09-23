import {
  Attempt,
  DashboardMetrics,
  DesignSubmission,
  Evaluation,
  Problem,
  ProblemWithProgress,
} from "../types/domain";

const BASE = "/api";

export class ApiError extends Error {
  details?: string[];
  status: number;
  constructor(message: string, status: number, details?: string[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError("Could not reach the server. Is the API running?", 0);
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(body.error || "Request failed", response.status, body.details);
  }
  return body as T;
}

export const api = {
  listProblems: (params: { difficulty?: string; tag?: string; status?: string; q?: string } = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => !!v) as [string, string][]);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return request<{ problems: ProblemWithProgress[] }>(`/problems${suffix}`);
  },

  getProblem: (id: string) => request<{ problem: Problem; attemptsCount: number }>(`/problems/${id}`),

  listAttemptsForProblem: (id: string) =>
    request<{ attempts: (Attempt & { evaluation: Evaluation | null })[] }>(`/problems/${id}/attempts`),

  listAttempts: () =>
    request<{ attempts: (Attempt & { evaluation: Evaluation | null; problem: Problem })[] }>(`/attempts`),

  getAttempt: (id: string) =>
    request<{ attempt: Attempt; evaluation: Evaluation | null; problem: Problem }>(`/attempts/${id}`),

  createAttempt: (payload: { problemId: string; submission: DesignSubmission; status: "draft" | "submitted" }) =>
    request<{ attempt: Attempt; evaluation?: Evaluation }>(`/attempts`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateAttempt: (id: string, payload: { submission?: DesignSubmission; status?: "draft" | "submitted" }) =>
    request<{ attempt: Attempt; evaluation?: Evaluation }>(`/attempts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  getDashboard: () =>
    request<{
      metrics: DashboardMetrics;
      recentAttempts: { attempt: Attempt; evaluation: Evaluation | null; problem: Problem }[];
      recommendedProblems: Problem[];
    }>(`/dashboard`),
};
