import Nav from "@/components/ui/Nav";
import Reveal from "@/components/ui/Reveal";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Preloader from "@/components/ui/Preloader";
import FloatingCan from "@/components/can/FloatingCan";
import CartDrawer from "@/components/shop/CartDrawer";
import Shop from "@/components/shop/Shop";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Explosion from "@/components/sections/Explosion";
import Features from "@/components/sections/Features";
import Prozess from "@/components/sections/Prozess";
import Analytik from "@/components/sections/Analytik";
import Gruende from "@/components/sections/Gruende";
import Naehrwerte from "@/components/sections/Naehrwerte";
import Faq from "@/components/sections/Faq";
import Kaufen from "@/components/sections/Kaufen";
import Footer from "@/components/sections/Footer";
import { CartProvider } from "@/lib/cart";

export default function Home() {
  return (
    <CartProvider>
      <Nav />
      <Reveal />
      <SmoothScroll />
      <Preloader />
      <FloatingCan />
      <CartDrawer />
      <main>
        <Hero />
        <Intro />
        <Explosion />
        <Features />
        <Shop />
        <Prozess />
        <Analytik />
        <Gruende />
        <Naehrwerte />
        <Faq />
        <Kaufen />
      </main>
      <Footer />
    </CartProvider>
  );
}
