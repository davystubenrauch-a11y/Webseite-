// Shared clock for the hero "tap" story, so the 3D scene and the HTML step labels stay in sync.

export const STORY_LENGTH = 7.5; // seconds per loop

const start = typeof performance !== "undefined" ? performance.now() : 0;

/** Seconds into the current loop. */
export const storyTime = () => (((performance.now() - start) / 1000) % STORY_LENGTH + STORY_LENGTH) % STORY_LENGTH;

/** Which of the three labelled steps is showing (0 tap, 1 Google opens, 2 five stars). */
export const storyStep = (t: number) => (t < 2.6 ? 0 : t < 3.8 ? 1 : 2);
