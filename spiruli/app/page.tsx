import Nav from "@/components/ui/Nav";
import ScrollStory from "@/components/ui/ScrollStory";
import Hero from "@/components/sections/Hero";
import Benefits from "@/components/sections/Benefits";
import Story from "@/components/sections/Story";
import Flavor from "@/components/sections/Flavor";
import NutrientMatrix from "@/components/sections/NutrientMatrix";
import Quality from "@/components/sections/Quality";
import Bezug from "@/components/sections/Bezug";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <ScrollStory />
      <main>
        <Hero />
        <Benefits />
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
