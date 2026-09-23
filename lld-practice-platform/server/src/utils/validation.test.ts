import { describe, expect, it } from "vitest";
import { validateSubmittable, DesignSubmissionInput } from "./validation";

describe("validateSubmittable", () => {
  it("rejects a submission with no requirements, classes, or explanation", () => {
    const submission = DesignSubmissionInput.parse({});
    const errors = validateSubmittable(submission);
    expect(errors.length).toBe(3);
  });

  it("accepts a minimally complete submission", () => {
    const submission = DesignSubmissionInput.parse({
      requirementsAndAssumptions: "Some requirements",
      classes: [{ name: "Foo", responsibility: "does foo", attributes: "", methods: "" }],
      designExplanation: "Some explanation of the design",
    });
    const errors = validateSubmittable(submission);
    expect(errors.length).toBe(0);
  });
});
