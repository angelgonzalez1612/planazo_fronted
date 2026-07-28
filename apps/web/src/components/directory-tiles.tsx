import Image from "next/image";
import Link from "next/link";
import type { DirectoryTile } from "@/data/types";
import { resolvePhoto, categoryHref } from "@/lib/data";

export function DirectoryTiles({ tiles }: { tiles: DirectoryTile[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {tiles.map((tile) => {
        const photo = resolvePhoto({ seed: tile.photoSeed, alt: tile.label, width: 640, height: 717 });
        return (
          <Link
            key={tile.label}
            href={categoryHref(tile.categoryId)}
            className="group relative aspect-[1/1.12] overflow-hidden rounded-xl bg-secondary"
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              sizes="(min-width:1024px) 16vw, (min-width:640px) 33vw, 50vw"
              className="object-cover transition-[filter] duration-200 group-hover:brightness-95"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-black/0 from-40% to-black/80 p-4 text-white">
              <span className="font-heading text-[19px] font-bold tracking-tight">{tile.label}</span>
              <span className="text-[13px] text-[#E6DDD6]">
                {tile.count > 0 ? `${tile.count.toLocaleString("es-MX")} lugares` : "Próximamente"}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
