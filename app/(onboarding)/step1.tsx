/**
 * Onboarding Step 1 — About You
 * Parent name, partner, stage (pregnant/arrived), due date or DOB
 */
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingProgress } from "@/components/ui/OnboardingProgress";
import { useAuthStore } from "@/stores/authStore";

type Stage = "pregnancy" | "arrived";

export default function OnboardingStep1() {
  const router = useRouter();
  const { profile } = useAuthStore();

  const [partnerName, setPartnerName] = useState("");
  const [stage, setStage] = useState<Stage | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [babyName, setBabyName] = useState("");
  const [babyDOB, setBabyDOB] = useState("");
  const [isPremature, setIsPremature] = useState(false);
  const [weeksEarly, setWeeksEarly] = useState("");

  const canContinue =
    stage === "pregnancy"
      ? dueDate.length >= 8
      : babyName.length > 0 && babyDOB.length >= 8;

  const handleContinue = () => {
    if (!canContinue) {
      Alert.alert("Almost there", "Please fill in all required fields.");
      return;
    }
    // Pass data via router params (or store in a temp Zustand slice)
    router.push({
      pathname: "/(onboarding)/step2",
      params: {
        partnerName,
        stage,
        dueDate,
        babyName,
        babyDOB,
        isPremature: String(isPremature),
        weeksEarly,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Progress */}
        <View className="mt-6 mb-8">
          <OnboardingProgress current={0} total={4} />
        </View>

        {/* Header */}
        <Text
          className="text-3xl text-text-primary mb-2"
          style={{ fontFamily: "Nunito_800ExtraBold" }}
        >
          Hello, {profile?.full_name?.split(" ")[0] ?? "there"} 👋
        </Text>
        <Text
          className="text-text-muted text-base mb-8"
          style={{ fontFamily: "Nunito_400Regular" }}
        >
          Let's get to know your family so Kindroots can personalise everything for you.
        </Text>

        {/* Partner name */}
        <View className="mb-6">
          <Text
            className="text-text-secondary text-sm mb-2"
            style={{ fontFamily: "Nunito_600SemiBold" }}
          >
            Partner's name (optional)
          </Text>
          <TextInput
            value={partnerName}
            onChangeText={setPartnerName}
            placeholder="e.g. James"
            placeholderTextColor="#9E9690"
            autoCapitalize="words"
            className="bg-card-warm rounded-2xl px-4 py-4 text-text-primary border border-border-soft"
            style={{ fontFamily: "Nunito_400Regular" }}
          />
        </View>

        {/* Stage */}
        <View className="mb-6">
          <Text
            className="text-text-secondary text-sm mb-3"
            style={{ fontFamily: "Nunito_600SemiBold" }}
          >
            Where are you in your journey?
          </Text>
          <View className="flex-row gap-x-3">
            {[
              { key: "pregnancy", label: "Still pregnant 🤰", emoji: "🤰" },
              { key: "arrived", label: "Baby has arrived! 👶", emoji: "👶" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => setStage(opt.key as Stage)}
                className={`flex-1 rounded-2xl py-4 px-3 items-center border-2 ${
                  stage === opt.key
                    ? "border-terracotta bg-card-warm"
                    : "border-border-soft bg-card-warm"
                }`}
              >
                <Text style={{ fontSize: 28 }}>{opt.emoji}</Text>
                <Text
                  className={`text-xs mt-2 text-center ${
                    stage === opt.key ? "text-terracotta" : "text-text-secondary"
                  }`}
                  style={{ fontFamily: "Nunito_700Bold" }}
                >
                  {stage === "pregnancy" && opt.key === "pregnancy"
                    ? "Still pregnant"
                    : opt.key === "arrived"
                    ? "Baby's here!"
                    : opt.label.replace(/🤰|👶/, "").trim()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Conditional fields */}
        {stage === "pregnancy" && (
          <View className="mb-6">
            <Text
              className="text-text-secondary text-sm mb-2"
              style={{ fontFamily: "Nunito_600SemiBold" }}
            >
              Due date
            </Text>
            <TextInput
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#9E9690"
              keyboardType="numeric"
              className="bg-card-warm rounded-2xl px-4 py-4 text-text-primary border border-border-soft"
              style={{ fontFamily: "Nunito_400Regular" }}
            />
          </View>
        )}

        {stage === "arrived" && (
          <View className="gap-y-4 mb-6">
            <View>
              <Text
                className="text-text-secondary text-sm mb-2"
                style={{ fontFamily: "Nunito_600SemiBold" }}
              >
                Baby's name ✨
              </Text>
              <TextInput
                value={babyName}
                onChangeText={setBabyName}
                placeholder="e.g. Mia"
                placeholderTextColor="#9E9690"
                autoCapitalize="words"
                className="bg-card-warm rounded-2xl px-4 py-4 text-text-primary border border-border-soft"
                style={{ fontFamily: "Nunito_400Regular" }}
              />
            </View>

            <View>
              <Text
                className="text-text-secondary text-sm mb-2"
                style={{ fontFamily: "Nunito_600SemiBold" }}
              >
                Date of birth
              </Text>
              <TextInput
                value={babyDOB}
                onChangeText={setBabyDOB}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9E9690"
                keyboardType="numeric"
                className="bg-card-warm rounded-2xl px-4 py-4 text-text-primary border border-border-soft"
                style={{ fontFamily: "Nunito_400Regular" }}
              />
            </View>

            {/* Premature */}
            <TouchableOpacity
              onPress={() => setIsPremature(!isPremature)}
              className="flex-row items-center gap-x-3 bg-card-warm rounded-2xl p-4 border border-border-soft"
            >
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  isPremature ? "border-terracotta bg-terracotta" : "border-border-warm"
                }`}
              >
                {isPremature && <Text className="text-white text-xs">✓</Text>}
              </View>
              <Text
                className="text-text-secondary text-sm"
                style={{ fontFamily: "Nunito_600SemiBold" }}
              >
                Baby was born prematurely
              </Text>
            </TouchableOpacity>

            {isPremature && (
              <View>
                <Text
                  className="text-text-secondary text-sm mb-2"
                  style={{ fontFamily: "Nunito_600SemiBold" }}
                >
                  How many weeks early?
                </Text>
                <TextInput
                  value={weeksEarly}
                  onChangeText={setWeeksEarly}
                  placeholder="e.g. 6"
                  placeholderTextColor="#9E9690"
                  keyboardType="numeric"
                  className="bg-card-warm rounded-2xl px-4 py-4 text-text-primary border border-border-soft"
                  style={{ fontFamily: "Nunito_400Regular" }}
                />
                <Text
                  className="text-text-muted text-xs mt-1"
                  style={{ fontFamily: "Nunito_400Regular" }}
                >
                  We'll use this to calculate {babyName || "your baby"}'s adjusted age throughout the app.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!canContinue}
          className={`rounded-3xl py-4 items-center mt-4 ${
            canContinue ? "bg-terracotta" : "bg-border-warm"
          }`}
          style={canContinue ? { shadowColor: "#E07A5F", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 } : {}}
        >
          <Text
            className={`text-base ${canContinue ? "text-white" : "text-text-muted"}`}
            style={{ fontFamily: "Nunito_700Bold" }}
          >
            Continue →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
