import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import GalleryGrid from "./GalleryGrid";

export const metadata: Metadata = {
  title: "Galleria | Mini & Basket Camp 2025",
  description: "Scopri i momenti più belli del Mini & Basket Camp attraverso foto e video delle nostre edizioni precedenti.",
};

export default function GalleriaPage() {
  return (
    <>
      <Navigation />
      <div className="max-w-[1440px] mx-auto" id="page-container">
        <main className="p-4 md:p-8">
          <PageHero
            title="GALLERIA"
            subtitle="Rivivi i momenti più emozionanti delle nostre edizioni precedenti"
            badge="📸 I Nostri Momenti"
            backgroundImage="https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=1200&q=80"
            gradient="orange"
          />

          {/* Gallery Section */}
          <section className="mt-12">
            <GalleryGrid />
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}