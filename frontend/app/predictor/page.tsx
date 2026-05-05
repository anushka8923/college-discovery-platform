"use client";

import { useState } from "react";
import { CollegeCard } from "@/components/CollegeCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { predictColleges } from "@/lib/api";
import type { Prediction } from "@/lib/types";

export default function PredictorPage() {
  const [exam, setExam] = useState("JEE");
  const [rank, setRank] = useState("");
  const [results, setResults] = useState<Prediction[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericRank = Number(rank);
    if (!Number.isInteger(numericRank) || numericRank <= 0) {
      setError("Enter a valid positive rank.");
      setResults(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setResults(await predictColleges(exam, numericRank));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-ink">College Predictor</h1>
        <p className="mt-2 text-ink/65">Enter exam and rank to match seeded cutoff ranges.</p>
      </div>
      <form onSubmit={submit} className="grid gap-4 rounded-lg bg-white p-5 shadow-soft md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="block text-sm font-medium text-ink/75">
          Exam
          <select value={exam} onChange={(event) => setExam(event.target.value)} className="mt-2 w-full rounded-md border border-ink/10 bg-white px-3 py-3">
            <option value="JEE">JEE</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-ink/75">
          Rank
          <input value={rank} onChange={(event) => setRank(event.target.value)} inputMode="numeric" placeholder="25000" className="mt-2 w-full rounded-md border border-ink/10 px-3 py-3" />
        </label>
        <button className="rounded-lg bg-coral px-5 py-3 font-semibold text-white hover:bg-coral/90" type="submit">
          Predict
        </button>
      </form>
      <div className="mt-6">
        {loading && <LoadingState label="Finding colleges" />}
        {error && <ErrorState message={error} />}
        {!loading && !error && results?.length === 0 && <EmptyState title="No matching colleges" message="Try a different rank or exam." />}
        {!loading && !error && results && results.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {results.map((result) => (
              <div key={result.cutoffId}>
                <CollegeCard college={result.college} />
                <p className="mt-2 rounded-md bg-white px-3 py-2 text-sm text-ink/65 shadow-soft">
                  Match: {result.course}, rank {result.minRank.toLocaleString()} - {result.maxRank.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
