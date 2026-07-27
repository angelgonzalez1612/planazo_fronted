"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { PhotoRef } from "@/data/types";
import { resolvePhoto } from "@/lib/data";

export function PlanGallery({ gallery, cover }: { gallery: PhotoRef[]; cover: PhotoRef }) {
  const photos = gallery.length > 0 ? gallery : [cover];
  const thumbs = photos.slice(1, 5);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex, photos.length]);

  const hero = resolvePhoto(photos[0]);
  const current = openIndex !== null ? resolvePhoto(photos[openIndex]) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenIndex(0)}
        className="relative mt-5.5 block aspect-video w-full overflow-hidden rounded-2xl bg-secondary"
      >
        <Image src={hero.url} alt={hero.alt} fill priority sizes="(min-width:1024px) 800px, 100vw" className="object-cover" />
      </button>

      {thumbs.length > 0 && (
        <div className="mt-2.5 grid grid-cols-4 gap-2.5">
          {thumbs.map((photo, i) => {
            const resolved = resolvePhoto(photo);
            return (
              <button
                key={i}
                type="button"
                onClick={() => setOpenIndex(i + 1)}
                className="relative aspect-square overflow-hidden rounded-[14px] bg-secondary"
              >
                <Image src={resolved.url} alt={resolved.alt} fill sizes="150px" className="object-cover" />
              </button>
            );
          })}
        </div>
      )}

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galería de fotos"
          onClick={() => setOpenIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Cerrar"
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
          >
            ✕
          </button>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
              }}
              aria-label="Anterior"
              className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:left-6"
            >
              ‹
            </button>
          )}

          <div
            className="relative aspect-video max-h-[85vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={current.url} alt={current.alt} fill sizes="90vw" className="object-contain" />
          </div>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length));
              }}
              aria-label="Siguiente"
              className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:right-6"
            >
              ›
            </button>
          )}

          {photos.length > 1 && (
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">
              {openIndex! + 1} / {photos.length}
            </span>
          )}
        </div>
      )}
    </>
  );
}
