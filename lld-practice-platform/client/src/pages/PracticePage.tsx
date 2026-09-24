import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { api, ApiError } from "../services/api";
import {
  ClassDefinition,
  DesignSubmission,
  RelationshipDefinition,
  RelationshipType,
} from "../types/domain";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import {
  Input,
  Select,
  Textarea,
} from "../components/FormFields";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { DiagramPreview } from "../components/DiagramPreview";

const RELATIONSHIP_TYPES: RelationshipType[] = [
  "association",
  "composition",
  "aggregation",
  "inheritance",
  "dependency",
];

function emptyClass(): ClassDefinition {
  return {
    id: crypto.randomUUID(),
    name: "",
    responsibility: "",
    attributes: "",
    methods: "",
  };
}

function emptyRelationship(): RelationshipDefinition {
  return {
    id: crypto.randomUUID(),
    classA: "",
    relationshipType: "association",
    classB: "",
  };
}

function emptySubmission(): DesignSubmission {
  return {
    requirementsAndAssumptions: "",
    classes: [emptyClass()],
    relationships: [],
    designExplanation: "",
    pseudocode: "",
  };
}

export function PracticePage() {
  const { problemId } = useParams<{ problemId: string }>();
  const [searchParams] = useSearchParams();

  const attemptId = searchParams.get("attempt");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [submission, setSubmission] =
    useState<DesignSubmission>(emptySubmission());

  const [currentAttemptId, setCurrentAttemptId] =
    useState<string | null>(attemptId);

  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  /*
   * Load problem
   */
  const problemQuery = useQuery({
    queryKey: ["problem", problemId],
    queryFn: () => api.getProblem(problemId!),
    enabled: !!problemId,
  });

  /*
   * Load existing draft/attempt
   */
  const draftQuery = useQuery({
    queryKey: ["attempt", attemptId],
    queryFn: () => api.getAttempt(attemptId!),
    enabled: !!attemptId,
  });

  /*
   * Load existing submission safely
   */
  useEffect(() => {
    if (draftQuery.data?.attempt?.submission) {
      const draft = draftQuery.data.attempt.submission;

      setSubmission({
        requirementsAndAssumptions:
          draft.requirementsAndAssumptions ?? "",

        classes:
          draft.classes?.length > 0
            ? draft.classes
            : [emptyClass()],

        relationships: draft.relationships ?? [],

        designExplanation:
          draft.designExplanation ?? "",

        pseudocode:
          draft.pseudocode ?? "",
      });
    }
  }, [draftQuery.data]);

  /*
   * Save draft
   */
  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      if (!problemId) {
        throw new Error("Problem ID is missing.");
      }

      if (currentAttemptId) {
        return api.updateAttempt(currentAttemptId, {
          submission,
          status: "draft",
        });
      }

      return api.createAttempt({
        problemId,
        submission,
        status: "draft",
      });
    },

    onSuccess: (data) => {
      setCurrentAttemptId(data.attempt.id);
      setErrors([]);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);

      queryClient.invalidateQueries({
        queryKey: ["attempts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (err) => {
      if (err instanceof ApiError && err.details) {
        setErrors(err.details);
      } else {
        setErrors(["Could not save draft. Please try again."]);
      }
    },
  });

  /*
   * Submit for evaluation
   */
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!problemId) {
        throw new Error("Problem ID is missing.");
      }

      if (currentAttemptId) {
        return api.updateAttempt(currentAttemptId, {
          submission,
          status: "submitted",
        });
      }

      return api.createAttempt({
        problemId,
        submission,
        status: "submitted",
      });
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["attempts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["problems"],
      });

      navigate(`/attempts/${data.attempt.id}`);
    },

    onError: (err) => {
      if (err instanceof ApiError && err.details) {
        setErrors(err.details);
      } else if (err instanceof Error) {
        setErrors([err.message]);
      } else {
        setErrors(["Submission failed. Please try again."]);
      }
    },
  });

  /*
   * Loading
   */
  if (problemQuery.isLoading) {
    return <LoadingState label="Loading workspace..." />;
  }

  /*
   * Error
   */
  if (problemQuery.isError || !problemQuery.data) {
    return (
      <ErrorState
        message="Couldn't load this problem."
        onRetry={() => problemQuery.refetch()}
      />
    );
  }

  const problem = problemQuery.data.problem;

  /*
   * Safe arrays
   */
  const classes = submission.classes ?? [];
  const relationships = submission.relationships ?? [];

  /*
   * Update class
   */
  function updateClass(
    id: string,
    patch: Partial<ClassDefinition>
  ) {
    setSubmission((s) => ({
      ...s,

      classes: (s.classes ?? []).map((c) =>
        c.id === id
          ? {
              ...c,
              ...patch,
            }
          : c
      ),
    }));
  }

  /*
   * Remove class
   */
  function removeClass(id: string) {
    setSubmission((s) => ({
      ...s,

      classes: (s.classes ?? []).filter(
        (c) => c.id !== id
      ),
    }));
  }

  /*
   * Update relationship
   */
  function updateRelationship(
    id: string,
    patch: Partial<RelationshipDefinition>
  ) {
    setSubmission((s) => ({
      ...s,

      relationships: (s.relationships ?? []).map((r) =>
        r.id === id
          ? {
              ...r,
              ...patch,
            }
          : r
      ),
    }));
  }

  /*
   * Remove relationship
   */
  function removeRelationship(id: string) {
    setSubmission((s) => ({
      ...s,

      relationships: (s.relationships ?? []).filter(
        (r) => r.id !== id
      ),
    }));
  }

  const isEvaluating = submitMutation.isPending;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">

        {/* Header */}
        <div>
          <Link
            to={`/problems/${problem.id}`}
            className="text-xs font-medium text-blueprint-600 hover:underline"
          >
            ← {problem.title}
          </Link>

          <h1 className="mt-1 text-xl font-semibold text-ink-800">
            Design Workspace
          </h1>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="rounded-md border border-clay/30 bg-clay/5 p-4">
            <p className="text-sm font-medium text-clay">
              Fix the following before submitting:
            </p>

            <ul className="mt-1 list-disc pl-5 text-sm text-clay/90">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-800">
            Requirements & Assumptions
          </h2>

          <p className="mt-1 text-xs text-ink-800/50">
            Restate the problem in your own words and note any
            assumptions you're making.
          </p>

          <Textarea
            className="mt-3"
            rows={4}
            value={submission.requirementsAndAssumptions ?? ""}
            onChange={(e) =>
              setSubmission((s) => ({
                ...s,
                requirementsAndAssumptions: e.target.value,
              }))
            }
            placeholder="e.g. The parking lot has multiple floors. Vehicles enter and are assigned a spot sized for their type..."
          />
        </Card>

        {/* Classes */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-800">
              Classes
            </h2>

            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                setSubmission((s) => ({
                  ...s,
                  classes: [
                    ...(s.classes ?? []),
                    emptyClass(),
                  ],
                }))
              }
            >
              + Add class
            </Button>
          </div>

          <div className="mt-3 space-y-3">
            {classes.map((c) => (
              <div
                key={c.id}
                className="rounded-md border border-ink-800/10 p-3"
              >
                <div className="flex items-center justify-between gap-2">

                  <Input
                    placeholder="Class name (e.g. ParkingLot)"
                    value={c.name ?? ""}
                    onChange={(e) =>
                      updateClass(c.id, {
                        name: e.target.value,
                      })
                    }
                    className="font-mono-data"
                  />

                  <button
                    type="button"
                    onClick={() => removeClass(c.id)}
                    className="shrink-0 rounded px-2 py-1 text-xs text-ink-800/40 hover:bg-clay/10 hover:text-clay"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-2">
                  <Input
                    placeholder="Responsibility — the one thing this class owns"
                    value={c.responsibility ?? ""}
                    onChange={(e) =>
                      updateClass(c.id, {
                        responsibility: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Attributes (comma separated)"
                    value={c.attributes ?? ""}
                    onChange={(e) =>
                      updateClass(c.id, {
                        attributes: e.target.value,
                      })
                    }
                  />

                  <Input
                    placeholder="Methods (comma separated)"
                    value={c.methods ?? ""}
                    onChange={(e) =>
                      updateClass(c.id, {
                        methods: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Relationships */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-800">
              Relationships
            </h2>

            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                setSubmission((s) => ({
                  ...s,

                  relationships: [
                    ...(s.relationships ?? []),
                    emptyRelationship(),
                  ],
                }))
              }
            >
              + Add relationship
            </Button>
          </div>

          {relationships.length === 0 && (
            <p className="mt-2 text-xs text-ink-800/45">
              Connect your classes — e.g. Floor{" "}
              <span className="font-mono-data">
                composition
              </span>{" "}
              ParkingSpot.
            </p>
          )}

          <div className="mt-3 space-y-2">
            {relationships.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-2"
              >
                <Input
                  placeholder="Class A"
                  value={r.classA ?? ""}
                  onChange={(e) =>
                    updateRelationship(r.id, {
                      classA: e.target.value,
                    })
                  }
                  className="font-mono-data"
                />

                <Select
                  value={
                    r.relationshipType ?? "association"
                  }
                  onChange={(e) =>
                    updateRelationship(r.id, {
                      relationshipType:
                        e.target.value as RelationshipType,
                    })
                  }
                  className="w-40 shrink-0"
                >
                  {RELATIONSHIP_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>

                <Input
                  placeholder="Class B"
                  value={r.classB ?? ""}
                  onChange={(e) =>
                    updateRelationship(r.id, {
                      classB: e.target.value,
                    })
                  }
                  className="font-mono-data"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeRelationship(r.id)
                  }
                  className="shrink-0 rounded px-2 py-1 text-xs text-ink-800/40 hover:bg-clay/10 hover:text-clay"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Design Explanation */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-800">
            Design Explanation
          </h2>

          <p className="mt-1 text-xs text-ink-800/50">
            Why did you split responsibilities this way?
            What would you change if a new requirement showed
            up?
          </p>

          <Textarea
            className="mt-3"
            rows={5}
            value={submission.designExplanation ?? ""}
            onChange={(e) =>
              setSubmission((s) => ({
                ...s,
                designExplanation: e.target.value,
              }))
            }
            placeholder="e.g. ParkingLot delegates spot selection to a SpotAllocationStrategy interface so a new allocation rule can be added without modifying ParkingLot..."
          />
        </Card>

        {/* Pseudocode */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-800">
            Code / Pseudocode{" "}
            <span className="text-ink-800/40">
              (optional)
            </span>
          </h2>

          <Textarea
            className="mt-3 font-mono-data"
            rows={6}
            value={submission.pseudocode ?? ""}
            onChange={(e) =>
              setSubmission((s) => ({
                ...s,
                pseudocode: e.target.value,
              }))
            }
            placeholder={"function parkVehicle(vehicle):\n  ..."}
          />
        </Card>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pb-4">
          <p className="text-xs text-ink-800/45">
            {saved
              ? "Draft saved."
              : "Your design workspace is saved as a draft until you submit."}
          </p>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                saveDraftMutation.mutate()
              }
              disabled={saveDraftMutation.isPending}
            >
              {saveDraftMutation.isPending
                ? "Saving..."
                : "Save Draft"}
            </Button>

            <Button
              onClick={() =>
                submitMutation.mutate()
              }
              disabled={isEvaluating}
            >
              {isEvaluating
                ? "Evaluating your design..."
                : "Submit for Evaluation"}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">

        {/* Diagram */}
        <Card className="p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-800/45">
            Diagram preview
          </h3>

          <div className="mt-2">
            <DiagramPreview
              classes={classes}
              relationships={relationships}
            />
          </div>
        </Card>

        {/* Checklist */}
        <Card className="p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-800/45">
            Submission checklist
          </h3>

          <ul className="mt-2 space-y-1.5 text-sm text-ink-800/70">
            <li>
              {submission.requirementsAndAssumptions?.trim()
                ? "✅"
                : "⬜"}{" "}
              Requirements & assumptions
            </li>

            <li>
              {classes.some((c) =>
                c.name?.trim()
              )
                ? "✅"
                : "⬜"}{" "}
              At least one class
            </li>

            <li>
              {relationships.length > 0
                ? "✅"
                : "⬜"}{" "}
              At least one relationship
            </li>

            <li>
              {submission.designExplanation?.trim()
                ? "✅"
                : "⬜"}{" "}
              Design explanation
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}