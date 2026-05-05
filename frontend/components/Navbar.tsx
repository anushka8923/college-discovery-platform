import Link from "next/link";

const links = [
  { href: "/colleges", label: "Colleges" },
  { href: "/compare", label: "Compare" },
  { href: "/predictor", label: "Predictor" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-ink">
          CollegeFind
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-ink/75 hover:bg-skyglass hover:text-ink">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
