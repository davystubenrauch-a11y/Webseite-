// Central brand + business configuration. Update these before going live.
export const site = {
  name: "f&d solutions",
  // Replace with the agency inbox that should receive booking requests.
  contactEmail: "hello@fd-solutions.com",
  // URL encoded into the QR code printed on the demo card.
  demoReviewUrl: "https://g.page/r/fd-solutions/review",
};

export const chapters = [
  { id: "hero", label: "Reputation" },
  { id: "customizer", label: "Customizer" },
  { id: "roi", label: "ROI" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Booking" },
] as const;
