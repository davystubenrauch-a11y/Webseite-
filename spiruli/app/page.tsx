import Nav from "@/components/ui/Nav";
import ScrollStory from "@/components/ui/ScrollStory";
import Hero from "@/components/sections/Hero";
import Name from "@/components/sections/Name";
import Band from "@/components/sections/Band";
import CanSequence from "@/components/stage/CanSequence";
import Zutaten from "@/components/sections/Zutaten";
import Naehrwerte from "@/components/sections/Naehrwerte";
import Momente from "@/components/sections/Momente";
import Qualitaet from "@/components/sections/Qualitaet";
import Faq from "@/components/sections/Faq";
import Kaufen from "@/components/sections/Kaufen";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <ScrollStory />
      {/* One photoreal can (Blender turntable) travels through the page; poses come from <CanPose> anchors. */}
      <CanSequence />
      <main>
        <Hero />
        <Name />
        <Band />
        <Zutaten />
        <Naehrwerte />
        <Momente />
        <Qualitaet />
        <Faq />
        <Kaufen />
      </main>
      <Footer />
    </>
  );
}
