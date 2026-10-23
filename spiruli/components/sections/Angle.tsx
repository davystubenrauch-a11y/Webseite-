import Pattern from "@/components/ui/Pattern";

/** "A new angle": giant type on the left, the can tilts in on the right. */
export default function Angle() {
  return (
    <section
      data-can='{"x":0.58,"y":0.02,"s":1.0,"ry":2.6,"rx":0.35,"rz":-0.5}'
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-algae text-lime"
    >
      <Pattern color="#237A45" />
      <div className="wrap relative py-24">
        <h2 data-reveal className="mega text-[12vw] lg:text-[8.6rem]">
          Ein neuer
          <br />
          Blick auf
          <br />
          <span className="text-lime-soft">Energie.</span>
        </h2>
        <p data-reveal className="micro mt-10 max-w-xs text-lime">
          Holunder, Zitrus und Spirulina – fermentiert nach dem Vorbild traditioneller Braukunst. Kein Trend, sondern Jahre Forschung in
          einer Dose.
        </p>
      </div>
    </section>
  );
}
