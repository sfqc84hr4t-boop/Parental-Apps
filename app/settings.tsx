import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { useFamilyStore } from "@/stores/familyStore";
import { FRAMEWORK_OPTIONS } from "@/lib/types";
import { getFrameworkLabel } from "@/lib/helpers";

function SectionHeader({ title }: { title: string }) {
  return (
    <Text
      className="text-text-muted text-xs uppercase px-5 mt-6 mb-2"
      style={{ fontFamily: "Nunito_700Bold", letterSpacing: 0.8 }}
    >
      {title}
    </Text>
  );
}

function SettingsRow({
  emoji,
  label,
  sublabel,
  onPress,
  right,
}: {
  emoji: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !right}
      className="flex-row items-center gap-x-4 px-5 py-4 bg-card-warm border-b border-border-soft"
    >
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <View className="flex-1">
        <Text className="text-text-primary text-sm" style={{ fontFamily: "Nunito_600SemiBold" }}>
          {label}
        </Text>
        {sublabel && (
          <Text className="text-text-muted text-xs mt-0.5" style={{ fontFamily: "Nunito_400Regular" }}>
            {sublabel}
          </Text>
        )}
      </View>
      {right ?? (onPress ? <Text className="text-text-muted text-lg">›</Text> : null)}
    </TouchableOpacity>
  );
}

// ─── Demo banner (replaces paywall) ──────────────────────────────
function PaywallCard() {
  return (
    <View className="mx-5 mt-4 bg-mint-light rounded-3xl p-5 border border-sage-light">
      <View className="flex-row items-center gap-x-3">
        <Text style={{ fontSize: 28 }}>✨</Text>
        <View className="flex-1">
          <Text className="text-text-primary text-base" style={{ fontFamily: "Nunito_700Bold" }}>
            Demo mode — all features unlocked
          </Text>
          <Text className="text-sage text-sm mt-0.5" style={{ fontFamily: "Nunito_400Regular" }}>
            Kindroots+ subscription coming soon
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuthStore();
  const { family, baby } = useFamilyStore();
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/(auth)/welcome");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header */}
        <View className="flex-row items-center px-5 pt-4 pb-4 border-b border-border-soft">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-text-muted text-2xl">←</Text>
          </TouchableOpacity>
          <Text
            className="text-xl text-text-primary"
            style={{ fontFamily: "Nunito_800ExtraBold" }}
          >
            Settings
          </Text>
        </View>

        {/* Profile card */}
        <View className="mx-5 mt-5 bg-card-warm rounded-3xl p-5 border border-border-soft">
          <View className="flex-row items-center gap-x-4">
            <View className="w-14 h-14 bg-terracotta/20 rounded-full items-center justify-center">
              <Text style={{ fontSize: 28 }}>👤</Text>
            </View>
            <View>
              <Text className="text-text-primary text-lg" style={{ fontFamily: "Nunito_700Bold" }}>
                {profile?.full_name ?? "Your account"}
              </Text>
              {baby && (
                <Text className="text-text-muted text-sm" style={{ fontFamily: "Nunito_400Regular" }}>
                  Parent of {baby.name}
                </Text>
              )}
              {family?.partner_name && (
                <Text className="text-text-muted text-xs mt-0.5" style={{ fontFamily: "Nunito_400Regular" }}>
                  Partner: {family.partner_name}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Paywall */}
        <PaywallCard />

        {/* Family */}
        <SectionHeader title="Family" />
        <View className="rounded-3xl mx-5 overflow-hidden border border-border-soft">
          <SettingsRow
            emoji="👶"
            label={baby?.name ? `${baby.name}'s profile` : "Baby profile"}
            sublabel="Name, birthday, feeding method"
            onPress={() => {}}
          />
          <SettingsRow
            emoji="📚"
            label="Parenting frameworks"
            sublabel={
              family?.frameworks.length
                ? family.frameworks.slice(0, 2).map(getFrameworkLabel).join(", ")
                : "Not set"
            }
            onPress={() => {}}
          />
          <SettingsRow
            emoji="👫"
            label="Invite partner"
            sublabel="Share your family profile"
            onPress={() =>
              Alert.alert(
                "Partner Mode",
                "Partner mode is available with Kindroots+. Invite your partner by email to share logs, routines, and Kira conversations."
              )
            }
          />
        </View>

        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <View className="rounded-3xl mx-5 overflow-hidden border border-border-soft">
          <SettingsRow
            emoji="🔔"
            label="Push notifications"
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ true: "#E07A5F" }}
              />
            }
          />
          <SettingsRow
            emoji="🌟"
            label="Wonder Week alerts"
            sublabel="Get notified before a leap starts"
            onPress={() => {}}
          />
          <SettingsRow
            emoji="💛"
            label="Wellbeing check-ins"
            sublabel="Weekly mood check-in reminder"
            onPress={() => {}}
          />
        </View>

        {/* Privacy */}
        <SectionHeader title="Privacy & Data" />
        <View className="rounded-3xl mx-5 overflow-hidden border border-border-soft">
          <SettingsRow
            emoji="🔒"
            label="Privacy policy"
            onPress={() => {}}
          />
          <SettingsRow
            emoji="📄"
            label="Terms of service"
            onPress={() => {}}
          />
          <SettingsRow
            emoji="🗑️"
            label="Delete my account"
            onPress={() =>
              Alert.alert(
                "Delete account",
                "This will permanently delete your account and all data. This cannot be undone.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: () => {} },
                ]
              )
            }
          />
        </View>

        {/* Sign out */}
        <View className="mx-5 mt-6">
          <TouchableOpacity
            onPress={handleSignOut}
            className="rounded-2xl py-4 items-center border border-error/40"
          >
            <Text className="text-error text-base" style={{ fontFamily: "Nunito_600SemiBold" }}>
              Sign out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <Text
          className="text-text-muted text-xs text-center px-8 mt-6"
          style={{ fontFamily: "Nunito_400Regular" }}
        >
          Kindroots is not a medical service. Always consult your GP, health visitor, or midwife for medical concerns.{"\n\n"}
          Kira is powered by AI. She is not a substitute for professional medical or mental health support.{"\n\n"}
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
