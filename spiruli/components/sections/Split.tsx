import Pattern from "@/components/ui/Pattern";

/** Two words split around the can in the middle. */
export default function Split() {
  return (
    <section
      data-can='{"x":0,"y":0,"s":0.95,"ry":4.3,"rx":-0.12,"rz":0.18}'
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-algae text-lime"
    >
      <Pattern color="#237A45" />
      <div className="wrap relative py-24">
        <h2 data-reveal className="mega text-center text-[11vw] lg:text-[8rem]">
          <span className="block">Aus der Alge</span>
          <span className="block text-lime-soft">In die Dose</span>
        </h2>
        <p data-reveal className="micro mt-16 max-w-[15rem] text-lime/80">
          Recherchiert, selektiert und gebraut von Biotechnologen, Therapeuten und Braumeistern.
        </p>
      </div>
    </section>
  );
}
