import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Configurator from "@/components/sections/Configurator";
import Trust from "@/components/sections/Trust";
import Inquiry from "@/components/sections/Inquiry";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <Hero />
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
