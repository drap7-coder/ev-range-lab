import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "EV Range Lab — Explore real-world electric range",
    description: "An interactive lab for learning how cars, trips, weather, speed, terrain, climate, and load affect EV range.",
    manifest: "/manifest.webmanifest?v=4",
    icons: {
      icon: [
        { url: "/icons/favicon-16-v4.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/favicon-32-v4.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon-v4.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: "EV Range Lab",
      description: "See how far your EV can really go.",
      images: [{ url: "/hero-silhouette.png", width: 1728, height: 909, alt: "EV Range Lab" }],
    },
    twitter: { card: "summary_large_image", images: ["/hero-silhouette.png"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geist.variable} ${geistMono.variable}`}>{children}</body></html>;
}
