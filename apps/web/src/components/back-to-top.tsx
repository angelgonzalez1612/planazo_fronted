"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setShow(scrollable > 0 && window.scrollY / scrollable > 0.5);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Subir arriba"
      title="Subir arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-4 bottom-4 z-40 grid size-[46px] place-items-center rounded-full bg-ink text-white shadow-[0_14px_30px_-14px_rgba(25,21,18,0.5)] transition-[opacity,transform,background-color] duration-200 hover:bg-brand sm:right-8 sm:bottom-8 ${
        show ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-90 opacity-0"
      }`}
    >
      <span className="text-lg leading-none">↑</span>
    </button>
  );
}
