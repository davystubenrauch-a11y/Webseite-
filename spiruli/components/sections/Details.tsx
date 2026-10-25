const shots = [
  { src: "/media/macro-word.jpg", title: "Die Wortmarke", text: "Goldfolie mit grüner Linie, senkrecht über die ganze Dose." },
  { src: "/media/macro-seal.jpg", title: "Premium Formula", text: "Das Siegel ist in den Lack geprägt." },
  { src: "/media/macro-band.jpg", title: "Das Goldband", text: "Vegan, Vitamin B11 und B12 – und die PZN darunter." },
];

/** Three macro renders of the can, with slow zoom-in reveals. */
export default function Details() {
  return (
    <section className="bg-set pb-28 text-cream sm:pb-40">
      <div className="wrap">
        <div className="grid gap-5 md:grid-cols-3">
          {shots.map((s, i) => (
            <figure key={s.src} data-reveal style={{ ["--d" as string]: `${i * 0.12}s` }}>
              <div className="overflow-hidden rounded-2xl bg-sand">
                <img data-zoom src={s.src} alt={s.title} loading="lazy" className="aspect-[4/5] w-full object-cover" />
              </div>
              <figcaption className="mt-5">
                <p className="display text-3xl">{s.title}</p>
                <p className="mt-2 text-cream/65">{s.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
