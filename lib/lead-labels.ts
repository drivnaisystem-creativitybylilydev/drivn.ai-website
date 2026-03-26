import { LEAD_FIELD_KEYS } from "@/lib/lead-submission";

export const LEAD_FIELD_LABELS: Record<(typeof LEAD_FIELD_KEYS)[number], string> = {
  fullName: "Name",
  email: "Email",
  phone: "Phone",
  businessName: "Business",
  businessType: "Type",
  biggestChallenge: "Challenge",
  monthlyRevenue: "Revenue",
  hearAboutUs: "Source",
  additionalNotes: "Notes",
};
