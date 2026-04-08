// src/data/sections.ts

export const SECTIONS = [
  { key: "anatomiya", label: "Anatomiya", icon: "\u{1F9EC}" },
  { key: "gistologiya", label: "Gistologiya", icon: "\u{1F52C}" },
  { key: "fiziologiya", label: "Fiziologiya", icon: "\u{2764}\u{FE0F}" },
  { key: "biokimyo", label: "Biokimyo", icon: "\u{1F9EA}" },
] as const;

export const SUB_ITEMS = [
  { key: "3d", label: "3D", icon: "\u{1F4A0}" },
  { key: "vr_ar", label: "VR / AR", icon: "\u{1F576}\u{FE0F}" },
  { key: "video", label: "Video darslik", icon: "\u{1F3AC}" },
  { key: "slayd", label: "Slayd", icon: "\u{1F4CA}" },
  { key: "test", label: "Test", icon: "\u{1F4DD}" },
  { key: "facts", label: "Qiziqarli", icon: "\u{1F4A1}" },
  { key: "referat", label: "Referat", icon: "\u{1F4D6}" },
  { key: "quiz", label: "Quiz", icon: "\u{1F3AF}" },
] as const;

export const SECTION_LABELS: Record<string, string> = Object.fromEntries(
  SECTIONS.map((s) => [s.key, s.label])
);

export const SUB_ITEM_LABELS: Record<string, string> = Object.fromEntries(
  SUB_ITEMS.map((s) => [s.key, s.label])
);
