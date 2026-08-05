import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

// Shared visual for every directory listing type (zona, categoría, alcaldía,
// mood, etiqueta) — same brand gradient as the site-wide default OG image,
// just swapping in the specific title/eyebrow so shares don't all look identical.
export function renderOgImage(title: string, eyebrow?: string, subtitle?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "white",
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        {eyebrow && (
          <div style={{ display: "flex", fontSize: 28, opacity: 0.7, marginBottom: 20, letterSpacing: 2, textTransform: "uppercase" }}>
            {eyebrow}
          </div>
        )}
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        {subtitle && (
          <div style={{ display: "flex", fontSize: 32, marginTop: 24, opacity: 0.8 }}>{subtitle}</div>
        )}
      </div>
    ),
    { ...ogImageSize },
  );
}
