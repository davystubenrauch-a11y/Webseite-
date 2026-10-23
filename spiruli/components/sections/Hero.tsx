"use client";

import { motion } from "framer-motion";
import Pattern from "@/components/ui/Pattern";
import Stamp from "@/components/ui/Stamp";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section
      id="top"
      data-can='{"x":0,"y":-0.3,"s":0.92,"ry":0,"rx":0.06,"rz":0}'
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-algae pt-20 text-lime"
    >
      <Pattern color="#237A45" />
      <div className="wrap relative flex flex-1 flex-col">
        <div className="dotted mt-2 text-lime/60" />
        <p className="micro mt-6 text-center text-lime/80">Fermentiertes Algen-Getränk · Holunder · Zitrus · Spirulina</p>

        <h1 className="mt-4 text-center">
          <span className="block overflow-hidden">
            <motion.span
              className="mega block text-[18vw] text-lime xl:text-[16.5rem]"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease }}
            >
              Spiruli
            </motion.span>
          </span>
          <motion.span
            className="mega mt-2 block text-[6.4vw] text-lime-soft lg:text-[5.2rem]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.25 }}
          >
            Natürliche Energie
          </motion.span>
        </h1>

        {/* Room for the can, which floats in from the stage above the page. */}
        <div className="min-h-[26svh] flex-1" />

        <div className="flex items-end justify-between gap-6 pb-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="max-w-[17rem]">
            <p className="micro text-lime">
              Das vegane &amp; natürliche Mehrwertgetränk mit natürlichen B-Vitaminen und essentiellen Aminosäuren.
            </p>
            <a href="#kaufen" className="pill mt-4 bg-lime text-ink">
              Jetzt probieren →
            </a>
          </motion.div>
          <Stamp
            text="VEGAN · FERMENTIERT · NATÜRLICH · "
            color="#D7F25A"
            className="w-24 sm:w-28"
            center={<span className="mega block text-2xl leading-none">Neu</span>}
          />
        </div>
      </div>
    </section>
  );
}
