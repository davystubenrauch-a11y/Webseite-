import Footer from "@/components/sections/Footer";
import Inquiry from "@/components/sections/Inquiry";
import Hero from "@/components/home/Hero";
import NfcHowTo from "@/components/home/NfcHowTo";
import ServiceCards from "@/components/home/ServiceCards";
import { homeNav } from "@/components/home/nav";
import Faq from "@/components/v2/Faq";
import NavV2 from "@/components/v2/NavV2";
import Pricing from "@/components/v2/Pricing";
import Team from "@/components/v2/Team";

// Main page: clear structure, colour-coded services, one calm 3D product.
export default function Home() {
  return (
    <>
      <NavV2 items={homeNav} />
      <main>
        <Hero />
        <ServiceCards />
        <NfcHowTo />
        <Pricing />
        <Team />
        <Faq />
        <Inquiry />
      </main>
      <Footer navItems={homeNav} />
    </>
  );
}
