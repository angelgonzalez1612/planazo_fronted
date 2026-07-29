import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import { siteConfig } from "@planazo/config";
import { getSiteContent } from "@/lib/data";
import { AppProviders } from "@/components/providers/app-providers";
import { BackToTop } from "@/components/back-to-top";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
  },
};

// Tells Google this domain *is* the "Planazo" entity — the single biggest
// lever for ranking well when someone searches the brand name itself.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  sameAs: Object.values(siteConfig.social),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { newsletterCount } = getSiteContent();

  return (
    <html
      lang="es-MX"
      className={`${sora.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <AppProviders subscriberCount={newsletterCount}>
          {children}
        </AppProviders>
        <BackToTop />
      </body>
    </html>
  );
}
