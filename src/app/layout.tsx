import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://miniandbasketcamp.it";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mini & Basket Camp 2025 | Camp Estivo di Basket per Ragazzi",
    template: "%s | Mini & Basket Camp 2025",
  },
  description:
    "Camp estivo di basket per giovani atleti dai 6 ai 14 anni. 29 Giugno - 6 Luglio 2025 a Paola (CS). Allenamenti, mare, divertimento e amicizia!",
  keywords: [
    "camp basket",
    "camp estivo basket",
    "basket ragazzi",
    "camp sportivo",
    "basket calabria",
    "mini basket",
    "camp 2025",
    "vacanza sportiva",
    "camp basket italia",
    "basket bambini",
  ],
  authors: [{ name: "Mini & Basket Camp" }],
  creator: "Mini & Basket Camp",
  publisher: "Mini & Basket Camp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName: "Mini & Basket Camp 2025",
    title: "Mini & Basket Camp 2025 | Camp Estivo di Basket per Ragazzi",
    description:
      "Un'esperienza indimenticabile per giovani atleti dai 6 ai 14 anni. Basket, mare e divertimento dal 29 Giugno al 6 Luglio 2025!",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mini & Basket Camp 2025 - Camp Estivo di Basket",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mini & Basket Camp 2025 | Camp Estivo di Basket",
    description:
      "Camp estivo di basket per ragazzi 6-14 anni. 29 Giugno - 6 Luglio 2025 a Paola (CS).",
    images: ["/og-image.jpg"],
    creator: "@minibasketcamp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "sports",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#40C057" },
    { media: "(prefers-color-scheme: dark)", color: "#2F9E44" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${poppins.variable} font-sans bg-brand-beige text-brand-dark antialiased`}
      >
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}