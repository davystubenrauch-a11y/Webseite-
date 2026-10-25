/** Full-bleed studio video of the can (scripts/render_scenes.py --mode video), looping. */
export default function Hero() {
  return (
    <section id="top" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-set">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        poster="/media/poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Die SPIRULI Dose dreht sich langsam im Studiolicht"
      >
        <source src="/media/can-loop.webm" type="video/webm" />
        <source src="/media/can-loop.mp4" type="video/mp4" />
      </video>
      {/* Hide the floor glare at the edges and blend into the page. */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(75%_70%_at_50%_42%,transparent_55%,#214043_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-night-deep" />

      <div className="wrap relative flex h-full flex-col justify-end pb-10 sm:pb-14">
        <div className="grid items-end gap-8 md:grid-cols-[1.3fr_1fr]">
          <h1 className="display text-[19vw] text-cream md:text-[9.5vw]">
            Der <em className="text-gold-soft">Balancer.</em>
          </h1>
          <div className="max-w-sm pb-3 md:justify-self-end">
            <p className="text-lg leading-relaxed text-cream/80">
              Spritzig, leicht und vegan – mit Holunder, Zitrone und der Mikroalge Spirulina. Made in Germany.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#kaufen" className="btn bg-cream text-ink hover:bg-gold-soft">
                Jetzt probieren
              </a>
              <a href="#geschmack" className="btn border border-cream/30 text-cream hover:border-cream">
                Entdecken
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
