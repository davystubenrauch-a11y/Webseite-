import Nav from "@/components/ui/Nav";
import ScrollStory from "@/components/ui/ScrollStory";
import Hero from "@/components/sections/Hero";
import Name from "@/components/sections/Name";
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
      <main>
        <Hero />
        <Name />
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
