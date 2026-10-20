import Nav from "@/components/ui/Nav";
import CursorGlow from "@/components/ui/CursorGlow";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Configurator from "@/components/sections/Configurator";
import Trust from "@/components/sections/Trust";
import Inquiry from "@/components/sections/Inquiry";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Configurator />
        <Trust />
        <Inquiry />
      </main>
      <Footer />
    </>
  );
}
