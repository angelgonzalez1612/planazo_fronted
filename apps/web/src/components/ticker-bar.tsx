import Link from "next/link";

export function TickerBar({ items }: { items: Array<{ label: string; href: string }> }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 text-[13.5px]">
      <span className="flex-none text-[11px] font-bold tracking-wide text-ink-soft uppercase">
        Hoy se habla de
      </span>
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-2.5">
          <Link href={item.href} className="text-ink-soft hover:text-brand">
            {item.label}
          </Link>
          {i < items.length - 1 && <span className="text-[#D8D0C8]">·</span>}
        </span>
      ))}
    </div>
  );
}
