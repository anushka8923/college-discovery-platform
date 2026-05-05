"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { getCollege } from "@/lib/api";
import type { CollegeDetail } from "@/lib/types";

export default function CollegeDetailPage() {
  const params = useParams<{ id: string }>();
  const [college, setCollege] = useState<CollegeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getCollege(params.id)
      .then(setCollege)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <section className="mx-auto max-w-5xl px-4 py-10"><LoadingState label="Loading college details" /></section>;
  if (error) return <section className="mx-auto max-w-5xl px-4 py-10"><ErrorState message={error} /></section>;
  if (!college) return <section className="mx-auto max-w-5xl px-4 py-10"><EmptyState title="College unavailable" message="The requested college could not be loaded." /></section>;

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-coral">{college.location}</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">{college.name}</h1>
        <p className="mt-4 leading-7 text-ink/70">{college.description}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-skyglass p-4"><p className="text-sm text-ink/55">Fees</p><p className="font-bold">Rs {college.fees.toLocaleString()}</p></div>
          <div className="rounded-lg bg-skyglass p-4"><p className="text-sm text-ink/55">Rating</p><p className="font-bold">{college.rating.toFixed(1)}</p></div>
          <div className="rounded-lg bg-skyglass p-4"><p className="text-sm text-ink/55">Placement</p><p className="font-bold">{college.placementPercentage}%</p></div>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold text-ink">Courses</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {college.courses.map((course) => <span key={course} className="rounded-md bg-skyglass px-3 py-2 text-sm font-medium text-moss">{course}</span>)}
          </div>
        </section>
        <section className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold text-ink">Placements</h2>
          <p className="mt-4 text-4xl font-bold text-moss">{college.placementPercentage}%</p>
          <p className="mt-2 text-sm text-ink/65">Reported placement percentage for the main engineering programs.</p>
        </section>
        <section className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold text-ink">Overview</h2>
          <p className="mt-4 text-sm leading-6 text-ink/70">Main course: <strong>{college.mainCourse}</strong></p>
          <p className="mt-2 text-sm leading-6 text-ink/70">Campus location: <strong>{college.location}</strong></p>
        </section>
      </div>
      <section className="mt-6 rounded-lg bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold text-ink">Reviews</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {college.reviews.map((review) => (
            <article key={review.id} className="rounded-lg border border-black/5 p-4">
              <div className="flex items-center justify-between"><h3 className="font-semibold">{review.studentName}</h3><span className="text-sm font-bold text-moss">{review.rating.toFixed(1)}</span></div>
              <p className="mt-2 text-sm leading-6 text-ink/65">{review.comment}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
