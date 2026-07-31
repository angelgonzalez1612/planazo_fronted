"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotType = "display" | "feed";

// The two ad unit shapes configured in AdSense: a responsive display unit
// for banners/rectangles, and an in-feed unit for the ones inserted between
// plan cards in a grid.
const AD_FORMAT: Record<AdSlotType, { format: string; layoutKey?: string }> = {
  display: { format: "auto" },
  feed: { format: "fluid", layoutKey: "-6t+ed+2i-1n-4w" },
};

export function AdSlot({
  size,
  className = "",
  dark = false,
  type = "display",
}: {
  size: string;
  className?: string;
  dark?: boolean;
  type?: AdSlotType;
}) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slot =
    type === "feed"
      ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_FEED
      : process.env.NEXT_PUBLIC_ADSENSE_SLOT_DISPLAY;
  const pushed = useRef(false);

  useEffect(() => {
    if (!clientId || !slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not ready yet — safe to skip, nothing else to retry here.
    }
  }, [clientId, slot]);

  if (clientId && slot) {
    const { format, layoutKey } = AD_FORMAT[type];
    const extraAttrs: Record<string, string> = { "data-ad-format": format };
    if (layoutKey) extraAttrs["data-ad-layout-key"] = layoutKey;
    if (format === "auto") extraAttrs["data-full-width-responsive"] = "true";

    return (
      <ins
        className={`adsbygoogle block ${className}`}
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        {...extraAttrs}
      />
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl border border-dashed p-3.5 text-center text-xs font-semibold ${
        dark
          ? "border-border-dark bg-surface-dark text-ink-soft"
          : "border-[#E0D9D2] bg-[#FBF8F5] text-[#756C65]"
      } ${className}`}
    >
      <span
        className={`absolute top-2 left-3 text-[10px] font-bold tracking-widest uppercase ${
          dark ? "text-[#4D453F]" : "text-[#756C65]"
        }`}
      >
        Publicidad
      </span>
      Espacio publicitario · {size}
    </div>
  );
}
