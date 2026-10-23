import { useId } from "react";

/** Rotating round label with text on a ring. */
export default function Stamp({ text, color, center, className = "" }: { text: string; color: string; center: React.ReactNode; className?: string }) {
  const id = useId();
  return (
    <div className={`relative grid aspect-square place-items-center ${className}`} style={{ color }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden>
        <defs>
          <path id={id} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text fill="currentColor" fontSize="16" fontWeight="900" letterSpacing="3.5" style={{ fontStretch: "125%" }}>
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <div className="relative text-center">{center}</div>
    </div>
  );
}
