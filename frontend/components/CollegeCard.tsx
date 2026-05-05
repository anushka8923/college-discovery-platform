"use client";

import Link from "next/link";
import type { College } from "@/lib/types";

type CollegeCardProps = {
  college: College;
  compareSelected?: boolean;
  onCompareToggle?: (college: College) => void;
};

export function CollegeCard({ college, compareSelected = false, onCompareToggle }: CollegeCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-black/5 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-ink">{college.name}</h3>
          <p className="mt-1 text-sm text-ink/60">{college.location}</p>
        </div>
        <span className="rounded-md bg-skyglass px-2 py-1 text-sm font-semibold text-moss">{college.rating.toFixed(1)}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-ink/50">Fees</p>
          <p className="font-semibold">Rs {college.fees.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-ink/50">Placement</p>
          <p className="font-semibold">{college.placementPercentage}%</p>
        </div>
      </div>
      <p className="mt-4 rounded-md bg-skyglass/70 px-3 py-2 text-sm font-medium text-moss">{college.mainCourse}</p>
      <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
        <Link href={`/colleges/${college.id}`} className="flex-1 rounded-lg bg-moss px-4 py-2 text-center text-sm font-semibold text-white hover:bg-moss/90">
          View details
        </Link>
        {onCompareToggle && (
          <button
            type="button"
            onClick={() => onCompareToggle(college)}
            className={`flex-1 rounded-lg border px-4 py-2 text-sm font-semibold ${compareSelected ? "border-coral bg-coral text-white" : "border-ink/10 text-ink hover:bg-skyglass"}`}
          >
            {compareSelected ? "Selected" : "Compare"}
          </button>
        )}
      </div>
    </article>
  );
}
