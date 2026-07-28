import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

const itemClass =
  "flex-none truncate rounded-full px-3 py-1.5 text-[13px] font-semibold text-ink-soft transition-colors duration-150 hover:bg-accent hover:text-brand-deep";

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="flex-none text-[#D8D2CA]" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto px-4 pt-4.5 md:px-10">
      <ol className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-border bg-card p-1 whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <li className="flex-none">
          <Link href="/" className={itemClass}>
            <span aria-hidden>🏠</span> Inicio
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex min-w-0 flex-none items-center gap-0.5">
            <Chevron />
            {item.href ? (
              <Link href={item.href} className={itemClass}>
                {item.label}
              </Link>
            ) : (
              <span className="max-w-[220px] flex-none truncate rounded-full bg-accent px-3 py-1.5 text-[13px] font-bold text-brand-deep sm:max-w-[360px]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
