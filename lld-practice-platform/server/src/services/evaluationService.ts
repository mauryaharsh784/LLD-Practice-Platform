import { z } from "zod";
import { DesignSubmission, Evaluation, Problem } from "../types/domain";
import { mockEvaluate } from "./mockEvaluator";

const AI_PROVIDER = (process.env.AI_PROVIDER || "mock").toLowerCase();
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Strict schema the AI's JSON response must satisfy before we ever trust it.
const AiEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  dimensions: z
    .array(
      z.object({
        name: z.string().min(1),
        score: z.number().min(0).max(10),
        feedback: z.string().min(1),
      })
    )
    .min(1),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  missingConcepts: z.array(z.string()),
  nextSteps: z.array(z.string()),
});

type AiEvaluationResult = z.infer<typeof AiEvaluationSchema>;

function buildPrompt(problem: Problem, submission: DesignSubmission): string {
  return `You are grading a Low-Level Design (LLD) practice submission.

PROBLEM: ${problem.title}
Problem statement: ${problem.problemStatement}
Functional requirements:
${problem.functionalRequirements.map((r) => `- ${r}`).join("\n")}
Expected design areas:
${problem.expectedDesignAreas.map((r) => `- ${r}`).join("\n")}

LEARNER SUBMISSION
Requirements & assumptions: ${submission.requirementsAndAssumptions}

Classes:
${submission.classes
  .map((c) => `- ${c.name}: responsibility="${c.responsibility}", attributes="${c.attributes}", methods="${c.methods}"`)
  .join("\n")}

Relationships:
${submission.relationships.map((r) => `- ${r.classA} --(${r.relationshipType})--> ${r.classB}`).join("\n")}

Design explanation: ${submission.designExplanation}
Pseudocode: ${submission.pseudocode || "(none provided)"}

Score across these rubric dimensions (0-10 each): Requirement Understanding, Class Modeling,
Responsibility Assignment, Encapsulation, Relationships, Extensibility, Design Patterns,
Simplicity / Overengineering, Code Quality / Pseudocode, Overall Design Reasoning.

Respond with ONLY a JSON object, no markdown fences, no preamble, matching exactly this shape:
{
  "overallScore": number (0-100),
  "dimensions": [{ "name": string, "score": number, "feedback": string }],
  "strengths": string[],
  "improvements": string[],
  "missingConcepts": string[],
  "nextSteps": string[]
}
Feedback must reference the learner's actual class/relationship names, not generic advice.`;
}

async function callAnthropic(problem: Problem, submission: DesignSubmission): Promise<AiEvaluationResult> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY as string,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: buildPrompt(problem, submission) }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
  const text: string = (data.content || [])
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("\n");

  const cleaned = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return AiEvaluationSchema.parse(parsed);
}

/**
 * Runs evaluation for a submission. Always falls back to the deterministic
 * mock evaluator if AI is disabled, misconfigured, or fails/returns an
 * invalid shape — the learner should never see a broken evaluation.
 */
export async function evaluateSubmission(
  problem: Problem,
  submission: DesignSubmission
): Promise<Omit<Evaluation, "id" | "attemptId" | "createdAt">> {
  if (AI_PROVIDER === "anthropic" && ANTHROPIC_API_KEY) {
    try {
      const ai = await callAnthropic(problem, submission);
      return { ...ai, provider: "anthropic" };
    } catch (err) {
      console.error("AI evaluation failed, falling back to mock evaluator:", err);
      return mockEvaluate(problem, submission);
    }
  }

  // AI_PROVIDER=mock (default) or misconfigured -> deterministic mock evaluator.
  return mockEvaluate(problem, submission);
}
