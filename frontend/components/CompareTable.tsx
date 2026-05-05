import type { College } from "@/lib/types";

const rows: Array<[string, (college: College) => string]> = [
  ["Location", (college) => college.location],
  ["Annual fees", (college) => `Rs ${college.fees.toLocaleString()}`],
  ["Main course", (college) => college.mainCourse],
  ["Placement", (college) => `${college.placementPercentage}%`],
  ["Rating", (college) => college.rating.toFixed(1)]
];

export function CompareTable({ colleges, onRemove }: { colleges: College[]; onRemove?: (id: number) => void }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-black/5 bg-white shadow-soft">
      <table className="min-w-full divide-y divide-black/5 text-sm">
        <thead>
          <tr>
            <th className="bg-skyglass px-4 py-4 text-left font-semibold text-ink">Criteria</th>
            {colleges.map((college) => (
              <th key={college.id} className="bg-skyglass px-4 py-4 text-left font-semibold text-ink">
                <div className="flex items-start justify-between gap-3">
                  <span>{college.name}</span>
                  {onRemove && (
                    <button onClick={() => onRemove(college.id)} className="rounded-md bg-white px-2 py-1 text-xs text-coral" type="button">
                      Remove
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {rows.map(([label, getValue]) => (
            <tr key={label}>
              <td className="px-4 py-4 font-semibold text-ink/75">{label}</td>
              {colleges.map((college) => (
                <td key={`${college.id}-${label}`} className="px-4 py-4 text-ink/75">
                  {getValue(college)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
