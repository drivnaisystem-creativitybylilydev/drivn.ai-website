"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const formFields = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    subtitle: "How we'll address you on the call",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    subtitle: "We'll send a calendar invite and prep notes",
    required: true,
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    subtitle: "Backup contact if we need to reschedule",
    required: true,
  },
  {
    name: "businessName",
    label: "Business Name",
    type: "text",
    subtitle: "Your company or trading name",
    required: true,
  },
  {
    name: "businessType",
    label: "Business Type",
    type: "select",
    subtitle: "Helps us tailor the audit to your industry",
    required: true,
    options: [
      "",
      "Home Services (plumbing, HVAC, electrical, etc.)",
      "Trades & Contractors",
      "E-commerce / Retail",
      "Professional Services",
      "Other",
    ],
  },
  {
    name: "biggestChallenge",
    label: "Biggest Challenge Right Now",
    type: "textarea",
    subtitle: "What's costing you time or money? Missed calls, manual processes, slow follow-up?",
    required: true,
  },
  {
    name: "monthlyRevenue",
    label: "Approximate Monthly Revenue (optional)",
    type: "select",
    subtitle: "Helps us prioritize high-impact solutions",
    required: false,
    options: [
      "",
      "Under $10K",
      "$10K - $50K",
      "$50K - $100K",
      "$100K - $250K",
      "$250K+",
      "Prefer not to say",
    ],
  },
  {
    name: "hearAboutUs",
    label: "How Did You Hear About Us?",
    type: "text",
    subtitle: "Referral, Google, LinkedIn, etc.",
    required: false,
  },
  {
    name: "additionalNotes",
    label: "Anything Else We Should Know?",
    type: "textarea",
    subtitle: "Specific goals, timeline, or questions for the call",
    required: false,
  },
];

export default function AuditForm() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Connect to your backend/API (e.g., Formspree, Resend, custom API)
    console.log("Form submitted:", formData);
    await new Promise((r) => setTimeout(r, 1000)); // Simulate API call
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-sora font-semibold text-white mb-4">
          Thanks! We&apos;ll be in touch within 24 hours.
        </h3>
        <p className="text-white/70">
          Check your inbox for next steps. We&apos;ll reach out to schedule your
          discovery call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {formFields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-white/90 mb-1"
          >
            {field.label}
            {field.required && <span className="text-brand-purple"> *</span>}
          </label>
          <p className="text-xs text-white/50 mb-2">{field.subtitle}</p>
          <div className="relative audit-form-field">
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                rows={3}
                className="w-full bg-transparent text-white placeholder:text-white/40 py-2 pr-0 pl-0 border-0 border-b border-white/20 focus:outline-none focus:ring-0 focus:border-transparent resize-none"
                placeholder={`Tell us about your ${field.label.toLowerCase()}...`}
              />
            ) : field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                className="w-full bg-transparent text-white py-2 pr-0 pl-0 border-0 border-b border-white/20 focus:outline-none focus:ring-0 focus:border-transparent appearance-none cursor-pointer [&>option]:bg-brand-dark [&>option]:text-white"
              >
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt || "Select..."}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                className="w-full bg-transparent text-white placeholder:text-white/40 py-2 pr-0 pl-0 border-0 border-b border-white/20 focus:outline-none focus:ring-0 focus:border-transparent"
                placeholder={`Your ${field.label.toLowerCase()}`}
              />
            )}
            {/* Animated underline - slides left to right on focus */}
            <span className="input-underline-animate" />
          </div>
        </div>
      ))}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full bg-violet-900 hover:bg-violet-800 text-lg py-6"
      >
        {isSubmitting ? "Submitting..." : "Request Your Audit"}
      </Button>
    </form>
  );
}
