export type RoiInput = {
  clients: number; // monthly clients
  ticket: number; // average revenue per client (€)
  rating: number; // current Google rating
  existing: number; // current number of reviews
};

// Assumptions, surfaced in the UI's fine print.
export const ROI_ASSUMPTIONS = {
  baselineRate: 0.015, // share of clients who review unprompted
  cardRate: 0.12, // share who review when handed a tap card
  newReviewStars: 4.8, // average rating of card-prompted reviews
  revenuePerStar: 0.07, // ~5–9% revenue per +1 star (Luca, HBS 2011)
  maxVolumeLift: 0.06,
};

export function computeRoi({ clients, ticket, rating, existing }: RoiInput) {
  const a = ROI_ASSUMPTIONS;
  const baselinePerMonth = clients * a.baselineRate;
  const cardPerMonth = clients * a.cardRate;

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    without: existing + baselinePerMonth * (i + 1),
    with: existing + cardPerMonth * (i + 1),
  }));

  const newReviews = cardPerMonth * 12;
  const baselineNew = baselinePerMonth * 12;
  const projectedRating = Math.min(
    5,
    (rating * existing + a.newReviewStars * newReviews) / Math.max(1, existing + newReviews),
  );
  const ratingDelta = Math.max(0, projectedRating - rating);
  const volumeLift = Math.min(a.maxVolumeLift, Math.log10(1 + newReviews / Math.max(10, existing)) * 0.04);
  const liftPct = ratingDelta * a.revenuePerStar + volumeLift;
  const annualRevenue = clients * ticket * 12;
  const revenueLift = annualRevenue * liftPct;

  return {
    months,
    newReviews,
    multiplier: newReviews / Math.max(1, baselineNew),
    projectedRating,
    liftPct,
    revenueLift,
    annualRevenue,
  };
}
