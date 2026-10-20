import Nav from "@/components/ui/Nav";
import ChapterRail from "@/components/ui/ChapterRail";
import CursorGlow from "@/components/ui/CursorGlow";
import ScrollStory from "@/components/ui/ScrollStory";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Story from "@/components/sections/Story";
import Flavor from "@/components/sections/Flavor";
import NutrientMatrix from "@/components/sections/NutrientMatrix";
import Quality from "@/components/sections/Quality";
import Bezug from "@/components/sections/Bezug";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <Nav />
      <ChapterRail />
      <ScrollStory />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Story />
        <Flavor />
        <NutrientMatrix />
        <Quality />
        <Bezug />
      </main>
      <Footer />
    </>
  );
}
