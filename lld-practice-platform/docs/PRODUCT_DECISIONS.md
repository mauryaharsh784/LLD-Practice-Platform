# Product Decisions

This explains the reasoning behind the LLD Practice Platform's design, not
just what was built. It's written for someone evaluating product thinking,
not only code.

## 1. Learner problem

Someone practicing Low-Level Design (for interviews or general skill
building) can find endless *problem statements* but almost no feedback
loop. Writing a design and getting nothing back except "looks fine" or
silence doesn't build the skill. The gap isn't problems — it's **specific,
actionable feedback tied to the design you actually wrote**.

## 2. Research assumptions

- Learners already know roughly what a class diagram is; they need
  practice applying SOLID-ish reasoning to concrete problems, not a
  tutorial on what a class is.
- Feedback that quotes the learner's own class/relationship names is far
  more useful than generic advice — this shaped both the rubric engine
  (§6) and the submission format (§4).
- Most learners iterate: attempt 1 is rough, attempt 2 should be better.
  The product needs to make that improvement visible (score deltas,
  history), not just store submissions.

## 3. Narrow MVP

Explicitly excluded from this build: real authentication, a real database,
freehand diagram editing, microservices/DevOps, and unbounded AI usage.
Each of these would have consumed build time without strengthening the
actual loop the assignment asks for: **practice → feedback → improve →
retry**. See the README's Tradeoffs section for the full list.

## 4. Submission format

A single giant textarea would be easy to build but nearly impossible to
evaluate meaningfully — you'd be scoring prose, not design. Splitting the
submission into:

- Requirements & assumptions (free text)
- Classes (name / responsibility / attributes / methods, repeatable)
- Relationships (class A / type / class B, repeatable)
- Design explanation (free text)
- Optional pseudocode

...lets the evaluator (mock or AI) reason about *structure* — how many
classes, whether relationships are diverse, whether responsibilities
overlap — instead of trying to parse structure out of prose. It also
mirrors how a design interview actually proceeds: entities, then
responsibilities, then relationships, then a walkthrough.

## 5. Evaluation rubric

Ten dimensions, 0–10 each, chosen to cover the things that actually
separate a strong LLD submission from a weak one: Requirement
Understanding, Class Modeling, Responsibility Assignment, Encapsulation,
Relationships, Extensibility, Design Patterns, Simplicity/Overengineering,
Code Quality/Pseudocode, Overall Design Reasoning. The overall score
(0–100) is the mean of the ten, scaled — deliberately simple and
explainable rather than a black-box weighted formula, since a learner
trying to improve needs to understand *why* a number is what it is.

## 6. Feedback strategy

The assignment is explicit that "Improve your design" is bad feedback.
The mock evaluator (`server/src/services/mockEvaluator.ts`) is built
around one rule: **every piece of feedback should be able to reference
something the learner actually wrote.** Concretely:

- Class Modeling feedback names the learner's actual class names.
- Responsibility Assignment feedback points at the specific class whose
  responsibility text is too thin or overlaps with another.
- Relationships feedback references an actual `classA --(type)--> classB`
  triple from the submission.
- Extensibility/Design Patterns feedback quotes the keyword the learner
  themselves used (e.g. "you called out *interface*...").

This is why the evaluator is a deterministic function of the submission
rather than a lookup table of canned messages — the messages are
*templated around extracted facts*, which is what makes them feel specific
without requiring an LLM call.

## 7. Why structured submission was chosen over free-form code

Section 6 of the assignment explicitly says not to force code-only
submissions — LLD is about class-level reasoning, and forcing code would
bias the exercise toward syntax instead of design. Pseudocode is offered
as an *optional* enrichment, scored gently (never penalized for being
empty), because for some problems a short pseudocode snippet is where a
design flaw actually surfaces (e.g. an allocation algorithm).

## 8. Why AI evaluation is optional/fallback

Two hard constraints from the assignment: (a) the app must work without
any API key, and (b) AI output must never be trusted blindly. The
implementation:

- Defaults to `AI_PROVIDER=mock`, which is what makes the "clone and run"
  demo experience possible.
- `AI_PROVIDER=anthropic` is available as a strict upgrade: the prompt
  sent to the model includes the problem, the rubric dimensions, and the
  learner's structured submission, and the model is asked to return *only*
  JSON in an exact shape.
- That JSON is parsed and validated against a Zod schema
  (`AiEvaluationSchema`) before it is ever saved or shown. If parsing,
  validation, or the network call fails for any reason, the system falls
  back to the deterministic mock evaluator and logs the failure — the
  learner never sees a broken or partially-rendered evaluation.

## 9. What was intentionally excluded

- **Real database.** `DB_MODE=memory` is the default and the only mode
  exercised in this build. The intended Mongoose schema is written
  (`server/src/models/mongooseSchemas.ts`) to document the production data
  model, but wiring an actual MongoDB connection was judged lower-value
  than a fully working in-memory demo, given the assignment's own
  instruction to avoid spending most of the time on infrastructure.
- **Real authentication.** A single demo user avoids building session
  management, password hashing, and account recovery — none of which
  teaches or demonstrates anything about LLD practice.
- **A freehand diagram editor.** A generated, read-only SVG preview
  (`client/src/components/DiagramPreview.tsx`) satisfies "see your design
  before submitting" without the cost of a full drag-and-drop canvas or a
  Mermaid-syntax editor.
- **Kubernetes/microservices/queues.** A single Express service and a
  single Vite/React app are more than sufficient for this MVP's scope and
  are explicitly what the assignment asks for.

## 10. Future improvements

See the README's "Future Improvements" section — richer/editable diagrams,
personalized recommendations driven by a learner's historically weakest
rubric dimension, difficulty adaptation, peer review, deeper AI evaluation
(e.g. critiquing the diagram itself), sandboxed pseudocode execution, and
collaborative sessions.
