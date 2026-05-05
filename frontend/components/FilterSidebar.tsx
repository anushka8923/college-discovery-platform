"use client";

import type { Filters } from "@/lib/types";

type FilterSidebarProps = {
  filters: Filters | null;
  values: {
    location: string;
    course: string;
    minFees: string;
    maxFees: string;
  };
  onChange: (key: keyof FilterSidebarProps["values"], value: string) => void;
  onClear: () => void;
};

export function FilterSidebar({ filters, values, onChange, onClear }: FilterSidebarProps) {
  return (
    <aside className="rounded-lg border border-black/5 bg-white p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-ink">Filters</h2>
        <button type="button" onClick={onClear} className="text-sm font-medium text-coral">
          Clear
        </button>
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-ink/75">
          Location
          <select value={values.location} onChange={(event) => onChange("location", event.target.value)} className="mt-2 w-full rounded-md border border-ink/10 bg-white px-3 py-2">
            <option value="">All locations</option>
            {filters?.locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-ink/75">
          Course
          <select value={values.course} onChange={(event) => onChange("course", event.target.value)} className="mt-2 w-full rounded-md border border-ink/10 bg-white px-3 py-2">
            <option value="">All courses</option>
            {filters?.courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium text-ink/75">
            Min fees
            <input value={values.minFees} onChange={(event) => onChange("minFees", event.target.value)} inputMode="numeric" className="mt-2 w-full rounded-md border border-ink/10 px-3 py-2" />
          </label>
          <label className="block text-sm font-medium text-ink/75">
            Max fees
            <input value={values.maxFees} onChange={(event) => onChange("maxFees", event.target.value)} inputMode="numeric" className="mt-2 w-full rounded-md border border-ink/10 px-3 py-2" />
          </label>
        </div>
        {filters && <p className="text-xs text-ink/55">Seeded fee range: Rs {filters.feeRange.min.toLocaleString()} - Rs {filters.feeRange.max.toLocaleString()}</p>}
      </div>
    </aside>
  );
}
