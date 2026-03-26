/**
 * Default in-view settings for scroll-driven reveals.
 * Numeric `amount` is more reliable than `"some"` when scroll is restored on refresh.
 */
export const viewRelaxed = {
  once: true as const,
  amount: 0.12 as const,
  margin: "0px 0px 180px 0px" as const,
};
