export type SubscriptionTier = "free" | "premium";
export type Stage = "pregnancy" | "newborn" | "infant" | "toddler";
export type FeedingMethod = "breastfed" | "formula" | "combination" | "expressing" | "not_started";
export type LogType = "feed" | "sleep" | "nappy" | "mood" | "note";
export type MilestoneCategory = "motor" | "language" | "social" | "cognitive" | "feeding" | "sleep";

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  subscription_expires_at: string | null;
  stripe_customer_id: string | null;
  onboarding_completed: boolean;
  expo_push_token: string | null;
}

export interface Family {
  id: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  partner_name: string | null;
  partner_email: string | null;
  stage: Stage;
  frameworks: string[];
  notes: string | null;
}

export interface Baby {
  id: string;
  created_at: string;
  updated_at: string;
  family_id: string;
  name: string;
  date_of_birth: string | null;
  due_date: string | null;
  sex: "male" | "female" | "prefer_not_to_say" | null;
  avatar_url: string | null;
  feeding_method: FeedingMethod | null;
  premature: boolean;
  adjusted_age_weeks: number | null;
}

export interface KiraMessage {
  id: string;
  created_at: string;
  family_id: string;
  role: "user" | "assistant";
  content: string;
  session_id: string;
}

export interface MilestoneDefinition {
  id: string;
  stage: string;
  age_weeks_min: number | null;
  age_weeks_max: number | null;
  category: MilestoneCategory;
  title: string;
  description: string | null;
  tips: string | null;
  framework_tags: string[];
  sort_order: number;
}

export interface BabyMilestone {
  id: string;
  created_at: string;
  baby_id: string;
  milestone_id: string | null;
  custom_title: string | null;
  custom_category: string | null;
  achieved_at: string | null;
  photo_url: string | null;
  note: string | null;
}

export interface Routine {
  id: string;
  created_at: string;
  updated_at: string;
  family_id: string;
  name: string;
  routine_type: string;
  is_active: boolean;
  sort_order: number;
}

export interface RoutineStep {
  id: string;
  routine_id: string;
  sort_order: number;
  title: string;
  duration_minutes: number | null;
  icon: string | null;
  notes: string | null;
}

export interface LibraryArticle {
  id: string;
  created_at: string;
  stage: string;
  age_weeks_min: number | null;
  age_weeks_max: number | null;
  framework_tags: string[];
  category: string;
  title: string;
  summary: string | null;
  body: string | null;
  read_time_minutes: number | null;
  is_premium: boolean;
  sort_order: number;
}

export interface WonderWeekLeap {
  id: string;
  leap_number: number;
  name: string;
  age_weeks_start: number;
  age_weeks_end: number;
  stormy_description: string | null;
  sunny_description: string | null;
  new_skills: string[] | null;
}

export interface DailyLog {
  id: string;
  created_at: string;
  baby_id: string;
  logged_at: string;
  log_type: LogType;
  feed_type: string | null;
  feed_duration_minutes: number | null;
  feed_amount_ml: number | null;
  sleep_start: string | null;
  sleep_end: string | null;
  sleep_quality: string | null;
  nappy_type: string | null;
  note: string | null;
  mood_rating: number | null;
}

// ─── FamilyContext for AI calls ──────────────────────────────────
export interface FamilyContext {
  parentName: string;
  partnerName: string | null;
  babyName: string;
  babyAge: string; // human-readable e.g. "9 weeks"
  babyAgeWeeks: number;
  feedingMethod: string;
  frameworks: string[];
  stage: Stage;
  currentLeap: WonderWeekLeap | null;
  stressLevel?: string;
}

// ─── Generated content ──────────────────────────────────────────
export interface GeneratedRoutineEvent {
  time: string;
  activity: string;
  duration: string;
  category: "feed" | "sleep" | "awake" | "bath" | "bedtime" | "you";
  tip: string;
}

export interface GeneratedRoutine {
  routineTitle: string;
  frameworkNote: string;
  events: GeneratedRoutineEvent[];
}

// ─── Framework definitions ───────────────────────────────────────
export const FRAMEWORK_OPTIONS = [
  {
    key: "gina-ford",
    title: "The Contented Little Baby Book",
    author: "Gina Ford",
    emoji: "📅",
    description: "Structured routines for predictable, settled babies.",
    color: "#FFF4EC",
  },
  {
    key: "wonder-weeks",
    title: "The Wonder Weeks",
    author: "Frans Plooij",
    emoji: "🌟",
    description: "Understand your baby's mental leaps and stormy periods.",
    color: "#FFF0F3",
  },
  {
    key: "harvey-karp",
    title: "Happiest Baby on the Block",
    author: "Harvey Karp",
    emoji: "🌙",
    description: "The 5 S's for calming a crying baby, instantly.",
    color: "#E5EEFB",
  },
  {
    key: "brain-rules",
    title: "Brain Rules for Baby",
    author: "John Medina",
    emoji: "🧠",
    description: "Science-backed parenting for smarter, happier babies.",
    color: "#E5F5EC",
  },
  {
    key: "no-drama",
    title: "No-Drama Discipline",
    author: "Dan Siegel",
    emoji: "💛",
    description: "Connect first, then redirect — no yelling needed.",
    color: "#FFF8E5",
  },
  {
    key: "gentle-sleep",
    title: "The Gentle Sleep Book",
    author: "Sarah Ockwell-Smith",
    emoji: "🌿",
    description: "Responsive, gentle approaches to improving sleep.",
    color: "#E5F5EC",
  },
  {
    key: "baby-whisperer",
    title: "The Baby Whisperer",
    author: "Tracy Hogg",
    emoji: "🤫",
    description: "The EASY routine — a middle path between rigid and demand.",
    color: "#EDE8F5",
  },
  {
    key: "whole-brain",
    title: "The Whole-Brain Child",
    author: "Dan Siegel",
    emoji: "🌈",
    description: "Nurture your child's developing mind with intention.",
    color: "#FFF0F3",
  },
  {
    key: "what-to-expect",
    title: "What to Expect the First Year",
    author: "Heidi Murkoff",
    emoji: "📖",
    description: "The classic comprehensive guide to baby's first year.",
    color: "#FFF4EC",
  },
  {
    key: "peaceful-parent",
    title: "Peaceful Parent, Happy Kids",
    author: "Laura Markham",
    emoji: "☀️",
    description: "Regulate yourself to raise emotionally healthy children.",
    color: "#E5EEFB",
  },
] as const;

export type FrameworkKey = typeof FRAMEWORK_OPTIONS[number]["key"];
