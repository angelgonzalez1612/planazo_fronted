import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // picsum.photos is the placeholder photo provider used by src/lib/data/photo.ts
    // while there's no real backend/storage. Add the Supabase Storage hostname
    // (<project-ref>.supabase.co) once provisioned, and drop picsum.photos then.
    // images.unsplash.com: free-license stock photos for real places (see places.json)
    // that don't have an actual photo of the business yet.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
