import Link from "next/link";
import type { Category, CategoryId } from "@/data/types";
import { categoryHref } from "@/lib/data";

// One accent per category so 13 items stay scannable without icons.
// Distinct hues, similar chroma/lightness so the row reads as one family, not a rainbow.
const CATEGORY_COLOR: Record<CategoryId, string> = {
  eventos: "#EF5B6B",
  comer: "#F0A23C",
  cafes: "#A97452",
  bares: "#9B59D0",
  cultura: "#2E9C99",
  "aire-libre": "#4CAF6E",
  tecnologia: "#3E8FD6",
  gaming: "#6C6CE0",
  viajes: "#33B6C9",
  "cine-tv": "#D8548D",
  geek: "#6B7280",
  mascotas: "#D98CA0",
  musica: "#A85CC4",
};

export function CategoryChipBar({ categories }: { categories: Category[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={categoryHref(category.id)}
          className="group w-[118px] flex-none overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(25,21,18,0.04)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-18px_rgba(25,21,18,0.28)]"
        >
          <div
            className="h-11 transition-[filter] duration-200 group-hover:brightness-105"
            style={{ backgroundColor: CATEGORY_COLOR[category.id] }}
          />
          <div className="px-3 py-3 text-center">
            <span className="text-[13.5px] font-bold tracking-tight text-ink">{category.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
