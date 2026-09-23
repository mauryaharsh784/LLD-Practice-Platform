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

export interface ProblemWithProgress extends Problem {
  attemptsCount: number;
  completionStatus: "not_started" | "in_progress" | "completed";
  lastAttemptStatus: AttemptStatus | null;
  lastScore: number | null;
}

export type RelationshipType = "inheritance" | "composition" | "aggregation" | "association" | "dependency";

export interface ClassDefinition {
  id: string;
  name: string;
  responsibility: string;
  attributes: string;
  methods: string;
}

export interface RelationshipDefinition {
  id: string;
  classA: string;
  relationshipType: RelationshipType;
  classB: string;
}

export interface DesignSubmission {
  requirementsAndAssumptions: string;
  classes: ClassDefinition[];
  relationships: RelationshipDefinition[];
  designExplanation: string;
  pseudocode?: string;
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
  score: number;
  feedback: string;
}

export interface Evaluation {
  id: string;
  attemptId: string;
  overallScore: number;
  dimensions: RubricDimension[];
  strengths: string[];
  improvements: string[];
  missingConcepts: string[];
  nextSteps: string[];
  provider: "mock" | "anthropic" | "openai";
  createdAt: string;
}

export interface DashboardMetrics {
  problemsAttempted: number;
  problemsCompleted: number;
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
}
