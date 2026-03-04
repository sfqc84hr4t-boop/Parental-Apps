/**
 * Onboarding Step 2 — About You (Support & situation)
 */
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingProgress } from "@/components/ui/OnboardingProgress";

type Option = { key: string; label: string; emoji: string };

const STRESS_OPTIONS: Option[] = [
  { key: "overwhelmed", label: "Overwhelmed", emoji: "😰" },
  { key: "managing", label: "Managing", emoji: "😅" },
  { key: "doing_well", label: "Doing well", emoji: "😊" },
];

const SLEEP_OPTIONS: Option[] = [
  { key: "barely_any", label: "Barely any", emoji: "😩" },
  { key: "very_broken", label: "Very broken", emoji: "😴" },
  { key: "getting_some", label: "Getting some", emoji: "🌙" },
];

const SUPPORT_OPTIONS: Option[] = [
  { key: "partner_home", label: "Partner at home", emoji: "🏠" },
  { key: "family_nearby", label: "Family nearby", emoji: "👨‍👩‍👧" },
  { key: "largely_alone", label: "Largely on my own", emoji: "💪" },
];

const RTW_OPTIONS: Option[] = [
  { key: "na", label: "Not applicable", emoji: "" },
  { key: "within_3m", label: "Within 3 months", emoji: "" },
  { key: "3_6m", label: "3–6 months", emoji: "" },
  { key: "6_12m", label: "6–12 months", emoji: "" },
  { key: "not_returning", label: "Not returning", emoji: "" },
];

function OptionRow({ options, selected, onSelect }: { options: Option[]; selected: string | null; onSelect: (k: string) => void }) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.key}
          onPress={() => onSelect(opt.key)}
          className={`rounded-2xl px-4 py-3 border-2 flex-row items-center gap-x-2 ${
            selected === opt.key ? "border-terracotta bg-card-warm" : "border-border-soft bg-card-warm"
          }`}
        >
          {opt.emoji ? <Text>{opt.emoji}</Text> : null}
          <Text
            className={`text-sm ${selected === opt.key ? "text-terracotta" : "text-text-secondary"}`}
            style={{ fontFamily: "Nunito_600SemiBold" }}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function OnboardingStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [stress, setStress] = useState<string | null>(null);
  const [sleep, setSleep] = useState<string | null>(null);
  const [support, setSupport] = useState<string | null>(null);
  const [rtw, setRtw] = useState<string | null>(null);

  const canContinue = stress && sleep && support;

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="mt-6 mb-8">
          <OnboardingProgress current={1} total={4} />
        </View>

        <Text
          className="text-3xl text-text-primary mb-2"
          style={{ fontFamily: "Nunito_800ExtraBold" }}
        >
          How are you doing? 💛
        </Text>
        <Text
          className="text-text-muted text-base mb-8"
          style={{ fontFamily: "Nunito_400Regular" }}
        >
          Kira will use this to tailor her support. Be honest — there's no wrong answer.
        </Text>

        {/* Stress */}
        <View className="mb-6">
          <Text
            className="text-text-secondary text-sm mb-3"
            style={{ fontFamily: "Nunito_600SemiBold" }}
          >
            How are you feeling right now?
          </Text>
          <OptionRow options={STRESS_OPTIONS} selected={stress} onSelect={setStress} />
        </View>

        {/* Sleep */}
        <View className="mb-6">
          <Text
            className="text-text-secondary text-sm mb-3"
            style={{ fontFamily: "Nunito_600SemiBold" }}
          >
            How's your sleep?
          </Text>
          <OptionRow options={SLEEP_OPTIONS} selected={sleep} onSelect={setSleep} />
        </View>

        {/* Support network */}
        <View className="mb-6">
          <Text
            className="text-text-secondary text-sm mb-3"
            style={{ fontFamily: "Nunito_600SemiBold" }}
          >
            Your support network
          </Text>
          <OptionRow options={SUPPORT_OPTIONS} selected={support} onSelect={setSupport} />
        </View>

        {/* Return to work */}
        <View className="mb-8">
          <Text
            className="text-text-secondary text-sm mb-3"
            style={{ fontFamily: "Nunito_600SemiBold" }}
          >
            Return to work (optional)
          </Text>
          <OptionRow options={RTW_OPTIONS} selected={rtw} onSelect={setRtw} />
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(onboarding)/step3",
              params: { ...params, stress, sleep, support, rtw },
            })
          }
          disabled={!canContinue}
          className={`rounded-3xl py-4 items-center ${canContinue ? "bg-terracotta" : "bg-border-warm"}`}
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
