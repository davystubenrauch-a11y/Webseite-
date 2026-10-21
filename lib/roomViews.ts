// Camera viewpoints of the demo room (shared by the 3D scene and its HTML controls).
export const VIEWS = [
  { label: "Überblick", cam: [6.8, 5.2, 7.2], target: [0, 0.8, -0.6] },
  { label: "Wohnbereich", cam: [1.2, 1.7, 1.4], target: [-1.4, 0.7, -2.2] },
  { label: "Essbereich", cam: [-0.8, 1.8, 2.8], target: [2.3, 0.8, 0.1] },
  { label: "Küche", cam: [0.2, 1.8, 0.2], target: [2.8, 1.0, -2.7] },
] as const;
