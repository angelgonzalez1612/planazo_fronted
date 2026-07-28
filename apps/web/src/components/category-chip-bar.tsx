import Link from "next/link";
import type { Category } from "@/data/types";
import { categoryHref } from "@/lib/data";

export function CategoryChipBar({ categories }: { categories: Category[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={categoryHref(category.id)}
          className="group flex flex-none flex-col items-center gap-2 rounded-2xl border border-border bg-card px-5 py-4 shadow-[0_1px_2px_rgba(25,21,18,0.04)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-peach hover:shadow-[0_16px_30px_-18px_rgba(255,90,0,0.4)]"
        >
          <span className="grid size-11 flex-none place-items-center rounded-full bg-accent text-[21px] leading-none transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110">
            {category.icon}
          </span>
          <span className="text-[14px] font-bold tracking-tight text-ink group-hover:text-brand-deep">
            {category.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
