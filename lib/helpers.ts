import { differenceInWeeks, differenceInDays, format, parseISO, addWeeks } from "date-fns";
import { Baby, FamilyContext, Family, WonderWeekLeap } from "./types";
import { FRAMEWORK_OPTIONS } from "./types";

/**
 * Calculate baby's age in weeks (with adjusted age for premature babies)
 */
export function getBabyAgeWeeks(baby: Baby): number {
  if (!baby.date_of_birth) return 0;
  const dob = parseISO(baby.date_of_birth);
  const ageWeeks = differenceInWeeks(new Date(), dob);
  if (baby.premature && baby.adjusted_age_weeks) {
    return Math.max(0, ageWeeks - baby.adjusted_age_weeks);
  }
  return ageWeeks;
}

/**
 * Return a human-readable age string
 */
export function getBabyAgeLabel(baby: Baby): string {
  const weeks = getBabyAgeWeeks(baby);
  if (weeks < 4) {
    const days = differenceInDays(new Date(), parseISO(baby.date_of_birth!));
    return `${days} day${days !== 1 ? "s" : ""} old`;
  }
  if (weeks < 13) return `${weeks} week${weeks !== 1 ? "s" : ""} old`;
  const months = Math.floor(weeks / 4.33);
  if (months < 24) return `${months} month${months !== 1 ? "s" : ""} old`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (remMonths === 0) return `${years} year${years !== 1 ? "s" : ""} old`;
  return `${years}y ${remMonths}m old`;
}

/**
 * Get due date countdown
 */
export function getDueDateCountdown(dueDate: string): string {
  const due = parseISO(dueDate);
  const days = differenceInDays(due, new Date());
  if (days < 0) return "Overdue";
  if (days === 0) return "Due today!";
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} to go`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks !== 1 ? "s" : ""} to go`;
}

/**
 * Find the current Wonder Week leap (if any) for a baby
 */
export function getCurrentLeap(
  ageWeeks: number,
  leaps: WonderWeekLeap[]
): WonderWeekLeap | null {
  // Stormy period is typically 1-2 weeks before the leap week
  return leaps.find(
    (l) => ageWeeks >= l.age_weeks_start - 1 && ageWeeks <= l.age_weeks_end + 1
  ) ?? null;
}

/**
 * Get upcoming leaps
 */
export function getUpcomingLeaps(
  ageWeeks: number,
  leaps: WonderWeekLeap[],
  count = 3
): WonderWeekLeap[] {
  return leaps
    .filter((l) => l.age_weeks_start > ageWeeks + 1)
    .slice(0, count);
}

/**
 * Build FamilyContext object for AI calls
 */
export function buildFamilyContext(
  profile: { full_name: string | null },
  family: Family,
  baby: Baby,
  leaps: WonderWeekLeap[],
  stressLevel?: string
): FamilyContext {
  const ageWeeks = getBabyAgeWeeks(baby);
  return {
    parentName: profile.full_name ?? "Parent",
    partnerName: family.partner_name,
    babyName: baby.name,
    babyAge: getBabyAgeLabel(baby),
    babyAgeWeeks: ageWeeks,
    feedingMethod: baby.feeding_method ?? "not specified",
    frameworks: family.frameworks,
    stage: family.stage,
    currentLeap: getCurrentLeap(ageWeeks, leaps),
    stressLevel,
  };
}

/**
 * Get framework display name by key
 */
export function getFrameworkLabel(key: string): string {
  const fw = FRAMEWORK_OPTIONS.find((f) => f.key === key);
  return fw ? fw.title : key;
}

/**
 * Format time for display (24h -> 12h)
 */
export function formatTime12h(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "pm" : "am";
  const h = hours % 12 || 12;
  return `${h}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * Category colour lookup for routine events
 */
export const ROUTINE_CATEGORY_COLOURS: Record<string, string> = {
  feed: "#FFF4EC",
  sleep: "#E5EEFB",
  awake: "#E5F5EC",
  bath: "#EDE8F5",
  bedtime: "#F0EAF8",
  you: "#FFF0F3",
};

export const ROUTINE_CATEGORY_ICONS: Record<string, string> = {
  feed: "🍼",
  sleep: "😴",
  awake: "🌟",
  bath: "🛁",
  bedtime: "🌙",
  you: "☕",
};

/**
 * Get a greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Up late?";
}

/**
 * Affiliate product placeholder data
 */
export const AFFILIATE_PRODUCTS = [
  {
    id: "1",
    name: "Hatch Rest+ Sound Machine",
    category: "sleep",
    stage: ["newborn", "infant", "toddler"],
    price: "£99",
    description: "The sleep trainer loved by thousands of Kindroots families.",
    emoji: "🌙",
    url: "#",
  },
  {
    id: "2",
    name: "Ergobaby 360 Carrier",
    category: "feeding",
    stage: ["newborn", "infant"],
    price: "£145",
    description: "Baby-wearing made comfortable for all-day carries.",
    emoji: "👶",
    url: "#",
  },
  {
    id: "3",
    name: "Aden + Anais Swaddle Blankets",
    category: "sleep",
    stage: ["newborn"],
    price: "£35",
    description: "The perfect swaddle for Harvey Karp's 5 S technique.",
    emoji: "🌿",
    url: "#",
  },
  {
    id: "4",
    name: "Mam Anti-Colic Bottles",
    category: "feeding",
    stage: ["newborn", "infant"],
    price: "£28",
    description: "Highly recommended for combination feeders.",
    emoji: "🍼",
    url: "#",
  },
  {
    id: "5",
    name: "Love to Dream Swaddle UP",
    category: "sleep",
    stage: ["newborn", "infant"],
    price: "£29",
    description: "Arms-up swaddle for self-settling babies.",
    emoji: "💙",
    url: "#",
  },
  {
    id: "6",
    name: "Infantino Flip 4-in-1 Carrier",
    category: "motor",
    stage: ["infant", "toddler"],
    price: "£35",
    description: "Affordable carrier that grows with your baby.",
    emoji: "🌈",
    url: "#",
  },
  {
    id: "7",
    name: "Doona Car Seat & Stroller",
    category: "travel",
    stage: ["newborn", "infant"],
    price: "£349",
    description: "The revolutionary 2-in-1 every new parent talks about.",
    emoji: "🚗",
    url: "#",
  },
  {
    id: "8",
    name: "Elvie Breast Pump",
    category: "feeding",
    stage: ["newborn", "infant"],
    price: "£289",
    description: "Hands-free, wearable pump for expressing parents.",
    emoji: "💪",
    url: "#",
  },
];
