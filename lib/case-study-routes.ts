/** Slugs that use a dedicated page instead of the generic `/work/[slug]` template. */
export const DEDICATED_CASE_STUDY_SLUGS = ["creativity-by-lilly", "notime-storage"] as const;

export function isDedicatedCaseStudySlug(slug: string): boolean {
  return (DEDICATED_CASE_STUDY_SLUGS as readonly string[]).includes(slug);
}
