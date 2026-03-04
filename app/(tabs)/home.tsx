import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import { useAuthStore } from "@/stores/authStore";
import { useFamilyStore } from "@/stores/familyStore";
import {
  getGreeting,
  getBabyAgeLabel,
  getCurrentLeap,
  getBabyAgeWeeks,
  getDueDateCountdown,
} from "@/lib/helpers";
import { supabase } from "@/lib/supabase";
import { DailyLog } from "@/lib/types";

// ─── Quick Log Sheet ─────────────────────────────────────────────
function QuickActions({ onLog }: { onLog: (type: string) => void }) {
  const router = useRouter();
  const actions = [
    { emoji: "🍼", label: "Log feed", action: "feed" },
    { emoji: "😴", label: "Log sleep", action: "sleep" },
    { emoji: "✨", label: "Ask Kira", action: "kira" },
    { emoji: "🤔", label: "Is this normal?", action: "normal" },
  ];
  return (
    <View className="flex-row gap-x-3 mb-6">
      {actions.map((a) => (
        <TouchableOpacity
          key={a.action}
          onPress={() => {
            if (a.action === "kira") router.push("/(tabs)/kira");
            else if (a.action === "normal") router.push({ pathname: "/(tabs)/kira", params: { mode: "normal" } });
            else onLog(a.action);
          }}
          className="flex-1 bg-card-warm rounded-2xl py-3 items-center border border-border-soft"
        >
          <Text style={{ fontSize: 22 }}>{a.emoji}</Text>
          <Text
            className="text-text-muted text-xs mt-1 text-center"
            style={{ fontFamily: "Nunito_600SemiBold" }}
          >
            {a.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Leap Card ───────────────────────────────────────────────────
function LeapCard({ leap, isInLeap }: { leap: any; isInLeap: boolean }) {
  if (!leap) return null;
  return (
    <View className="bg-lavender-light rounded-3xl p-5 mb-4 border border-border-soft">
      <View className="flex-row items-center gap-x-2 mb-2">
        <Text style={{ fontSize: 20 }}>🌟</Text>
        <Text
          className="text-text-primary text-sm"
          style={{ fontFamily: "Nunito_700Bold" }}
        >
          Wonder Week {leap.leap_number}
        </Text>
        {isInLeap && (
          <View className="bg-terracotta rounded-full px-2 py-0.5 ml-auto">
            <Text
              className="text-white text-xs"
              style={{ fontFamily: "Nunito_700Bold" }}
            >
              Stormy period
            </Text>
          </View>
        )}
      </View>
      <Text
        className="text-text-primary text-base"
        style={{ fontFamily: "Nunito_700Bold" }}
      >
        {leap.name}
      </Text>
      <Text
        className="text-text-secondary text-sm mt-1"
        style={{ fontFamily: "Nunito_400Regular" }}
      >
        {isInLeap ? leap.stormy_description : `Coming around week ${leap.age_weeks_start}`}
      </Text>
    </View>
  );
}

// ─── Log Modal (simple inline) ──────────────────────────────────
function LogConfirmation({ type, onDone }: { type: string | null; onDone: () => void }) {
  const { baby } = useFamilyStore();
  const { addLog } = useFamilyStore();

  if (!type || !baby) return null;

  const handleLog = async () => {
    await addLog({
      baby_id: baby.id,
      logged_at: new Date().toISOString(),
      log_type: type as any,
    });
    onDone();
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 border-t border-border-soft"
      style={{ shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 8 }}
    >
      <Text
        className="text-text-primary text-lg text-center mb-4"
        style={{ fontFamily: "Nunito_700Bold" }}
      >
        {type === "feed" ? "🍼 Log a feed" : "😴 Log sleep"}
      </Text>
      <Text
        className="text-text-muted text-sm text-center mb-6"
        style={{ fontFamily: "Nunito_400Regular" }}
      >
        Tap to log {type} at {format(new Date(), "HH:mm")}
      </Text>
      <TouchableOpacity
        onPress={handleLog}
        className="bg-terracotta rounded-2xl py-4 items-center mb-3"
      >
        <Text className="text-white" style={{ fontFamily: "Nunito_700Bold" }}>
          Log now
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDone} className="items-center py-2">
        <Text className="text-text-muted" style={{ fontFamily: "Nunito_400Regular" }}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Home Screen ────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { family, baby, leaps, fetchFamily, fetchRecentLogs, recentLogs } = useFamilyStore();
  const [logType, setLogType] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFamily();
    fetchRecentLogs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFamily();
    await fetchRecentLogs();
    setRefreshing(false);
  };

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const ageLabel = baby?.date_of_birth ? getBabyAgeLabel(baby) : null;
  const ageWeeks = baby?.date_of_birth ? getBabyAgeWeeks(baby) : 0;
  const currentLeap = getCurrentLeap(ageWeeks, leaps);
  const upcomingLeap = leaps.find((l) => l.age_weeks_start > ageWeeks + 2) ?? null;

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E07A5F" />
        }
      >
        {/* ── Header ── */}
        <View className="mt-6 mb-6 flex-row items-start">
          <View className="flex-1">
            <Text
              className="text-2xl text-text-primary"
              style={{ fontFamily: "Nunito_800ExtraBold" }}
            >
              {getGreeting()}, {firstName} 👋
            </Text>
            <Text
              className="text-text-muted text-sm mt-1"
              style={{ fontFamily: "Nunito_400Regular" }}
            >
              {format(new Date(), "EEEE, d MMMM yyyy")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            className="w-10 h-10 bg-card-warm rounded-full items-center justify-center border border-border-soft ml-3 mt-1"
          >
            <Text style={{ fontSize: 18 }}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* ── Baby hero card ── */}
        {baby && (
          <View className="bg-card-warm rounded-3xl p-5 mb-4 border border-border-soft">
            <View className="flex-row items-center gap-x-4">
              <View className="w-14 h-14 bg-terracotta/20 rounded-full items-center justify-center">
                <Text style={{ fontSize: 28 }}>
                  {family?.stage === "pregnancy" ? "🤰" : "👶"}
                </Text>
              </View>
              <View className="flex-1">
                <Text
                  className="text-text-primary text-xl"
                  style={{ fontFamily: "Nunito_800ExtraBold" }}
                >
                  {baby.name === "Baby" && family?.stage === "pregnancy"
                    ? "Your baby"
                    : baby.name}
                </Text>
                {ageLabel && (
                  <Text
                    className="text-terracotta text-sm"
                    style={{ fontFamily: "Nunito_700Bold" }}
                  >
                    {ageLabel}
                  </Text>
                )}
                {family?.stage === "pregnancy" && baby.due_date && (
                  <Text
                    className="text-terracotta text-sm"
                    style={{ fontFamily: "Nunito_700Bold" }}
                  >
                    {getDueDateCountdown(baby.due_date)}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* ── Quick actions ── */}
        {family?.stage !== "pregnancy" && (
          <QuickActions onLog={(type) => setLogType(type)} />
        )}

        {/* ── Wonder Weeks ── */}
        {leaps.length > 0 && baby?.date_of_birth && (
          <LeapCard
            leap={currentLeap ?? upcomingLeap}
            isInLeap={!!currentLeap}
          />
        )}

        {/* ── Kira proactive card ── */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/kira")}
          className="bg-card-blush rounded-3xl p-5 mb-4 border border-border-soft"
        >
          <View className="flex-row items-center gap-x-3 mb-3">
            <Text style={{ fontSize: 28 }}>✨</Text>
            <View className="flex-1">
              <Text
                className="text-text-primary text-base"
                style={{ fontFamily: "Nunito_700Bold" }}
              >
                Kira is here for you
              </Text>
              <Text
                className="text-text-muted text-xs"
                style={{ fontFamily: "Nunito_400Regular" }}
              >
                Your AI parenting companion, 24/7
              </Text>
            </View>
          </View>
          <Text
            className="text-text-secondary text-sm"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            {baby?.name
              ? `How is ${baby.name} sleeping? Any worries today? Kira is ready to help.`
              : "Got a question? Kira is here to help — any time of day or night."}
          </Text>
          <View className="mt-4 bg-terracotta rounded-2xl py-3 items-center">
            <Text className="text-white text-sm" style={{ fontFamily: "Nunito_700Bold" }}>
              Chat with Kira →
            </Text>
          </View>
        </TouchableOpacity>

        {/* ── Recent logs ── */}
        {recentLogs.length > 0 && (
          <View className="mb-4">
            <Text
              className="text-text-primary text-base mb-3"
              style={{ fontFamily: "Nunito_700Bold" }}
            >
              Today's logs
            </Text>
            {recentLogs.slice(0, 5).map((log) => (
              <View
                key={log.id}
                className="flex-row items-center gap-x-3 bg-card-warm rounded-2xl p-3 mb-2 border border-border-soft"
              >
                <Text style={{ fontSize: 18 }}>
                  {log.log_type === "feed" ? "🍼" : log.log_type === "sleep" ? "😴" : "🧷"}
                </Text>
                <Text
                  className="text-text-secondary text-sm"
                  style={{ fontFamily: "Nunito_600SemiBold" }}
                >
                  {log.log_type.charAt(0).toUpperCase() + log.log_type.slice(1)}
                </Text>
                <Text
                  className="text-text-muted text-xs ml-auto"
                  style={{ fontFamily: "Nunito_400Regular" }}
                >
                  {format(new Date(log.logged_at), "HH:mm")}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Stage guide ── */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/guides")}
          className="bg-mint-light rounded-3xl p-5 mb-4 border border-border-soft"
        >
          <Text style={{ fontSize: 24 }}>📚</Text>
          <Text
            className="text-text-primary text-base mt-2"
            style={{ fontFamily: "Nunito_700Bold" }}
          >
            Your stage guides
          </Text>
          <Text
            className="text-text-secondary text-sm mt-1"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Guides tailored to {baby?.name ?? "your baby"}'s current age and your chosen frameworks.
          </Text>
        </TouchableOpacity>

        {/* ── Wellbeing nudge ── */}
        <View className="bg-lavender-light rounded-3xl p-5 border border-border-soft">
          <Text style={{ fontSize: 20 }}>💛</Text>
          <Text
            className="text-text-primary text-base mt-2"
            style={{ fontFamily: "Nunito_700Bold" }}
          >
            How are you doing?
          </Text>
          <Text
            className="text-text-secondary text-sm mt-1 mb-4"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            A 30-second check-in. Your wellbeing matters too.
          </Text>
          <View className="flex-row gap-x-3">
            {["😩", "😕", "😐", "🙂", "😊"].map((emoji, i) => (
              <TouchableOpacity
                key={i}
                className="flex-1 bg-white rounded-xl py-3 items-center border border-border-soft"
              >
                <Text style={{ fontSize: 24 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text
            className="text-text-muted text-xs text-center mt-3"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Kira is watching out for you. If you're struggling, she's here.
          </Text>
        </View>
      </ScrollView>

      {/* Log sheet overlay */}
      {logType && (
        <LogConfirmation type={logType} onDone={() => setLogType(null)} />
      )}
    </SafeAreaView>
  );
}
