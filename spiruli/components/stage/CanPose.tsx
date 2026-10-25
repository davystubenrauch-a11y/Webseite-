/**
 * Invisible anchor for the flying can: when the page scrolls to this point,
 * the can reaches `pose` (see choreography.ts). `at` places it inside the
 * section, e.g. "60%".
 */
export default function CanPose({ at, pose }: { at: string; pose: Record<string, number> }) {
  return <div aria-hidden data-can={JSON.stringify(pose)} className="pointer-events-none absolute left-0 h-px w-px" style={{ top: at }} />;
}
