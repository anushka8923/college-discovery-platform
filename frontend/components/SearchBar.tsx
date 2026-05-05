"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
};

export function SearchBar({ value, onChange, onSubmit, placeholder = "Search by college name" }: SearchBarProps) {
  return (
    <form
      className="flex w-full flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-12 flex-1 rounded-lg border border-ink/10 bg-white px-4 text-ink outline-none ring-moss/20 focus:border-moss focus:ring-4"
      />
      <button className="min-h-12 rounded-lg bg-coral px-5 font-semibold text-white shadow-soft transition hover:bg-coral/90" type="submit">
        Search
      </button>
    </form>
  );
}
