import Nav from "@/components/ui/Nav";
import ChapterRail from "@/components/ui/ChapterRail";
import CursorGlow from "@/components/ui/CursorGlow";
import ScrollStory from "@/components/ui/ScrollStory";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Customizer from "@/components/sections/Customizer";
import RoiCalculator from "@/components/sections/RoiCalculator";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <Nav />
      <ChapterRail />
      <ScrollStory />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Customizer />
        <RoiCalculator />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
