/**
 * Bidirectional in-view settings — animations trigger on enter AND reverse on leave.
 * once: false ensures the animation runs every time the element enters the viewport.
 */
export const viewRelaxed = {
  once: false as const,
  amount: 0.12 as const,
  margin: "0px 0px -60px 0px" as const,
};
