import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import {
  Family,
  Baby,
  WonderWeekLeap,
  DailyLog,
  FamilyContext,
} from "@/lib/types";
import { buildFamilyContext } from "@/lib/helpers";
import { useAuthStore } from "./authStore";

interface FamilyState {
  family: Family | null;
  baby: Baby | null;
  leaps: WonderWeekLeap[];
  recentLogs: DailyLog[];
  isLoading: boolean;
  // Derived
  familyContext: FamilyContext | null;
  // Actions
  fetchFamily: () => Promise<void>;
  fetchLeaps: () => Promise<void>;
  fetchRecentLogs: () => Promise<void>;
  updateFamily: (updates: Partial<Family>) => Promise<void>;
  updateBaby: (updates: Partial<Baby>) => Promise<void>;
  addLog: (log: Omit<DailyLog, "id" | "created_at">) => Promise<void>;
  setFamily: (family: Family) => void;
  setBaby: (baby: Baby) => void;
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  family: null,
  baby: null,
  leaps: [],
  recentLogs: [],
  isLoading: false,
  familyContext: null,

  fetchFamily: async () => {
    const profile = useAuthStore.getState().profile;
    if (!profile) return;

    set({ isLoading: true });

    const { data: families } = await supabase
      .from("families")
      .select("*")
      .eq("owner_id", profile.id)
      .single();

    if (families) {
      const { data: babies } = await supabase
        .from("babies")
        .select("*")
        .eq("family_id", families.id)
        .single();

      const baby = babies ?? null;
      set({ family: families, baby });

      // Build family context
      if (baby) {
        const { leaps } = get();
        const context = buildFamilyContext(profile, families, baby, leaps);
        set({ familyContext: context });
      }
    }

    set({ isLoading: false });
  },

  fetchLeaps: async () => {
    const { data } = await supabase
      .from("wonder_weeks_leaps")
      .select("*")
      .order("leap_number");
    if (data) {
      set({ leaps: data });
      // Rebuild context if we have family data
      const { family, baby } = get();
      const profile = useAuthStore.getState().profile;
      if (family && baby && profile) {
        const context = buildFamilyContext(profile, family, baby, data);
        set({ familyContext: context });
      }
    }
  },

  fetchRecentLogs: async () => {
    const { baby } = get();
    if (!baby) return;

    const { data } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("baby_id", baby.id)
      .order("logged_at", { ascending: false })
      .limit(50);

    if (data) set({ recentLogs: data });
  },

  updateFamily: async (updates) => {
    const { family } = get();
    if (!family) return;

    const { data } = await supabase
      .from("families")
      .update(updates)
      .eq("id", family.id)
      .select()
      .single();

    if (data) set({ family: data });
  },

  updateBaby: async (updates) => {
    const { baby } = get();
    if (!baby) return;

    const { data } = await supabase
      .from("babies")
      .update(updates)
      .eq("id", baby.id)
      .select()
      .single();

    if (data) set({ baby: data });
  },

  addLog: async (log) => {
    const { data } = await supabase
      .from("daily_logs")
      .insert(log)
      .select()
      .single();

    if (data) {
      set((state) => ({ recentLogs: [data, ...state.recentLogs] }));
    }
  },

  setFamily: (family) => set({ family }),
  setBaby: (baby) => set({ baby }),
}));
