// Core domain types shared across the server.
// These mirror the data model described in docs/PRODUCT_DECISIONS.md.

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  difficulty: Difficulty;
  estimatedTimeMinutes: number;
  tags: string[];
  problemStatement: string;
  functionalRequirements: string[];
  assumptions: string[];
  expectedDesignAreas: string[];
  submissionExpectations: string[];
}

export type RelationshipType =
  | "inheritance"
  | "composition"
  | "aggregation"
  | "association"
  | "dependency";

export interface ClassDefinition {
  id?: string;
  name: string;
  responsibility: string;
  attributes: string; // free text, one per line
  methods: string; // free text, one per line
}

export interface RelationshipDefinition {
  id?: string;
  classA: string;
  relationshipType: RelationshipType;
  classB: string;
}

export interface DesignSubmission {
  requirementsAndAssumptions: string;
  classes: ClassDefinition[];
  relationships: RelationshipDefinition[];
  designExplanation: string;
  pseudocode?: string | null;
}

export type AttemptStatus = "draft" | "submitted" | "evaluated" | "failed";

export interface Attempt {
  id: string;
  userId: string;
  problemId: string;
  attemptNumber: number;
  submission: DesignSubmission;
  status: AttemptStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RubricDimension {
  name: string;
  score: number; // 0-10
  feedback: string;
}

export interface Evaluation {
  id: string;
  attemptId: string;
  overallScore: number; // 0-100
  dimensions: RubricDimension[];
  strengths: string[];
  improvements: string[];
  missingConcepts: string[];
  nextSteps: string[];
  provider: "mock" | "anthropic" | "openai";
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
