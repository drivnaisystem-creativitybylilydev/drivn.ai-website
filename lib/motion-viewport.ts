/**
 * Default in-view settings for scroll-driven reveals.
 * Strict `amount` values often leave blocks stuck at opacity:0 (IO + layout edge cases).
 */
export const viewRelaxed = {
  once: true as const,
  amount: "some" as const,
  margin: "0px 0px 180px 0px" as const,
};
