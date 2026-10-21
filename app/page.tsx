import Footer from "@/components/sections/Footer";
import Inquiry from "@/components/sections/Inquiry";
import Faq from "@/components/premium/Faq";
import Hero from "@/components/premium/Hero";
import Nav from "@/components/premium/Nav";
import NfcFeature from "@/components/premium/NfcFeature";
import Pricing from "@/components/premium/Pricing";
import Process from "@/components/premium/Process";
import Services from "@/components/premium/Services";
import Statement from "@/components/premium/Statement";
import Team from "@/components/premium/Team";
import Testimonials from "@/components/premium/Testimonials";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Services />
        <NfcFeature />
        <Process />
        <Pricing />
        <Testimonials />
        <Team />
        <Faq />
        <Inquiry />
      </main>
      <Footer />
    </>
  );
}
