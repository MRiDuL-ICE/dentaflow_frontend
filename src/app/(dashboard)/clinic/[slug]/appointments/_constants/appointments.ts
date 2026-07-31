export const STATUS_BADGE_STYLES: Record<
  string,
  { bg: string; color: string }
> = {
  scheduled: { bg: "#F1F5F9", color: "#475569" },
  confirmed: { bg: "#EFF6FF", color: "#1D4ED8" },
  in_progress: { bg: "#FFFBEB", color: "#B45309" },
  completed: { bg: "#F0FDF4", color: "#15803D" },
  cancelled: { bg: "#FEF2F2", color: "#B91C1C" },
  no_show: { bg: "#F8FAFC", color: "#334155" },
};

export const STATUS_TRANSITIONS: Record<string, string[]> = {
  scheduled: ["confirmed", "cancelled", "no_show"],
  confirmed: ["in_progress", "cancelled", "no_show"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  no_show: ["scheduled"],
};

export const TREATMENT_TYPES = [
  "General Checkup",
  "Cleaning & Polishing",
  "Cavity Filling",
  "Root Canal",
  "Tooth Extraction",
  "Dental Crown",
  "Teeth Whitening",
  "Orthodontic Consultation",
  "Dental Implant",
  "Emergency",
  "Other",
];

export const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];
