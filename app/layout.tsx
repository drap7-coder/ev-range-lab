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
    title: "EV Range Lab — Know your real-world range",
    description: "Choose an EV, shape the drive, and see your estimated arrival charge instantly.",
    manifest: "/manifest.webmanifest?v=5",
    icons: {
      icon: [
        { url: "/icons/favicon-16-v5.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/favicon-32-v5.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon-v5.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: "EV Range Lab",
      description: "Know your real-world EV range before you drive.",
      images: [{ url: "/og.png", width: 1672, height: 941, alt: "EV Range Lab" }],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geist.variable} ${geistMono.variable}`}>{children}</body></html>;
}
