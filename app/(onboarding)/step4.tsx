/**
 * Onboarding Step 4 — Feeding & final setup. Saves to Supabase.
 */
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingProgress } from "@/components/ui/OnboardingProgress";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { parse, format } from "date-fns";

const FEEDING_OPTIONS = [
  { key: "breastfed", label: "Breastfeeding", emoji: "🤱" },
  { key: "formula", label: "Formula", emoji: "🍼" },
  { key: "combination", label: "Combination", emoji: "🌀" },
  { key: "expressing", label: "Expressing", emoji: "💪" },
  { key: "not_started", label: "Not started yet", emoji: "⏳" },
];

const TEMPERAMENT_OPTIONS = [
  { key: "calm", label: "Calm & settled" },
  { key: "unpredictable", label: "Unpredictable" },
  { key: "alert", label: "Alert & active" },
  { key: "unsettled", label: "Unsettled" },
];

function parseDate(raw: string): string | null {
  try {
    const d = parse(raw, "dd/MM/yyyy", new Date());
    return format(d, "yyyy-MM-dd");
  } catch {
    return null;
  }
}

export default function OnboardingStep4() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    partnerName?: string;
    stage?: string;
    dueDate?: string;
    babyName?: string;
    babyDOB?: string;
    isPremature?: string;
    weeksEarly?: string;
    stress?: string;
    sleep?: string;
    support?: string;
    rtw?: string;
    frameworks?: string;
  }>();

  const { profile, fetchProfile } = useAuthStore();
  const [feeding, setFeeding] = useState<string | null>(null);
  const [temperament, setTemperament] = useState<string | null>(null);
  const [challenge, setChallenge] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async () => {
    if (!feeding) {
      Alert.alert("One more thing", "Please select your feeding method.");
      return;
    }

    setIsLoading(true);

    try {
      const userId = profile!.id;
      const frameworks = params.frameworks?.split(",").filter(Boolean) ?? [];
      const stage = params.stage === "pregnancy" ? "pregnancy" : "newborn";

      // 1. Create family
      const { data: family, error: familyError } = await supabase
        .from("families")
        .insert({
          owner_id: userId,
          partner_name: params.partnerName || null,
          stage,
          frameworks,
          notes: challenge || null,
        })
        .select()
        .single();

      if (familyError) throw familyError;

      // 2. Create baby (if arrived)
      if (params.stage === "arrived" && params.babyName && family) {
        const dob = parseDate(params.babyDOB ?? "");
        await supabase.from("babies").insert({
          family_id: family.id,
          name: params.babyName,
          date_of_birth: dob,
          feeding_method: feeding,
          premature: params.isPremature === "true",
          adjusted_age_weeks: params.weeksEarly ? parseInt(params.weeksEarly) : null,
        });
      }

      // If pregnancy, add a baby record with due date
      if (params.stage === "pregnancy" && family) {
        const dueDate = parseDate(params.dueDate ?? "");
        await supabase.from("babies").insert({
          family_id: family.id,
          name: "Baby",
          due_date: dueDate,
          feeding_method: "not_started",
        });
      }

      // 3. Mark onboarding complete
      await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", userId);

      await fetchProfile();

      router.replace("/(onboarding)/loading");
    } catch (err: any) {
      Alert.alert("Something went wrong", err.message ?? "Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="mt-6 mb-8">
          <OnboardingProgress current={3} total={4} />
        </View>

        <Text
          className="text-3xl text-text-primary mb-2"
          style={{ fontFamily: "Nunito_800ExtraBold" }}
        >
          Almost done 🎉
        </Text>
        <Text
          className="text-text-muted text-base mb-8"
          style={{ fontFamily: "Nunito_400Regular" }}
        >
          Just a couple more details and your profile is ready.
        </Text>

        {/* Feeding */}
        {params.stage === "arrived" && (
          <>
            <View className="mb-6">
              <Text
                className="text-text-secondary text-sm mb-3"
                style={{ fontFamily: "Nunito_600SemiBold" }}
              >
                How are you feeding {params.babyName ?? "baby"}?
              </Text>
              <View className="gap-y-2">
                {FEEDING_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => setFeeding(opt.key)}
                    className={`flex-row items-center gap-x-3 rounded-2xl p-4 border-2 ${
                      feeding === opt.key ? "border-terracotta bg-card-warm" : "border-border-soft bg-card-warm"
                    }`}
                  >
                    <Text style={{ fontSize: 22 }}>{opt.emoji}</Text>
                    <Text
                      className={`text-sm ${feeding === opt.key ? "text-terracotta" : "text-text-secondary"}`}
                      style={{ fontFamily: "Nunito_600SemiBold" }}
                    >
                      {opt.label}
                    </Text>
                    <View className="flex-1 items-end">
                      <View
                        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                          feeding === opt.key ? "border-terracotta bg-terracotta" : "border-border-warm"
                        }`}
                      >
                        {feeding === opt.key && (
                          <Text className="text-white text-xs">✓</Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Temperament */}
            <View className="mb-6">
              <Text
                className="text-text-secondary text-sm mb-3"
                style={{ fontFamily: "Nunito_600SemiBold" }}
              >
                {params.babyName ?? "Baby"}'s temperament so far
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {TEMPERAMENT_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => setTemperament(opt.key)}
                    className={`rounded-2xl px-4 py-3 border-2 ${
                      temperament === opt.key
                        ? "border-terracotta bg-card-warm"
                        : "border-border-soft bg-card-warm"
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        temperament === opt.key ? "text-terracotta" : "text-text-secondary"
                      }`}
                      style={{ fontFamily: "Nunito_600SemiBold" }}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {params.stage === "pregnancy" && (
          <View className="mb-6">
            <TouchableOpacity
              onPress={() => setFeeding("not_started")}
              className={`rounded-2xl p-4 border-2 items-center ${
                feeding === "not_started" ? "border-terracotta bg-card-warm" : "border-border-soft bg-card-warm"
              }`}
            >
              <Text style={{ fontSize: 28 }}>⏳</Text>
              <Text
                className="text-text-secondary text-sm mt-2"
                style={{ fontFamily: "Nunito_600SemiBold" }}
              >
                I'll plan my feeding approach after birth
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Biggest challenge */}
        <View className="mb-8">
          <Text
            className="text-text-secondary text-sm mb-2"
            style={{ fontFamily: "Nunito_600SemiBold" }}
          >
            Biggest challenge right now? (optional)
          </Text>
          <TextInput
            value={challenge}
            onChangeText={setChallenge}
            placeholder="e.g. sleep, feeding, feeling overwhelmed..."
            placeholderTextColor="#9E9690"
            multiline
            numberOfLines={3}
            className="bg-card-warm rounded-2xl px-4 py-4 text-text-primary border border-border-soft"
            style={{ fontFamily: "Nunito_400Regular", height: 90, textAlignVertical: "top" }}
          />
        </View>

        <TouchableOpacity
          onPress={handleFinish}
          disabled={isLoading || !feeding}
          className={`rounded-3xl py-4 items-center ${
            feeding && !isLoading ? "bg-terracotta" : "bg-border-warm"
          }`}
          style={feeding && !isLoading ? { shadowColor: "#E07A5F", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 } : {}}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              className={`text-base ${feeding ? "text-white" : "text-text-muted"}`}
              style={{ fontFamily: "Nunito_700Bold" }}
            >
              Build my Kindroots profile ✨
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
