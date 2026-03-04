/**
 * Onboarding Step 3 — Parenting Philosophy (Framework Selection)
 */
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingProgress } from "@/components/ui/OnboardingProgress";
import { FRAMEWORK_OPTIONS } from "@/lib/types";

export default function OnboardingStep3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const canContinue = selected.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="mt-6 mb-8">
          <OnboardingProgress current={2} total={4} />
        </View>

        <Text
          className="text-3xl text-text-primary mb-2"
          style={{ fontFamily: "Nunito_800ExtraBold" }}
        >
          Your parenting style 📚
        </Text>
        <Text
          className="text-text-muted text-base mb-2"
          style={{ fontFamily: "Nunito_400Regular" }}
        >
          Which of these resonate with you? Kira will draw on these throughout.
        </Text>
        <Text
          className="text-text-muted text-xs mb-8"
          style={{ fontFamily: "Nunito_400Regular" }}
        >
          You can pick multiple — most parents mix approaches.
        </Text>

        {/* Framework cards */}
        <View className="gap-y-3 mb-8">
          {FRAMEWORK_OPTIONS.map((fw) => {
            const isSelected = selected.includes(fw.key);
            return (
              <TouchableOpacity
                key={fw.key}
                onPress={() => toggle(fw.key)}
                className={`rounded-2xl p-4 border-2 ${
                  isSelected ? "border-terracotta" : "border-border-soft"
                }`}
                style={{ backgroundColor: fw.color }}
              >
                <View className="flex-row items-center gap-x-3">
                  <Text style={{ fontSize: 28 }}>{fw.emoji}</Text>
                  <View className="flex-1">
                    <Text
                      className="text-text-primary text-sm"
                      style={{ fontFamily: "Nunito_700Bold" }}
                    >
                      {fw.title}
                    </Text>
                    <Text
                      className="text-text-muted text-xs"
                      style={{ fontFamily: "Nunito_400Regular" }}
                    >
                      {fw.author}
                    </Text>
                    <Text
                      className="text-text-secondary text-xs mt-1"
                      style={{ fontFamily: "Nunito_400Regular" }}
                    >
                      {fw.description}
                    </Text>
                  </View>
                  <View
                    className={`w-7 h-7 rounded-full border-2 items-center justify-center ml-2 ${
                      isSelected ? "border-terracotta bg-terracotta" : "border-border-warm bg-white"
                    }`}
                  >
                    {isSelected && (
                      <Text className="text-white text-xs" style={{ fontFamily: "Nunito_700Bold" }}>
                        ✓
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Summary */}
        {selected.length > 0 && (
          <View className="bg-card-blush rounded-2xl p-4 mb-6 border border-border-soft">
            <Text
              className="text-text-secondary text-xs mb-1"
              style={{ fontFamily: "Nunito_600SemiBold" }}
            >
              Your Kindroots approach:
            </Text>
            <Text
              className="text-text-primary text-sm"
              style={{ fontFamily: "Nunito_700Bold" }}
            >
              {FRAMEWORK_OPTIONS.filter((f) => selected.includes(f.key))
                .map((f) => f.author.split(" ").pop())
                .join(" · ")}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(onboarding)/step4",
              params: { ...params, frameworks: selected.join(",") },
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
            This sounds like me →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(onboarding)/step4",
              params: { ...params, frameworks: "gentle-sleep,wonder-weeks" },
            })
          }
          className="mt-4 items-center"
        >
          <Text
            className="text-text-muted text-sm"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Not sure?{" "}
            <Text className="text-terracotta" style={{ fontFamily: "Nunito_600SemiBold" }}>
              Skip and let Kira decide
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
