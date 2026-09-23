import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../services/api";
import { ProblemCard } from "../components/ProblemCard";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { Input, Select } from "../components/FormFields";

export function ProblemsPage() {
  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["problems", { q, difficulty, tag, status }],
    queryFn: () => api.listProblems({ q, difficulty, tag, status }),
  });

  const allTags = Array.from(new Set((data?.problems ?? []).flatMap((p) => p.tags))).sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-800">Problem Library</h1>
        <p className="mt-1 text-sm text-ink-800/60">Choose a problem, then design → submit → get feedback → retry.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-1">
          <Input placeholder="Search problems..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="w-40">
          <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">All difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </Select>
        </div>
        <div className="w-48">
          <Select value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="">All topics</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-44">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Any status</option>
            <option value="not_started">Not started</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
      </div>

      {isLoading && <LoadingState label="Loading problems..." />}
      {isError && <ErrorState message="Couldn't load the problem library." onRetry={() => refetch()} />}
      {data && data.problems.length === 0 && (
        <EmptyState title="No problems match" description="Try clearing a filter or searching a different term." />
      )}
      {data && data.problems.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.problems.map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      )}
    </div>
  );
}
