import Footer from "@/components/sections/Footer";
import Inquiry from "@/components/sections/Inquiry";
import FaqPanel from "@/components/split/FaqPanel";
import MobileBar from "@/components/split/MobileBar";
import NfcPanel from "@/components/split/NfcPanel";
import Overview from "@/components/split/Overview";
import PricingPanel from "@/components/split/PricingPanel";
import ServiceTiles from "@/components/split/ServiceTiles";
import Sidebar from "@/components/split/Sidebar";
import TeamPanel from "@/components/split/TeamPanel";

// Split layout: a fixed left column (message, index, contact) and scrolling content on the right.
export default function Home() {
  return (
    <>
      <MobileBar />
      <div className="lg:grid lg:grid-cols-[minmax(400px,38%)_1fr]">
        <Sidebar />
        <div className="min-w-0 lg:border-l lg:border-line">
          <main>
            <Overview />
            <ServiceTiles />
            <NfcPanel />
            <PricingPanel />
            <TeamPanel />
            <FaqPanel />
            <Inquiry />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
