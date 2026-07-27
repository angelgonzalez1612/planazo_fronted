import Image from "next/image";
import Link from "next/link";
import type { Guide } from "@/data/types";
import { resolvePhoto } from "@/lib/data";

export function GuidesSection({ guides }: { guides: Guide[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => {
        const photo = resolvePhoto(guide.cover);
        return (
          <Link key={guide.id} href={`/guias/${guide.slug}`} className="group flex flex-col gap-3.5">
            <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-secondary">
              <Image src={photo.url} alt={photo.alt} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold tracking-wider text-brand uppercase">{guide.categoryLabel}</span>
              <h3 className="text-wrap-pretty font-heading text-[21px] leading-snug font-bold tracking-tight group-hover:text-brand">
                {guide.title}
              </h3>
              <span className="text-[13px] text-ink-soft">{guide.readTime}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
