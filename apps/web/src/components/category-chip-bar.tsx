import Link from "next/link";
import type { Category } from "@/data/types";
import { categoryHref } from "@/lib/data";

export function CategoryChipBar({ categories }: { categories: Category[] }) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1.5">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={categoryHref(category.id)}
          className="group flex flex-none items-center gap-2 rounded-full border-[1.5px] border-transparent bg-secondary px-4 py-2.5 pl-4 text-[15px] font-bold text-ink transition-colors hover:border-peach hover:bg-card hover:text-brand-deep"
        >
          <span className="inline-block text-lg leading-none transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110">
            {category.icon}
          </span>
          {category.label}
        </Link>
      ))}
    </div>
  );
}
