/** Full-bleed studio video of the can (scripts/render_scenes.py --mode video), looping. */
export default function Hero() {
  return (
    <section id="top" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-sand">
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
      {/* The video's backdrop is exactly bg-sand; fade the can's foot for the headline. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-sand/0 to-sand" />
      <img aria-hidden src="/props/berries-a.webp" alt="" className="animate-float pointer-events-none absolute left-[8%] top-[18%] hidden w-[11vw] max-w-44 -rotate-12 drop-shadow-[0_30px_25px_rgba(19,43,46,0.22)] md:block" />
      <img aria-hidden src="/props/lemon-a.webp" alt="" className="animate-float-slow pointer-events-none absolute right-[9%] top-[30%] hidden w-[9vw] max-w-36 rotate-12 drop-shadow-[0_30px_25px_rgba(19,43,46,0.22)] md:block" />

      <div className="wrap relative flex h-full flex-col justify-end pb-10 sm:pb-14">
        <div className="grid items-end gap-8 md:grid-cols-[1.3fr_1fr]">
          <h1 className="display text-[19vw] text-ink md:text-[9.5vw]">
            Der <em className="text-teal">Balancer.</em>
          </h1>
          <div className="max-w-sm pb-3 md:justify-self-end">
            <p className="text-lg leading-relaxed text-ink/75">
              Spritzig, leicht und vegan – mit Holunder, Zitrone und der Mikroalge Spirulina. Made in Germany.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#kaufen" className="btn bg-ink text-cream hover:bg-teal">
                Jetzt probieren
              </a>
              <a href="#geschmack" className="btn border border-ink/25 text-ink hover:border-ink">
                Entdecken
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
