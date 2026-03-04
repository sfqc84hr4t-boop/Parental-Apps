import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFamilyStore } from "@/stores/familyStore";

const MESSAGES = [
  "Getting to know your family...",
  "Selecting the best guidance for you...",
  "Tuning Kira to your parenting style...",
  "Building your profile...",
  "Almost ready! 🌱",
];

export default function OnboardingLoading() {
  const router = useRouter();
  const { fetchFamily, fetchLeaps } = useFamilyStore();

  useEffect(() => {
    const load = async () => {
      await fetchLeaps();
      await fetchFamily();
      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 3000);
    };
    load();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-cream items-center justify-center px-8">
      <Text style={{ fontSize: 64 }}>🌱</Text>
      <Text
        className="text-2xl text-text-primary mt-6 text-center"
        style={{ fontFamily: "Nunito_800ExtraBold" }}
      >
        Building your Kindroots profile...
      </Text>
      <Text
        className="text-text-muted text-base mt-3 text-center"
        style={{ fontFamily: "Nunito_400Regular" }}
      >
        Personalising everything just for your family.
      </Text>
      <ActivityIndicator color="#E07A5F" size="large" style={{ marginTop: 40 }} />
    </SafeAreaView>
  );
}
