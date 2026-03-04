import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";

/**
 * Root redirect — sends users to the right place:
 * - Not authenticated → (auth)/welcome
 * - Authenticated, no onboarding → (onboarding)/step1
 * - Authenticated, onboarded → (tabs)/home
 */
export default function Index() {
  const router = useRouter();
  const { session, profile, isInitialised } = useAuthStore();

  useEffect(() => {
    if (!isInitialised) return;

    if (!session) {
      router.replace("/(auth)/welcome");
    } else if (profile && !profile.onboarding_completed) {
      router.replace("/(onboarding)/step1");
    } else {
      router.replace("/(tabs)/home");
    }
  }, [session, profile, isInitialised]);

  return (
    <View className="flex-1 items-center justify-center bg-cream">
      <ActivityIndicator size="large" color="#E07A5F" />
    </View>
  );
}
