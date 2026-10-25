import Nav from "@/components/ui/Nav";
import Reveal from "@/components/ui/Reveal";
import FloatingCan from "@/components/can/FloatingCan";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Marquee from "@/components/sections/Marquee";
import Features from "@/components/sections/Features";
import Balancer from "@/components/sections/Balancer";
import Naehrwerte from "@/components/sections/Naehrwerte";
import Faq from "@/components/sections/Faq";
import Kaufen from "@/components/sections/Kaufen";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Reveal />
      <FloatingCan />
      <main>
        <Hero />
        <Intro />
        <Marquee />
        <Features />
        <Balancer />
        <Naehrwerte />
        <Faq />
        <Kaufen />
      </main>
      <Footer />
    </>
  );
}
