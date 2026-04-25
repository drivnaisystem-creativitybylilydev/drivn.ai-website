"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, AlertCircle } from "lucide-react";
import { HudBrackets } from "@/components/admin/hud-primitives";
import { addBusinessAction } from "@/app/admin/sourced-leads/actions";

const NICHES = [
  "Landscaper",
  "Roofing Contractor",
  "Junk Removal Service",
  "Real Estate Agent",
  "Auto Repair Shop",
  "Pressure Washing Service",
  "Private Investigator",
  "Plumbing Service",
  "Lawn Care Service",
  "Tree Service",
  "Cleaning Service",
  "HVAC Service",
  "Water Service",
  "Painting Service",
  "Electrical Service",
  "Concrete Service",
  "Pet Grooming Service",
  "Moving Service",
  "Insulation Service",
  "Fence Service",
  "Construction Service",
];

export function AddBusinessModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    website: "",
    email: "",
    category: "",
    rating: "",
    reviewCount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Business name is required");
      return;
    }
    if (!formData.category) {
      setError("Please select a niche");
      return;
    }

    startTransition(async () => {
      const result = await addBusinessAction({
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        website: formData.website.trim(),
        email: formData.email.trim(),
        category: formData.category,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        reviewCount: formData.reviewCount ? parseInt(formData.reviewCount) : undefined,
      });

      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
        onSuccess();
        onClose();
      }
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0E24] p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <HudBrackets color="rgba(139,92,246,0.2)" size={8} />

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-brand-purple-light" />
              <h3 className="font-sora text-lg font-bold text-white">Add Business</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 transition hover:text-white/60"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Business Name */}
            <div>
              <label className="block font-inter text-xs font-semibold text-white/60 mb-1.5">
                Business Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Smith Landscaping"
                value={formData.name}
                onChange={handleChange}
                disabled={pending}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-inter text-sm text-white placeholder-white/30 transition focus:border-brand-purple/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 disabled:opacity-50"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-inter text-xs font-semibold text-white/60 mb-1.5">
                Service Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={pending}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-inter text-sm text-white transition focus:border-brand-purple/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 disabled:opacity-50"
              >
                <option value="">Select a niche...</option>
                {NICHES.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block font-inter text-xs font-semibold text-white/60 mb-1.5">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="123 Main St, City, State"
                value={formData.address}
                onChange={handleChange}
                disabled={pending}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-inter text-sm text-white placeholder-white/30 transition focus:border-brand-purple/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 disabled:opacity-50"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-inter text-xs font-semibold text-white/60 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                disabled={pending}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-inter text-sm text-white placeholder-white/30 transition focus:border-brand-purple/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 disabled:opacity-50"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block font-inter text-xs font-semibold text-white/60 mb-1.5">
                Website
              </label>
              <input
                type="url"
                name="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange}
                disabled={pending}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-inter text-sm text-white placeholder-white/30 transition focus:border-brand-purple/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-inter text-xs font-semibold text-white/60 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="contact@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={pending}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-inter text-sm text-white placeholder-white/30 transition focus:border-brand-purple/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 disabled:opacity-50"
              />
            </div>

            {/* Rating & Review Count */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-inter text-xs font-semibold text-white/60 mb-1.5">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  name="rating"
                  placeholder="4.5"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  disabled={pending}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-inter text-sm text-white placeholder-white/30 transition focus:border-brand-purple/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block font-inter text-xs font-semibold text-white/60 mb-1.5">
                  Reviews
                </label>
                <input
                  type="number"
                  name="reviewCount"
                  placeholder="42"
                  min="0"
                  value={formData.reviewCount}
                  onChange={handleChange}
                  disabled={pending}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-inter text-sm text-white placeholder-white/30 transition focus:border-brand-purple/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="font-inter text-xs text-red-300">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={pending}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 font-inter text-sm font-medium text-white/50 transition hover:border-white/20 hover:text-white/70 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="flex items-center gap-1.5 rounded-lg border border-brand-purple/40 bg-brand-purple/20 px-4 py-2 font-inter text-sm font-semibold text-brand-purple-light transition hover:bg-brand-purple/30 disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                {pending ? "Adding..." : "Add Business"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
