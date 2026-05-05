export function LoadingState({ label = "Loading colleges" }: { label?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-ink/15 bg-white p-8 text-center shadow-soft">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-moss/20 border-t-moss" />
      <p className="font-medium text-ink">{label}</p>
    </div>
  );
}
