"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CollegeCard } from "@/components/CollegeCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { FilterSidebar } from "@/components/FilterSidebar";
import { LoadingState } from "@/components/LoadingState";
import { SearchBar } from "@/components/SearchBar";
import { getColleges, getFilters } from "@/lib/api";
import type { College, Filters, PaginatedColleges } from "@/lib/types";

function CollegesPageContent() {
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [filterValues, setFilterValues] = useState({ location: "", course: "", minFees: "", maxFees: "" });
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [data, setData] = useState<PaginatedColleges | null>(null);
  const [selected, setSelected] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => {
    const next = new URLSearchParams({ page: String(page), limit: "9" });
    if (search.trim()) next.set("search", search.trim());
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) next.set(key, value);
    });
    return next;
  }, [filterValues, page, search]);

  useEffect(() => {
    getFilters().then(setFilters).catch(() => setFilters(null));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    getColleges(query)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  function toggleCompare(college: College) {
    setSelected((current) => {
      if (current.some((item) => item.id === college.id)) return current.filter((item) => item.id !== college.id);
      if (current.length >= 3) return current;
      return [...current, college];
    });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-ink">Explore Colleges</h1>
        <p className="mt-2 text-ink/65">Search and filter API-backed college data.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
          filters={filters}
          values={filterValues}
          onChange={(key, value) => {
            setPage(1);
            setFilterValues((current) => ({ ...current, [key]: value }));
          }}
          onClear={() => {
            setPage(1);
            setFilterValues({ location: "", course: "", minFees: "", maxFees: "" });
          }}
        />
        <div>
          <SearchBar value={search} onChange={setSearch} onSubmit={() => setPage(1)} />
          {selected.length > 0 && (
            <div className="mt-4 rounded-lg bg-white p-4 shadow-soft">
              <p className="text-sm font-medium text-ink">{selected.length}/3 selected for comparison</p>
              <a className="mt-2 inline-block text-sm font-semibold text-coral" href={`/compare?ids=${selected.map((item) => item.id).join(",")}`}>
                Open comparison
              </a>
            </div>
          )}
          <div className="mt-6">
            {loading && <LoadingState />}
            {error && <ErrorState message={error} />}
            {!loading && !error && data?.items.length === 0 && <EmptyState title="No colleges found" message="Try changing your search or filters." />}
            {!loading && !error && data && data.items.length > 0 && (
              <>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {data.items.map((college) => (
                    <CollegeCard key={college.id} college={college} compareSelected={selected.some((item) => item.id === college.id)} onCompareToggle={toggleCompare} />
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-soft">
                  <button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-md border border-ink/10 px-4 py-2 text-sm font-semibold disabled:opacity-40">
                    Previous
                  </button>
                  <p className="text-sm text-ink/65">
                    Page {data.meta.page} of {Math.max(data.meta.totalPages, 1)}
                  </p>
                  <button disabled={page >= data.meta.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-md border border-ink/10 px-4 py-2 text-sm font-semibold disabled:opacity-40">
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><LoadingState /></section>}>
      <CollegesPageContent />
    </Suspense>
  );
}
