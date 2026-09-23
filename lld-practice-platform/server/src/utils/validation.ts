import { z } from "zod";
import { DesignSubmission } from "../types/domain";

export const ClassDefinitionInput = z.object({
  id: z.string().optional(),
  name: z.string().default(""),
  responsibility: z.string().default(""),
  attributes: z.string().default(""),
  methods: z.string().default(""),
});

export const RelationshipInput = z.object({
  id: z.string().optional(),
  classA: z.string().default(""),
  relationshipType: z.enum(["inheritance", "composition", "aggregation", "association", "dependency"]),
  classB: z.string().default(""),
});

export const DesignSubmissionInput = z.object({
  requirementsAndAssumptions: z.string().default(""),
  classes: z.array(ClassDefinitionInput).default([]),
  relationships: z.array(RelationshipInput).default([]),
  designExplanation: z.string().default(""),
  pseudocode: z.string().nullable().optional().default(""),
});

export const CreateAttemptInput = z.object({
  problemId: z.string().min(1, "problemId is required"),
  submission: DesignSubmissionInput,
  status: z.enum(["draft", "submitted"]).default("draft"),
});

export const UpdateAttemptInput = z.object({
  submission: DesignSubmissionInput.optional(),
  status: z.enum(["draft", "submitted"]).optional(),
});

/**
 * Minimum bar for a "submit for evaluation" action (Section 7): the learner
 * must have at least attempted requirements, one class, and an explanation.
 * Drafts can be saved with anything (or nothing) filled in.
 */
export function validateSubmittable(submission: DesignSubmission): string[] {
  const errors: string[] = [];
  if (!submission.requirementsAndAssumptions.trim()) {
    errors.push("Add at least a short note on requirements & assumptions before submitting.");
  }
  if (submission.classes.filter((c) => c.name.trim()).length === 0) {
    errors.push("Add at least one class before submitting.");
  }
  if (!submission.designExplanation.trim()) {
    errors.push("Add a design explanation before submitting.");
  }
  return errors;
}
