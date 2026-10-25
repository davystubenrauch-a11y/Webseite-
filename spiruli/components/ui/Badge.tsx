/** Slowly turning round seal with text on a circle, like a stamp on the packaging. */
export default function Badge({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div aria-hidden className={`grid place-items-center ${className}`}>
      <svg viewBox="0 0 200 200" className="col-start-1 row-start-1 h-full w-full animate-[spin_22s_linear_infinite] motion-reduce:animate-none">
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-current font-sans text-[15px] font-semibold uppercase tracking-[0.32em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <svg viewBox="0 0 24 24" className="col-start-1 row-start-1 h-1/4 w-1/4">
        {/* Leaf mark, as in the can's seal. */}
        <path d="M12 21c0-6 0-10 6-15-1 7-3 11-6 15Zm0 0c0-6 0-10-6-15 1 7 3 11 6 15Z" className="fill-current" />
      </svg>
    </div>
  );
}
