/**
 * These are the Mongoose schema definitions for the intended production data
 * model (Section 13/14 of the assignment). They are NOT imported by the app
 * by default: the app runs in DB_MODE=memory out of the box so an evaluator
 * never needs a running MongoDB instance to try the product.
 *
 * To switch to a real database:
 *   1. `npm install mongoose --save` in /server
 *   2. Set DB_MODE=mongo and MONGODB_URI in .env
 *   3. Implement a MongoRepository (src/data/repository.ts) that satisfies
 *      the same Repository interface as InMemoryRepository, using the
 *      schemas below.
 *
 * Kept here (rather than deleted) so the intended schema/relationships are
 * part of the codebase, per the assignment's data-model requirement.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
// Written as plain schema description objects (not `mongoose.Schema` instances)
// so this file has zero runtime dependency on the `mongoose` package.

export const UserSchema = {
  name: String,
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
};

export const ProblemSchema = {
  slug: { type: String, unique: true },
  title: String,
  shortDescription: String,
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
  estimatedTimeMinutes: Number,
  tags: [String],
  problemStatement: String,
  functionalRequirements: [String],
  assumptions: [String],
  expectedDesignAreas: [String],
  submissionExpectations: [String],
};

export const ClassDefinitionSchema = {
  name: String,
  responsibility: String,
  attributes: String,
  methods: String,
};

export const RelationshipSchema = {
  classA: String,
  relationshipType: {
    type: String,
    enum: ["inheritance", "composition", "aggregation", "association", "dependency"],
  },
  classB: String,
};

export const AttemptSchema = {
  userId: { type: "ObjectId", ref: "User" },
  problemId: { type: "ObjectId", ref: "Problem" },
  attemptNumber: Number,
  submission: {
    requirementsAndAssumptions: String,
    classes: [ClassDefinitionSchema],
    relationships: [RelationshipSchema],
    designExplanation: String,
    pseudocode: String,
  },
  status: { type: String, enum: ["draft", "submitted", "evaluated", "failed"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
};

export const EvaluationSchema = {
  attemptId: { type: "ObjectId", ref: "Attempt" },
  overallScore: Number,
  dimensions: [{ name: String, score: Number, feedback: String }],
  strengths: [String],
  improvements: [String],
  missingConcepts: [String],
  nextSteps: [String],
  provider: { type: String, enum: ["mock", "anthropic", "openai"] },
  createdAt: { type: Date, default: Date.now },
};
