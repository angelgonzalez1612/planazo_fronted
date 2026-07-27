"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@planazo/config";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  // Built from the route, not window.location — identical on server and client,
  // so it doesn't cause a hydration mismatch.
  const pathname = usePathname();
  const shareUrl = `${siteConfig.url}${pathname}`;

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — nothing to fall back to here
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url: shareUrl });
    } catch {
      // user cancelled the share sheet — nothing to do
    }
  }

  const encodedTitle = encodeURIComponent(title);
  const iconBtn =
    "grid size-11 flex-none place-items-center rounded-full border border-border bg-card text-ink-soft transition-colors duration-150";

  return (
    <div className="mt-6 flex items-center gap-4 border-t border-[#F2EEEA] pt-5">
      <span className="text-xs font-bold tracking-wide text-ink-soft uppercase">Compartir</span>
      <div className="flex flex-wrap items-center gap-2.5">
        <a
          title="Compartir en Facebook"
          aria-label="Compartir en Facebook"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${iconBtn} hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34v7.03C18.34 21.21 22 17.06 22 12.06Z" />
          </svg>
        </a>
        <a
          title="Compartir en X"
          aria-label="Compartir en X"
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${iconBtn} hover:border-ink hover:bg-ink hover:text-white`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a
          title="Compartir por WhatsApp"
          aria-label="Compartir por WhatsApp"
          href={`https://wa.me/?text=${encodedTitle}%20${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${iconBtn} hover:border-[#25D366] hover:bg-[#25D366] hover:text-white`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.6 15.02L2 22l5.12-1.35A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31A8.2 8.2 0 1 1 12 20.2Zm4.5-6.15c-.24-.12-1.44-.71-1.67-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.2-1.42-1.34-1.66-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.48-.4-.41-.55-.41h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.11-.22-.17-.46-.29Z" />
          </svg>
        </a>
        <a
          title="Compartir por Telegram"
          aria-label="Compartir por Telegram"
          href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${iconBtn} hover:border-[#26A5E4] hover:bg-[#26A5E4] hover:text-white`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M21.9 4.36 18.7 19.8c-.24 1.07-.87 1.33-1.76.83l-4.86-3.58-2.35 2.26c-.26.26-.48.48-.97.48l.35-4.94 8.99-8.12c.39-.35-.09-.54-.6-.2L6.03 13.1 1.16 11.56c-1.06-.33-1.08-1.06.22-1.57L20.53 3.1c.88-.33 1.65.2 1.37 1.26Z" />
          </svg>
        </a>
        <a
          title="Compartir por correo"
          aria-label="Compartir por correo"
          href={`mailto:?subject=${encodedTitle}&body=${encodeURIComponent(shareUrl)}`}
          className={`${iconBtn} hover:border-brand hover:bg-brand hover:text-white`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3.5 6 12 13l8.5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        {canNativeShare && (
          <button
            type="button"
            title="Más opciones (Instagram y más)"
            aria-label="Más opciones para compartir, incluyendo Instagram"
            onClick={nativeShare}
            className={`${iconBtn} hover:border-[#E1306C] hover:bg-[#E1306C] hover:text-white`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="18" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="6" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="18" cy="19" r="2.6" stroke="currentColor" strokeWidth="1.7" />
              <path d="M8.3 10.7 15.7 6.6M8.3 13.3l7.4 4.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <button
          type="button"
          title="Copiar enlace"
          aria-label="Copiar enlace"
          onClick={copyLink}
          className={`${iconBtn} ${copied ? "border-positive bg-positive text-white" : "hover:border-brand hover:bg-brand hover:text-white"}`}
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M9.5 14.5 14.5 9.5 M11 8l1.3-1.3a3.5 3.5 0 0 1 5 5L16 13 M13 16l-1.3 1.3a3.5 3.5 0 0 1-5-5L8 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
