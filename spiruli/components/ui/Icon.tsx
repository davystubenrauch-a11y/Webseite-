/** Small line icons, drawn on a 24px grid. */
const paths = {
  leaf: "M5 19c0-8 5-13 14-14-1 9-6 14-14 14Zm0 0 7-7",
  bolt: "M13 3 5 13h6l-1 8 8-10h-6l1-8Z",
  dna: "M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12M8 7h8M8 17h8",
  shield: "M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4",
  flask: "M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M7.5 14h9",
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z",
  barrel: "M7 3h10c1.5 3 1.5 15 0 18H7C5.5 18 5.5 6 7 3Zm-1 5h12M6 16h12",
  check: "m5 12 4 4 10-10",
  pharmacy: "M4 7h16v13H4zM9 3h6v4H9zM12 10v7M8.5 13.5h7",
  cart: "M3 4h2l2.5 11h10L20 7H6.5M9 20h.01M17 20h.01",
  can: "M8 3h8l1 2v14l-1 2H8l-1-2V5l1-2Zm-1 4h10M7 17h10",
} as const;

export type IconName = keyof typeof paths;

export default function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}
