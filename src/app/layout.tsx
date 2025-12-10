import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Mini & Basket Camp 2025",
  description:
    "Un'esperienza indimenticabile per giovani atleti dai 6 ai 14 anni. Uniamo l'apprendimento tecnico del basket al divertimento e allo sviluppo personale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${poppins.variable} font-sans bg-brand-beige text-brand-dark antialiased`}
      >
        {children}
      </body>
    </html>
  );
}