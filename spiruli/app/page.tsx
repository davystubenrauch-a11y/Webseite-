import Nav from "@/components/ui/Nav";
import Reveal from "@/components/ui/Reveal";
import Hero from "@/components/sections/Hero";
import Statement from "@/components/sections/Statement";
import Details from "@/components/sections/Details";
import Zutaten from "@/components/sections/Zutaten";
import Marquee from "@/components/sections/Marquee";
import Packshot from "@/components/sections/Packshot";
import Naehrwerte from "@/components/sections/Naehrwerte";
import Faq from "@/components/sections/Faq";
import Kaufen from "@/components/sections/Kaufen";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Reveal />
      <main>
        <Hero />
        <Statement />
        <Details />
        <Zutaten />
        <Marquee />
        <Packshot />
        <Naehrwerte />
        <Faq />
        <Kaufen />
      </main>
      <Footer />
    </>
  );
}
