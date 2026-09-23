import { DesignSubmission, Evaluation, Problem, RubricDimension } from "../types/domain";
import { nanoid } from "nanoid";

// ---- helpers -------------------------------------------------------------

function wordCount(text: string | undefined): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function containsAny(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  return keywords.filter((k) => lower.includes(k.toLowerCase()));
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function pickClassNames(submission: DesignSubmission, count: number): string[] {
  return submission.classes
    .map((c) => c.name.trim())
    .filter(Boolean)
    .slice(0, count);
}

const PATTERN_KEYWORDS = [
  "strategy",
  "factory",
  "singleton",
  "observer",
  "decorator",
  "builder",
  "adapter",
  "state pattern",
  "command",
  "template method",
  "composite",
];

const EXTENSIBILITY_KEYWORDS = [
  "interface",
  "abstract",
  "extend",
  "polymorphism",
  "plugin",
  "open/closed",
  "open closed",
  "inject",
  "strategy",
  "configurable",
];

// ---- dimension scorers ----------------------------------------------------
// Each returns a score (0-10) and a feedback string that references the
// learner's actual submission wherever possible.

function scoreRequirementUnderstanding(problem: Problem, submission: DesignSubmission): RubricDimension {
  const text = submission.requirementsAndAssumptions || "";
  const words = wordCount(text);
  const reqKeywordHits = problem.functionalRequirements
    .flatMap((r) => r.toLowerCase().split(/\W+/))
    .filter((w) => w.length > 5);
  const uniqueKeywords = Array.from(new Set(reqKeywordHits));
  const matched = uniqueKeywords.filter((k) => text.toLowerCase().includes(k));
  const coverage = uniqueKeywords.length > 0 ? matched.length / uniqueKeywords.length : 0;

  let score = clamp(Math.round(coverage * 7 + Math.min(words / 40, 1) * 3), 0, 10);

  let feedback: string;
  if (words < 15) {
    score = clamp(score, 0, 4);
    feedback =
      "The requirements & assumptions section is very thin. State explicitly which functional requirements you are addressing and call out any assumptions you're making — this is what an interviewer or reviewer reads first to judge whether your design targets the right problem.";
  } else if (score >= 7) {
    feedback =
      "You've restated the problem in your own words and captured most of the stated requirements, which gives a solid foundation for the classes that follow.";
  } else {
    feedback =
      "You've covered some of the requirements, but a few important ones from the problem statement aren't reflected in your assumptions — re-read the functional requirements list and confirm each one maps to something in your design.";
  }
  return { name: "Requirement Understanding", score, feedback };
}

function scoreClassModeling(submission: DesignSubmission): RubricDimension {
  const classes = submission.classes.filter((c) => c.name.trim());
  const n = classes.length;
  const namedWell = classes.filter((c) => /^[A-Z][A-Za-z0-9]*$/.test(c.name.trim())).length;

  let score: number;
  if (n === 0) score = 0;
  else if (n === 1) score = 3;
  else if (n >= 2 && n <= 8) score = clamp(5 + Math.min(n, 6) / 2 + (namedWell / Math.max(n, 1)) * 2, 0, 10);
  else score = clamp(8 - (n - 8) * 0.5, 3, 8); // too many classes starts to cost points

  score = Math.round(score);

  const names = pickClassNames(submission, 3);
  let feedback: string;
  if (n === 0) {
    feedback = "No classes were defined. Identify the core nouns in the problem statement and model each as a class with a single, clear responsibility.";
  } else if (n === 1) {
    feedback = `Only ${names[0] ?? "one class"} was defined. Most of these problems need several collaborating classes — look for the other nouns in the problem statement (entities that hold state or make decisions) and model them separately.`;
  } else if (names.length >= 2) {
    feedback = `You identified ${names.slice(0, -1).join(", ")} and ${names[names.length - 1]} as distinct classes, which is a reasonable decomposition of the problem's core entities. Double check each one has exactly one reason to change.`;
  } else {
    feedback = "Your class list covers the main entities. Make sure each class has exactly one responsibility rather than absorbing logic that belongs elsewhere.";
  }
  return { name: "Class Modeling", score, feedback };
}

function scoreResponsibilityAssignment(submission: DesignSubmission): RubricDimension {
  const classes = submission.classes.filter((c) => c.name.trim());
  const withResp = classes.filter((c) => wordCount(c.responsibility) >= 4);
  const distinctResponsibilities = new Set(
    classes.map((c) => c.responsibility.trim().toLowerCase()).filter(Boolean)
  );

  let score = 0;
  if (classes.length > 0) {
    const filledRatio = withResp.length / classes.length;
    const distinctRatio = classes.length > 0 ? distinctResponsibilities.size / classes.length : 0;
    score = Math.round(filledRatio * 6 + distinctRatio * 4);
  }
  score = clamp(score, 0, 10);

  let feedback: string;
  const vague = classes.find((c) => wordCount(c.responsibility) < 4 && c.name.trim());
  if (classes.length === 0) {
    feedback = "Add classes first, then give each one a one-sentence responsibility.";
  } else if (vague) {
    feedback = `${vague.name}'s responsibility is too thin to tell what it actually owns. Write it as a single sentence describing the one thing that class is responsible for, e.g. "validates and stores X" rather than a one- or two-word label.`;
  } else if (distinctResponsibilities.size < classes.length) {
    feedback =
      "A couple of your classes describe overlapping responsibilities. If two classes are responsible for the same thing, one of them is likely redundant or should be merged/split differently.";
  } else {
    feedback =
      "Responsibilities are written clearly and don't overlap — each class reads like it has a single, well-scoped job, which is exactly what the Single Responsibility Principle asks for.";
  }
  return { name: "Responsibility Assignment", score, feedback };
}

function scoreEncapsulation(submission: DesignSubmission): RubricDimension {
  const classes = submission.classes.filter((c) => c.name.trim());
  const withState = classes.filter((c) => wordCount(c.attributes) >= 1);
  const withBehavior = classes.filter((c) => wordCount(c.methods) >= 1);

  let score = 0;
  if (classes.length > 0) {
    score = Math.round(
      (withState.length / classes.length) * 5 + (withBehavior.length / classes.length) * 5
    );
  }
  score = clamp(score, 0, 10);

  let feedback: string;
  const noAttrs = classes.filter((c) => wordCount(c.attributes) === 0);
  const noMethods = classes.filter((c) => wordCount(c.methods) === 0);
  if (classes.length === 0) {
    feedback = "Define attributes and methods once you've added your classes, so it's clear what state each object owns and how it's manipulated.";
  } else if (noAttrs.length > 0 || noMethods.length > 0) {
    const culprit = noAttrs[0]?.name ?? noMethods[0]?.name;
    feedback = `${culprit} is missing ${noAttrs.length > 0 ? "attributes" : "methods"}. A class without clear state or behavior is usually a sign the responsibility hasn't been fully thought through yet, or that it belongs on a different class.`;
  } else {
    feedback =
      "Each class exposes its own attributes and methods rather than leaving state to be manipulated externally, which is good encapsulation.";
  }
  return { name: "Encapsulation", score, feedback };
}

function scoreRelationships(submission: DesignSubmission): RubricDimension {
  const classes = submission.classes.filter((c) => c.name.trim());
  const rels = submission.relationships.filter((r) => r.classA && r.classB);
  const distinctTypes = new Set(rels.map((r) => r.relationshipType));

  let score = 0;
  if (classes.length >= 2) {
    const ratio = rels.length / Math.max(classes.length - 1, 1);
    score = Math.round(clamp(ratio, 0, 1) * 6 + Math.min(distinctTypes.size, 3) * 1.3);
  } else if (rels.length > 0) {
    score = 4;
  }
  score = clamp(score, 0, 10);

  let feedback: string;
  if (rels.length === 0) {
    feedback =
      classes.length >= 2
        ? "No relationships were defined between your classes. Even a well-named set of classes needs explicit relationships (composition, association, etc.) to show how objects collaborate at runtime."
        : "Add relationships once you have at least two classes to connect.";
  } else if (distinctTypes.size === 1) {
    feedback = `All ${rels.length} relationship(s) use "${rels[0].relationshipType}". Real designs usually mix relationship types — e.g. composition for "owns and manages the lifecycle of" versus association for "uses/refers to" — check whether that distinction applies here.`;
  } else {
    const sample = rels[0];
    feedback = `The ${sample.classA} → ${sample.classB} (${sample.relationshipType}) relationship, among others, shows you're thinking about how objects are connected, not just what they are.`;
  }
  return { name: "Relationships", score, feedback };
}

function scoreExtensibility(submission: DesignSubmission): RubricDimension {
  const text = `${submission.designExplanation} ${submission.pseudocode ?? ""}`;
  const hits = containsAny(text, EXTENSIBILITY_KEYWORDS);
  const score = clamp(Math.min(hits.length, 4) * 2 + (wordCount(submission.designExplanation) > 40 ? 2 : 0), 0, 10);

  let feedback: string;
  if (hits.length === 0) {
    feedback =
      "Your explanation doesn't mention how the design would change if a new requirement showed up (a new type, a new rule, a new strategy). Pick one likely future change and explain, concretely, which class you'd add or modify — not the whole system.";
  } else {
    feedback = `You called out ${hits[0]} as a way to keep the design open to change, which is the right instinct — make sure the class diagram actually reflects that abstraction, not just the prose.`;
  }
  return { name: "Extensibility", score, feedback };
}

function scoreDesignPatterns(submission: DesignSubmission): RubricDimension {
  const text = `${submission.designExplanation} ${submission.pseudocode ?? ""}`;
  const hits = containsAny(text, PATTERN_KEYWORDS);
  const score = clamp(hits.length * 4, 0, 10);

  let feedback: string;
  if (hits.length === 0) {
    feedback =
      "No design pattern was named. Not every problem needs one, but if you have a family of interchangeable rules (pricing, allocation, dispatch), naming the Strategy pattern explicitly signals you recognize the shape of the problem.";
  } else {
    feedback = `You referenced the ${hits[0]} pattern. State exactly which class plays which role in the pattern (e.g. which class is the "strategy interface" and which are the concrete strategies) so it's unambiguous.`;
  }
  return { name: "Design Patterns", score, feedback };
}

function scoreSimplicity(submission: DesignSubmission): RubricDimension {
  const n = submission.classes.filter((c) => c.name.trim()).length;
  let score: number;
  if (n === 0) score = 0;
  else if (n <= 8) score = 9;
  else if (n <= 12) score = 6;
  else score = 3;

  let feedback: string;
  if (n === 0) {
    feedback = "There's nothing to assess for simplicity yet — add your classes first.";
  } else if (n > 12) {
    feedback = `${n} classes is a lot for this problem's scope. Look for classes that could be merged, or state fields that could just live on an existing class, before adding new types.`;
  } else if (n > 8) {
    feedback = "The class count is on the higher side — check each class earns its place rather than being introduced for symmetry.";
  } else {
    feedback = "The design stays proportionate to the problem — you haven't introduced classes or layers the requirements don't call for.";
  }
  return { name: "Simplicity / Overengineering", score, feedback };
}

function scoreCodeQuality(submission: DesignSubmission): RubricDimension {
  const code = submission.pseudocode ?? "";
  const words = wordCount(code);
  let score: number;
  if (words === 0) score = 5; // neutral: optional field
  else if (words < 15) score = 4;
  else if (words < 60) score = 8;
  else score = 9;

  let feedback: string;
  if (words === 0) {
    feedback = "Pseudocode is optional, so this wasn't scored against you — but adding a short snippet for your trickiest method (e.g. spot allocation, split calculation) is often the fastest way to expose a design flaw before it costs you in an interview.";
  } else if (words < 15) {
    feedback = "The pseudocode is too short to show real logic. Expand it to at least the core method signature and its key branching logic.";
  } else {
    feedback = "The pseudocode is detailed enough to show how the class's key method actually behaves, not just its signature.";
  }
  return { name: "Code Quality / Pseudocode", score, feedback };
}

function scoreOverallReasoning(submission: DesignSubmission): RubricDimension {
  const words = wordCount(submission.designExplanation);
  const sentences = (submission.designExplanation || "").split(/[.!?]/).filter((s) => s.trim().length > 3).length;
  let score = clamp(Math.min(words / 15, 6) + Math.min(sentences, 4), 0, 10);
  score = Math.round(score);

  let feedback: string;
  if (words < 20) {
    feedback = "The design explanation is too brief to judge your reasoning. Walk through why you split responsibilities the way you did and what trade-off you considered and rejected.";
  } else {
    feedback = "The explanation walks through your reasoning rather than just listing classes, which is what separates a design from a diagram.";
  }
  return { name: "Overall Design Reasoning", score, feedback };
}

// ---- public API ------------------------------------------------------------

export function mockEvaluate(problem: Problem, submission: DesignSubmission): Omit<Evaluation, "id" | "attemptId" | "createdAt"> {
  const dimensions: RubricDimension[] = [
    scoreRequirementUnderstanding(problem, submission),
    scoreClassModeling(submission),
    scoreResponsibilityAssignment(submission),
    scoreEncapsulation(submission),
    scoreRelationships(submission),
    scoreExtensibility(submission),
    scoreDesignPatterns(submission),
    scoreSimplicity(submission),
    scoreCodeQuality(submission),
    scoreOverallReasoning(submission),
  ];

  const overallScore = Math.round(
    (dimensions.reduce((sum, d) => sum + d.score, 0) / (dimensions.length * 10)) * 100
  );

  const strengths = dimensions
    .filter((d) => d.score >= 7)
    .slice(0, 4)
    .map((d) => `${d.name}: ${d.feedback}`);

  const improvements = dimensions
    .filter((d) => d.score < 7 && d.score >= 3)
    .slice(0, 4)
    .map((d) => `${d.name}: ${d.feedback}`);

  const missingConcepts = dimensions
    .filter((d) => d.score < 3)
    .map((d) => d.name);

  const nextSteps: string[] = [];
  const worst = [...dimensions].sort((a, b) => a.score - b.score)[0];
  if (worst) {
    nextSteps.push(`Focus your next attempt on "${worst.name}" — it's currently your lowest-scoring area.`);
  }
  if (dimensions.find((d) => d.name === "Design Patterns")!.score < 4) {
    nextSteps.push("Read up on the Strategy and Factory patterns — they cover a large share of LLD interview problems.");
  }
  if (dimensions.find((d) => d.name === "Relationships")!.score < 5) {
    nextSteps.push("Practice drawing a class diagram by hand before writing the submission — relationships are easy to skip in prose.");
  }
  if (nextSteps.length === 0) {
    nextSteps.push("Try a harder problem next — this attempt shows a solid grasp of the fundamentals.");
  }

  return {
    overallScore: clamp(overallScore, 0, 100),
    dimensions,
    strengths: strengths.length ? strengths : ["Submission received — keep iterating to build up strengths in each rubric area."],
    improvements,
    missingConcepts,
    nextSteps,
    provider: "mock",
  };
}

export function newId(prefix: string): string {
  return `${prefix}_${nanoid(10)}`;
}
