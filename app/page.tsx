import Footer from "@/components/sections/Footer";
import Inquiry from "@/components/sections/Inquiry";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Faq from "@/components/v2/Faq";
import NavV2 from "@/components/v2/NavV2";
import Pricing from "@/components/v2/Pricing";
import Process from "@/components/v2/Process";
import Team from "@/components/v2/Team";
import ChipReveal from "@/components/v3/ChipReveal";
import HeroV3 from "@/components/v3/HeroV3";
import RoomTourSection from "@/components/v3/RoomTourSection";
import WebCompare from "@/components/v3/WebCompare";
import { navV3 } from "@/components/v3/nav";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <NavV2 items={navV3} />
      <main>
        <HeroV3 />
        <ChipReveal />
        <WebCompare />
        <RoomTourSection />
        <Process />
        <Pricing />
        <Team />
        <Faq />
        <Inquiry />
      </main>
      <Footer navItems={navV3} serviceAnchors />
    </>
  );
}
