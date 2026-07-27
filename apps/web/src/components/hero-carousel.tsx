"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const MONUMENTS = [
  { file: "/img/angel-independencia.jpg", name: "Ángel de la Independencia" },
  { file: "/img/monumento-revolucion.jpg", name: "Monumento a la Revolución" },
  { file: "/img/museo-soumaya.jpg", name: "Museo Soumaya" },
  { file: "/img/bellas-artes.jpg", name: "Palacio de Bellas Artes" },
  { file: "/img/catedral-metropolitana.jpg", name: "Catedral Metropolitana" },
  { file: "/img/torre-latinoamericana.jpg", name: "Torre Latinoamericana" },
];

function CarouselSlot({
  startIndex,
  priority,
  className,
}: {
  startIndex: number;
  priority?: boolean;
  className: string;
}) {
  const [index, setIndex] = useState(startIndex);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      const timeout = setTimeout(() => {
        setIndex((i) => (i + 1) % MONUMENTS.length);
        setVisible(true);
      }, 450);
      return () => clearTimeout(timeout);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const monument = MONUMENTS[index];

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-secondary ${className}`}>
      <Image
        src={monument.file}
        alt={monument.name}
        fill
        priority={priority}
        sizes="(min-width:1024px) 20vw, 40vw"
        className={`object-cover transition-opacity duration-450 ${visible ? "opacity-100" : "opacity-0"}`}
      />
      <span className="absolute bottom-3 left-3 rounded-full bg-ink/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-xs">
        {monument.name}
      </span>
    </div>
  );
}

export function HeroCarousel() {
  return (
    <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-3.5" style={{ minWidth: 280, flexBasis: 380 }}>
      <CarouselSlot startIndex={0} priority className="col-span-1 row-span-2 aspect-[3/4.4] shadow-[0_24px_50px_-28px_rgba(25,21,18,0.4)]" />
      <CarouselSlot startIndex={2} className="aspect-4/3" />
      <CarouselSlot startIndex={4} className="aspect-4/3" />
    </div>
  );
}
