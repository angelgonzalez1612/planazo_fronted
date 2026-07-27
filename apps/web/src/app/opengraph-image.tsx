import { ImageResponse } from "next/og";
import { siteConfig } from "@planazo/config";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 32, marginTop: 16, opacity: 0.8 }}>
          {siteConfig.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
