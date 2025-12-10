import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import StaffGrid from "./StaffGrid";

export const metadata: Metadata = {
  title: "Il Nostro Staff | Mini & Basket Camp 2025",
  description: "Scopri il team di professionisti che renderà indimenticabile l'esperienza al Mini & Basket Camp 2025.",
};

export default function StaffPage() {
  return (
    <>
      <Navigation />
      <div className="max-w-[1440px] mx-auto" id="page-container">
        <main className="p-4 md:p-8">
          <PageHero
            title="IL NOSTRO STAFF"
            subtitle="Un team di professionisti appassionati dedicati alla crescita dei giovani atleti"
            badge="👥 Il Nostro Team"
            backgroundImage="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80"
            gradient="green"
          />

          {/* Staff Section */}
          <section className="mt-12">
            <StaffGrid />
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}