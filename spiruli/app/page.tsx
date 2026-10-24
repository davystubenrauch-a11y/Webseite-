import Nav from "@/components/ui/Nav";
import ScrollStory from "@/components/ui/ScrollStory";
import LazyCanStage from "@/components/stage/LazyCanStage";
import Hero from "@/components/sections/Hero";
import Angle from "@/components/sections/Angle";
import Split from "@/components/sections/Split";
import Ticker from "@/components/sections/Ticker";
import Detail from "@/components/sections/Detail";
import Zutaten from "@/components/sections/Zutaten";
import Naehrstoffe from "@/components/sections/Naehrstoffe";
import Team from "@/components/sections/Team";
import Qualitaet from "@/components/sections/Qualitaet";
import Kaufen from "@/components/sections/Kaufen";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <ScrollStory />
      {/* One real-time 3D can travels through every section; poses live on each section's data-can. */}
      <LazyCanStage />
      <main>
        <Hero />
        <Ticker />
        <Angle />
        <Split />
        <Detail />
        <Zutaten />
        <Naehrstoffe />
        <Team />
        <Qualitaet />
        <Kaufen />
      </main>
      <Footer />
    </>
  );
}
