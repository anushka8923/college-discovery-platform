"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function submitSearch() {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    router.push(`/colleges?${params.toString()}`);
  }

  return (
    <section className="bg-[linear-gradient(120deg,#e8f3f6_0%,#f7faf8_55%,#ffe9df_100%)]">
      <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-moss shadow-soft">Engineering college decisions, simplified</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-ink sm:text-6xl">Find the college that fits your rank, budget, and goals.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
            Explore Indian engineering colleges, compare shortlists, and discover rank-based options from one clean decision workspace.
          </p>
          <div className="mt-8 max-w-2xl">
            <SearchBar value={search} onChange={setSearch} onSubmit={submitSearch} placeholder="Search IIT, NIT, BITS, VIT..." />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/colleges" className="rounded-lg bg-moss px-5 py-3 text-center font-semibold text-white hover:bg-moss/90">
              Explore Colleges
            </Link>
            <Link href="/compare" className="rounded-lg border border-ink/10 bg-white px-5 py-3 text-center font-semibold text-ink hover:bg-skyglass">
              Compare Colleges
            </Link>
            <Link href="/predictor" className="rounded-lg border border-ink/10 bg-white px-5 py-3 text-center font-semibold text-ink hover:bg-skyglass">
              Try Predictor
            </Link>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-soft">
          <div className="grid gap-4">
            {[
              ["Search", "Filter by location, course, and annual fees."],
              ["Compare", "Evaluate 2-3 colleges side by side."],
              ["Predict", "Match JEE rank to seeded cutoff ranges."]
            ].map(([title, text]) => (
              <div key={title} className="rounded-lg border border-black/5 p-5">
                <h2 className="font-bold text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
