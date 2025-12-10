import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import InfoBar from "@/components/InfoBar";
import ExperienceSection from "@/components/ExperienceSection";
import ProgramHighlights from "@/components/ProgramHighlights";
import FacilitiesGrid from "@/components/FacilitiesGrid";
import PricingCards from "@/components/PricingCards";
import PaymentInfo from "@/components/PaymentInfo";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import StaffPreview from "@/components/StaffPreview";
import GalleryPreview from "@/components/GalleryPreview";
import PartnersGrid from "@/components/PartnersGrid";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="max-w-[1440px] mx-auto" id="page-container">
        {/* Main Page Layout */}
        <main className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-4 md:p-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-12">
            <Hero />
            <InfoBar />
            <ExperienceSection />
            <ProgramHighlights />
            <FacilitiesGrid />
            <PricingCards />
            <PaymentInfo />
          </div>

          {/* Right Column (Sidebar) */}
          <div className="xl:col-span-1 space-y-16">
            <TestimonialsCarousel />
            <StaffPreview />
            <GalleryPreview />
            <PartnersGrid />
          </div>
        </main>

        {/* Full Width Sections */}
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}