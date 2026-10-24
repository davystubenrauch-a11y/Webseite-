/**
 * Full-bleed 4K render of the can with pins on its details. The flying can
 * fades out here (pose opacity 0), so only the render shows.
 * Pin positions are percentages of the 16:9 render (scripts/render_can.py --mode still).
 */
const pins = [
  { x: 47.5, y: 44, side: "l", title: "Wortmarke", text: "Goldfolie mit grüner Mittellinie." },
  { x: 52.8, y: 30, side: "r", title: "Premium Formula", text: "Geprägtes Siegel im Lack." },
  { x: 47.8, y: 78.5, side: "l", title: "B11 · B12 · Vegan", text: "Die Kennzeichen auf dem Goldband." },
  { x: 51.5, y: 83.3, side: "r", title: "PZN 11110571", text: "In jeder Apotheke bestellbar." },
] as const;

export default function Detail() {
  return (
    <section
      id="dose"
      data-can='{"x":0,"y":0.1,"s":0.6,"ry":7.5,"rx":0,"rz":0,"o":0}'
      className="relative overflow-hidden bg-[#203b3d] text-lime"
    >
      <div className="wrap relative pt-24">
        <p className="micro text-lime/70">Die Dose im Detail</p>
        <h2 data-reveal className="mega mt-4 text-[12vw] md:text-[6.5vw]">
          Jedes Detail
          <br />
          <span className="text-lime-soft">zählt.</span>
        </h2>
      </div>

      <div className="relative mx-auto mt-6 aspect-[4/5] w-full max-w-[110rem] md:aspect-video">
        <img
          src="/renders/spiruli-4k-1920.jpg"
          srcSet="/renders/spiruli-4k-1920.jpg 1920w, /renders/spiruli-4k.jpg 3840w"
          sizes="100vw"
          alt="SPIRULI Dose, fotorealistisches 3D-Rendering"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Soft fade into the section colour at the edges. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,#203b3d_95%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#203b3d] to-transparent" />
        <ul className="hidden md:block">
          {pins.map((p) => (
            <li key={p.title} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full border-2 border-lime bg-lime/30" />
              <span className="absolute -left-2 -top-2 h-4 w-4 animate-ping rounded-full bg-lime/40" />
              <div className={`absolute top-0 flex items-center ${p.side === "l" ? "right-4 flex-row-reverse" : "left-4"}`}>
                <span className="h-px w-[8vw] bg-lime/70" />
                <div className={`w-56 ${p.side === "l" ? "pr-3 text-right" : "pl-3"}`}>
                  <p className="mega text-lg leading-tight">{p.title}</p>
                  <p className="micro mt-1 text-lime/75">{p.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Phones: the same details as a list under the render. */}
      <ul className="wrap grid gap-4 pb-20 pt-6 sm:grid-cols-2 md:hidden">
        {pins.map((p) => (
          <li key={p.title} className="border-t border-lime/30 pt-3">
            <p className="mega text-lg">{p.title}</p>
            <p className="micro mt-1 text-lime/75">{p.text}</p>
          </li>
        ))}
      </ul>
      <div className="hidden h-20 md:block" />
      {/* Second anchor: keep the flying can hidden until the next section is close. */}
      <div aria-hidden data-can='{"x":0.5,"y":-1.6,"s":0.9,"ry":6.4,"rx":0,"rz":0,"o":0}' className="absolute bottom-[25%] h-px w-px" />
    </section>
  );
}
