/**
 * One requestAnimationFrame loop for the whole page. Subscribers run in the
 * order they subscribed (smooth scrolling first), and a section's callback
 * only runs while that section is on or near the screen.
 */
type Fn = (t: number) => void;
const subs = new Set<Fn>();
let raf = 0;

const loop = (t: number) => {
  subs.forEach((f) => f(t));
  raf = subs.size ? requestAnimationFrame(loop) : 0;
};

function add(fn: Fn) {
  subs.add(fn);
  if (!raf) raf = requestAnimationFrame(loop);
}

/** Run `fn` every frame while `el` is within a screen of the viewport (always, if `el` is null). Returns the cleanup. */
export function onFrame(el: Element | null, fn: Fn) {
  if (!el) {
    add(fn);
    return () => void subs.delete(fn);
  }
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? add(fn) : subs.delete(fn)), { rootMargin: "100% 0px" });
  io.observe(el);
  return () => {
    io.disconnect();
    subs.delete(fn);
  };
}
