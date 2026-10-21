import Nav from "@/components/ui/Nav";
import ScrollStory from "@/components/ui/ScrollStory";
import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import Manifest from "@/components/sections/Manifest";
import Journey from "@/components/sections/Journey";
import CanDetail from "@/components/sections/CanDetail";
import Nutrients from "@/components/sections/Nutrients";
import Makers from "@/components/sections/Makers";
import Trust from "@/components/sections/Trust";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <ScrollStory />
      <main>
        <Hero />
        <Ticker />
        <Manifest />
        <Journey />
        <CanDetail />
        <Nutrients />
        <Makers />
        <Trust />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
