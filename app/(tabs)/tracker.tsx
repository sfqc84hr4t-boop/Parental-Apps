import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/stores/authStore";
import { useFamilyStore } from "@/stores/familyStore";
import { supabase } from "@/lib/supabase";
import {
  MilestoneDefinition,
  BabyMilestone,
  WonderWeekLeap,
} from "@/lib/types";
import { getBabyAgeWeeks, getCurrentLeap } from "@/lib/helpers";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";

const CATEGORY_COLOURS: Record<string, string> = {
  motor: "#E5F5EC",
  language: "#E5EEFB",
  social: "#FFF0F3",
  cognitive: "#EDE8F5",
  feeding: "#FFF4EC",
  sleep: "#F0EAF8",
};

const CATEGORY_ICONS: Record<string, string> = {
  motor: "🏃",
  language: "💬",
  social: "👥",
  cognitive: "🧠",
  feeding: "🍽️",
  sleep: "😴",
};

export default function TrackerScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { baby, leaps } = useFamilyStore();
  const [milestones, setMilestones] = useState<MilestoneDefinition[]>([]);
  const [achieved, setAchieved] = useState<BabyMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"milestones" | "leaps">("milestones");
  const isPremium = profile?.subscription_tier === "premium";

  const ageWeeks = baby?.date_of_birth ? getBabyAgeWeeks(baby) : 0;
  const currentLeap = getCurrentLeap(ageWeeks, leaps);

  useEffect(() => {
    loadData();
  }, [baby]);

  const loadData = async () => {
    if (!baby) {
      setIsLoading(false);
      return;
    }

    const [milestonesRes, achievedRes] = await Promise.all([
      supabase
        .from("milestone_definitions")
        .select("*")
        .order("sort_order"),
      supabase
        .from("baby_milestones")
        .select("*")
        .eq("baby_id", baby.id),
    ]);

    if (milestonesRes.data) setMilestones(milestonesRes.data);
    if (achievedRes.data) setAchieved(achievedRes.data);
    setIsLoading(false);
  };

  const toggleMilestone = async (milestone: MilestoneDefinition) => {
    if (!baby) return;

    const existing = achieved.find((a) => a.milestone_id === milestone.id);
    if (existing) {
      // Un-achieve
      await supabase.from("baby_milestones").delete().eq("id", existing.id);
      setAchieved((prev) => prev.filter((a) => a.id !== existing.id));
    } else {
      // Mark achieved
      const { data } = await supabase
        .from("baby_milestones")
        .insert({
          baby_id: baby.id,
          milestone_id: milestone.id,
          achieved_at: format(new Date(), "yyyy-MM-dd"),
        })
        .select()
        .single();
      if (data) setAchieved((prev) => [...prev, data]);
    }
  };

  // Group milestones by category
  const relevant = milestones.filter(
    (m) =>
      (m.age_weeks_min === null || ageWeeks >= (m.age_weeks_min ?? 0) - 4) &&
      (m.age_weeks_max === null || ageWeeks <= (m.age_weeks_max ?? 999) + 8)
  );

  const categories = [...new Set(relevant.map((m) => m.category))];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator color="#E07A5F" size="large" />
      </SafeAreaView>
    );
  }

  if (!baby) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center px-8">
        <Text style={{ fontSize: 48 }}>⭐</Text>
        <Text
          className="text-text-primary text-xl text-center mt-4"
          style={{ fontFamily: "Nunito_700Bold" }}
        >
          Milestones & Development
        </Text>
        <Text
          className="text-text-muted text-base text-center mt-2"
          style={{ fontFamily: "Nunito_400Regular" }}
        >
          Complete your family profile to start tracking milestones.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Header */}
      <View className="px-5 pt-4 pb-3 border-b border-border-soft">
        <Text
          className="text-2xl text-text-primary"
          style={{ fontFamily: "Nunito_800ExtraBold" }}
        >
          {baby.name}'s Development ⭐
        </Text>
        <Text
          className="text-text-muted text-sm"
          style={{ fontFamily: "Nunito_400Regular" }}
        >
          {achieved.length} milestones reached
        </Text>
      </View>

      {/* Tab bar */}
      <View className="flex-row mx-5 mt-4 mb-2 bg-card-warm rounded-2xl p-1 border border-border-soft">
        {[
          { key: "milestones", label: "Milestones" },
          { key: "leaps", label: "Wonder Weeks" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2 rounded-xl items-center ${
              activeTab === tab.key ? "bg-white" : ""
            }`}
            style={activeTab === tab.key ? { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 } : {}}
          >
            <Text
              className={`text-sm ${
                activeTab === tab.key ? "text-terracotta" : "text-text-muted"
              }`}
              style={{
                fontFamily:
                  activeTab === tab.key ? "Nunito_700Bold" : "Nunito_400Regular",
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
        {activeTab === "milestones" ? (
          <>
            {categories.map((category) => (
              <View key={category} className="mb-6">
                <View className="flex-row items-center gap-x-2 mb-3">
                  <Text style={{ fontSize: 18 }}>{CATEGORY_ICONS[category] ?? "⭐"}</Text>
                  <Text
                    className="text-text-primary text-base"
                    style={{ fontFamily: "Nunito_700Bold" }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </View>
                <View className="gap-y-2">
                  {relevant
                    .filter((m) => m.category === category)
                    .map((milestone) => {
                      const isAchieved = achieved.some(
                        (a) => a.milestone_id === milestone.id
                      );
                      const achievedRecord = achieved.find(
                        (a) => a.milestone_id === milestone.id
                      );
                      return (
                        <TouchableOpacity
                          key={milestone.id}
                          onPress={() => toggleMilestone(milestone)}
                          className={`rounded-2xl p-4 border-2 ${
                            isAchieved
                              ? "border-sage bg-mint-light"
                              : "border-border-soft"
                          }`}
                          style={
                            !isAchieved
                              ? { backgroundColor: CATEGORY_COLOURS[category] ?? "#FFF4EC" }
                              : {}
                          }
                        >
                          <View className="flex-row items-start gap-x-3">
                            <View
                              className={`w-6 h-6 rounded-full border-2 items-center justify-center mt-0.5 ${
                                isAchieved
                                  ? "border-sage bg-sage"
                                  : "border-border-warm"
                              }`}
                            >
                              {isAchieved && (
                                <Text className="text-white text-xs">✓</Text>
                              )}
                            </View>
                            <View className="flex-1">
                              <Text
                                className={`text-sm ${
                                  isAchieved
                                    ? "text-sage"
                                    : "text-text-primary"
                                }`}
                                style={{ fontFamily: "Nunito_700Bold" }}
                              >
                                {milestone.title}
                              </Text>
                              {milestone.description && (
                                <Text
                                  className="text-text-muted text-xs mt-1"
                                  style={{ fontFamily: "Nunito_400Regular" }}
                                >
                                  {milestone.description}
                                </Text>
                              )}
                              {isAchieved && achievedRecord?.achieved_at && (
                                <Text
                                  className="text-sage text-xs mt-1"
                                  style={{ fontFamily: "Nunito_600SemiBold" }}
                                >
                                  ✓ Reached {format(parseISO(achievedRecord.achieved_at), "d MMM yyyy")}
                                </Text>
                              )}
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </View>
            ))}
          </>
        ) : (
          /* Wonder Weeks leap calendar */
          <View className="mt-2 gap-y-3">
            {leaps.map((leap) => {
              const isCurrent = currentLeap?.id === leap.id;
              const isPast = ageWeeks > leap.age_weeks_end + 1;
              const isLocked = !isPremium && leap.leap_number > 3;

              return (
                <View
                  key={leap.id}
                  className={`rounded-3xl p-5 border-2 ${
                    isCurrent
                      ? "border-terracotta bg-card-blush"
                      : isPast
                      ? "border-sage-light bg-mint-light"
                      : "border-border-soft bg-card-warm"
                  }`}
                >
                  <View className="flex-row items-center gap-x-2 mb-2">
                    <Text style={{ fontSize: 18 }}>
                      {isPast ? "✅" : isCurrent ? "🌩️" : "🌟"}
                    </Text>
                    <Text
                      className="text-text-muted text-xs"
                      style={{ fontFamily: "Nunito_600SemiBold" }}
                    >
                      LEAP {leap.leap_number} · Week {leap.age_weeks_start}–{leap.age_weeks_end}
                    </Text>
                    {isCurrent && (
                      <View className="bg-terracotta rounded-full px-2 py-0.5 ml-auto">
                        <Text
                          className="text-white text-xs"
                          style={{ fontFamily: "Nunito_700Bold" }}
                        >
                          Now
                        </Text>
                      </View>
                    )}
                    {isLocked && (
                      <View className="ml-auto">
                        <Text className="text-text-muted" style={{ fontSize: 16 }}>🔒</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    className="text-text-primary text-base"
                    style={{ fontFamily: "Nunito_700Bold" }}
                  >
                    {leap.name}
                  </Text>
                  {!isLocked && (
                    <>
                      {isCurrent && leap.stormy_description && (
                        <Text
                          className="text-text-secondary text-sm mt-2"
                          style={{ fontFamily: "Nunito_400Regular" }}
                        >
                          {leap.stormy_description}
                        </Text>
                      )}
                      {!isCurrent && leap.sunny_description && (
                        <Text
                          className="text-text-secondary text-sm mt-2"
                          style={{ fontFamily: "Nunito_400Regular" }}
                        >
                          {isPast ? leap.sunny_description : `Coming around week ${leap.age_weeks_start}`}
                        </Text>
                      )}
                      {leap.new_skills && leap.new_skills.length > 0 && (
                        <View className="mt-3 gap-y-1">
                          {leap.new_skills.slice(0, 3).map((skill, i) => (
                            <View key={i} className="flex-row items-center gap-x-2">
                              <View className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                              <Text
                                className="text-text-secondary text-xs"
                                style={{ fontFamily: "Nunito_400Regular" }}
                              >
                                {skill}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </>
                  )}
                  {isLocked && (
                    <Text
                      className="text-text-muted text-sm mt-2"
                      style={{ fontFamily: "Nunito_400Regular" }}
                    >
                      Upgrade to Kindroots+ to unlock all 10 Wonder Week leaps.
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
