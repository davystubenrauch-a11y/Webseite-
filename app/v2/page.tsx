import type { Metadata } from "next";
import Footer from "@/components/sections/Footer";
import Inquiry from "@/components/sections/Inquiry";
import Faq from "@/components/v2/Faq";
import HeroBento from "@/components/v2/HeroBento";
import NavV2 from "@/components/v2/NavV2";
import Pricing from "@/components/v2/Pricing";
import Process from "@/components/v2/Process";
import Showcase from "@/components/v2/Showcase";
import Team from "@/components/v2/Team";
import { navV2 } from "@/components/v2/nav";

// Alternative layout (design preview). Same content, data and wizard as "/", different structure.
export const metadata: Metadata = {
  title: "F&D Solutions | Bewertungen, Websites & Roomtours aus München",
  robots: { index: false },
};

export default function HomeV2() {
  return (
    <>
      <NavV2 />
      <main>
        <HeroBento />
        <Showcase />
        <Process />
        <Pricing />
        <Team />
        <Faq />
        <Inquiry />
      </main>
      <Footer navItems={navV2} base="/v2" />
    </>
  );
}
