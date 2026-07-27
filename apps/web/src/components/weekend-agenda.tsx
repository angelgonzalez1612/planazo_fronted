import Image from "next/image";
import Link from "next/link";
import type { EventItem } from "@/data/types";
import { resolvePhoto } from "@/lib/data";

export function WeekendAgenda({ events }: { events: EventItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {events.map((event) => {
        const photo = resolvePhoto(event.cover);
        return (
          <Link
            key={event.id}
            href={`/eventos/${event.slug}`}
            className="flex items-stretch gap-4 rounded-xl border border-border-dark bg-surface-dark p-3.5"
          >
            <div className="relative w-[clamp(110px,26%,168px)] flex-none overflow-hidden rounded-xl bg-border-dark">
              <Image src={photo.url} alt={photo.alt} fill sizes="168px" className="object-cover" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2 px-0.5 py-1">
              <span className="text-xs font-bold tracking-wider text-[#FF8A45] uppercase">
                {event.weekend?.day} · {event.weekend?.time}
              </span>
              <h3 className="font-heading text-lg leading-tight font-bold tracking-tight text-white">
                {event.name}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-[#A79E97]">{event.description}</p>
              <div className="mt-auto flex items-center gap-3 pt-2 text-[13px] text-[#CFC7C1]">
                <span>{event.zone}</span>
                <span className="text-border-dark">·</span>
                <span className="font-bold text-white">{event.priceLabel}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
