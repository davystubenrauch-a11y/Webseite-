import Nav from "@/components/ui/Nav";
import Reveal from "@/components/ui/Reveal";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Preloader from "@/components/ui/Preloader";
import Cursor from "@/components/ui/Cursor";
import FloatingCan from "@/components/can/FloatingCan";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Explosion from "@/components/sections/Explosion";
import Manifest from "@/components/sections/Manifest";
import Prozess from "@/components/sections/Prozess";
import Analytik from "@/components/sections/Analytik";
import Gruende from "@/components/sections/Gruende";
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
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <FloatingCan />
      <main>
        <Hero />
        <Intro />
        <Manifest />
        <Explosion />
        <Marquee />
        <Features />
        <Prozess />
        <Analytik />
        <Gruende />
        <Balancer />
        <Naehrwerte />
        <Faq />
        <Kaufen />
      </main>
      <Footer />
    </>
  );
}
