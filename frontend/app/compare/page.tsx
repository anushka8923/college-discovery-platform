"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CompareTable } from "@/components/CompareTable";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { compareColleges, getColleges } from "@/lib/api";
import type { College } from "@/lib/types";

function ComparePageContent() {
  const params = useSearchParams();
  const initialIds = params.get("ids")?.split(",").map(Number).filter(Boolean) ?? [];
  const [options, setOptions] = useState<College[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>(initialIds.slice(0, 3));
  const [compared, setCompared] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getColleges(new URLSearchParams({ page: "1", limit: "50" }))
      .then((data) => setOptions(data.items))
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    if (selectedIds.length < 2) {
      setCompared([]);
      return;
    }
    setLoading(true);
    setError("");
    compareColleges(selectedIds)
      .then(setCompared)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedIds]);

  function addCollege(id: number) {
    if (!id || selectedIds.includes(id) || selectedIds.length >= 3) return;
    setSelectedIds((current) => [...current, id]);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-ink">Compare Colleges</h1>
        <p className="mt-2 text-ink/65">Select 2-3 colleges and compare the decision metrics that matter most.</p>
      </div>
      <div className="rounded-lg bg-white p-5 shadow-soft">
        <label className="block text-sm font-medium text-ink/75">
          Add college
          <select disabled={selectedIds.length >= 3} onChange={(event) => addCollege(Number(event.target.value))} value="" className="mt-2 w-full rounded-md border border-ink/10 bg-white px-3 py-3">
            <option value="">Choose a college</option>
            {options.filter((college) => !selectedIds.includes(college.id)).map((college) => (
              <option key={college.id} value={college.id}>{college.name}</option>
            ))}
          </select>
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedIds.map((id) => {
            const college = options.find((item) => item.id === id);
            return (
              <button key={id} type="button" onClick={() => setSelectedIds((current) => current.filter((item) => item !== id))} className="rounded-md bg-skyglass px-3 py-2 text-sm font-semibold text-moss">
                {college?.name ?? `College ${id}`} x
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-6">
        {selectedIds.length < 2 && <EmptyState title="Select at least 2 colleges" message="Comparison starts once you choose two colleges." />}
        {selectedIds.length > 3 && <ErrorState message="You can compare only 3 colleges at a time." />}
        {loading && <LoadingState label="Building comparison" />}
        {error && <ErrorState message={error} />}
        {!loading && !error && compared.length >= 2 && <CompareTable colleges={compared} onRemove={(id) => setSelectedIds((current) => current.filter((item) => item !== id))} />}
      </div>
    </section>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><LoadingState label="Loading comparison" /></section>}>
      <ComparePageContent />
    </Suspense>
  );
}
