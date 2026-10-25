/** Wide studio still (scripts/render_scenes.py --mode packshot): can on the right, words on the left. */
export default function Packshot() {
  return (
    <section className="relative overflow-hidden bg-sand text-ink">
      <div data-reveal className="relative h-[85vh] min-h-[520px]">
        <img data-zoom src="/media/packshot.jpg" alt="SPIRULI Dose im Studiolicht" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[70%_50%]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-sand" />
        <div className="wrap relative flex h-full items-center">
          <div className="max-w-lg">
            <p className="eyebrow text-teal">Made in Germany</p>
            <p className="display mt-5 text-6xl sm:text-8xl">
              Gut gekühlt <em className="text-teal">am besten.</em>
            </p>
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink/70">200 ml, spritzig, vegan. Für unterwegs, den Schreibtisch oder nach dem Training.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
