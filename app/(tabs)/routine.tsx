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
import { useFamilyStore } from "@/stores/familyStore";
import { supabase } from "@/lib/supabase";
import { GeneratedRoutine, GeneratedRoutineEvent, Routine, RoutineStep } from "@/lib/types";
import {
  ROUTINE_CATEGORY_COLOURS,
  ROUTINE_CATEGORY_ICONS,
  formatTime12h,
  getBabyAgeWeeks,
} from "@/lib/helpers";

export default function RoutineScreen() {
  const { family, baby, familyContext } = useFamilyStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedRoutine | null>(null);
  const [savedRoutines, setSavedRoutines] = useState<Routine[]>([]);
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [steps, setSteps] = useState<RoutineStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    loadSavedRoutines();
  }, [family]);

  const loadSavedRoutines = async () => {
    if (!family) {
      setIsLoading(false);
      return;
    }
    const { data } = await supabase
      .from("routines")
      .select("*")
      .eq("family_id", family.id)
      .eq("is_active", true)
      .order("sort_order");
    if (data) setSavedRoutines(data);

    // Load first active routine's steps
    if (data && data.length > 0) {
      setActiveRoutine(data[0]);
      const { data: stepsData } = await supabase
        .from("routine_steps")
        .select("*")
        .eq("routine_id", data[0].id)
        .order("sort_order");
      if (stepsData) setSteps(stepsData);
    }
    setIsLoading(false);
  };

  const generateRoutine = async () => {
    if (!familyContext || !baby) return;

    setIsGenerating(true);
    setGenerated(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-routine", {
        body: {
          familyContext: {
            ...familyContext,
            babyAgeWeeks: getBabyAgeWeeks(baby),
            stressLevel: "medium",
          },
        },
      });

      if (error) throw error;
      setGenerated(data);
    } catch (err: any) {
      Alert.alert("Couldn't generate routine", err.message ?? "Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveGeneratedRoutine = async () => {
    if (!generated || !family) return;

    const { data: routine } = await supabase
      .from("routines")
      .insert({
        family_id: family.id,
        name: generated.routineTitle,
        routine_type: "custom",
        is_active: true,
      })
      .select()
      .single();

    if (routine && generated.events) {
      const stepsToInsert = generated.events.map((e, i) => ({
        routine_id: routine.id,
        sort_order: i,
        title: `${e.time} — ${e.activity}`,
        duration_minutes: null,
        icon: ROUTINE_CATEGORY_ICONS[e.category],
        notes: e.tip,
      }));
      await supabase.from("routine_steps").insert(stepsToInsert);
    }

    Alert.alert("Saved!", `"${generated.routineTitle}" has been saved to your routines.`);
    loadSavedRoutines();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator color="#E07A5F" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-4 border-b border-border-soft">
          <Text
            className="text-2xl text-text-primary"
            style={{ fontFamily: "Nunito_800ExtraBold" }}
          >
            Daily Routine 📅
          </Text>
          <Text
            className="text-text-muted text-sm"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            {family?.frameworks.includes("gina-ford")
              ? "Structured schedules, Gina Ford style"
              : "Rhythm-based suggestions for your family"}
          </Text>
        </View>

        <View className="px-5 mt-5">
          {/* Generate button */}
          <TouchableOpacity
            onPress={generateRoutine}
            disabled={isGenerating || !baby}
            className={`rounded-3xl py-4 items-center mb-6 ${
              isGenerating ? "bg-border-warm" : "bg-terracotta"
            }`}
            style={!isGenerating ? { shadowColor: "#E07A5F", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 } : {}}
          >
            {isGenerating ? (
              <View className="flex-row items-center gap-x-3">
                <ActivityIndicator color="#9E9690" size="small" />
                <Text className="text-text-muted" style={{ fontFamily: "Nunito_600SemiBold" }}>
                  Building your routine...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-base" style={{ fontFamily: "Nunito_700Bold" }}>
                ✨ Generate {baby?.name ? `${baby.name}'s` : "a"} routine
              </Text>
            )}
          </TouchableOpacity>

          {/* Generated routine */}
          {generated && (
            <View className="mb-6">
              <View className="bg-card-warm rounded-3xl p-5 border border-border-soft mb-4">
                <Text
                  className="text-text-primary text-lg"
                  style={{ fontFamily: "Nunito_700Bold" }}
                >
                  {generated.routineTitle}
                </Text>
                <Text
                  className="text-text-muted text-xs mt-1"
                  style={{ fontFamily: "Nunito_400Regular" }}
                >
                  {generated.frameworkNote}
                </Text>
              </View>

              {/* Timeline */}
              <View className="gap-y-2">
                {generated.events.map((event, i) => (
                  <RoutineEventCard key={i} event={event} />
                ))}
              </View>

              {/* Save button */}
              <TouchableOpacity
                onPress={saveGeneratedRoutine}
                className="mt-5 rounded-3xl py-4 items-center border-2 border-terracotta"
              >
                <Text
                  className="text-terracotta text-base"
                  style={{ fontFamily: "Nunito_700Bold" }}
                >
                  Save this routine
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Saved routines */}
          {savedRoutines.length > 0 && !generated && (
            <View>
              <Text
                className="text-text-primary text-base mb-3"
                style={{ fontFamily: "Nunito_700Bold" }}
              >
                Your saved routines
              </Text>
              {steps.map((step) => (
                <View
                  key={step.id}
                  className="flex-row items-center gap-x-3 bg-card-warm rounded-2xl p-4 mb-2 border border-border-soft"
                >
                  <Text style={{ fontSize: 20 }}>{step.icon ?? "⏰"}</Text>
                  <View className="flex-1">
                    <Text
                      className="text-text-primary text-sm"
                      style={{ fontFamily: "Nunito_600SemiBold" }}
                    >
                      {step.title}
                    </Text>
                    {step.notes && (
                      <Text
                        className="text-text-muted text-xs mt-0.5"
                        style={{ fontFamily: "Nunito_400Regular" }}
                      >
                        {step.notes}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Empty state */}
          {savedRoutines.length === 0 && !generated && !isGenerating && (
            <View className="items-center py-8">
              <Text style={{ fontSize: 48 }}>📅</Text>
              <Text
                className="text-text-primary text-lg text-center mt-4"
                style={{ fontFamily: "Nunito_700Bold" }}
              >
                No routine yet
              </Text>
              <Text
                className="text-text-muted text-base text-center mt-2"
                style={{ fontFamily: "Nunito_400Regular" }}
              >
                Tap "Generate a routine" above and Kira will create{"\n"}a personalised daily schedule for your family.
              </Text>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RoutineEventCard({ event }: { event: GeneratedRoutineEvent }) {
  return (
    <View
      className="rounded-2xl p-4 border border-border-soft flex-row gap-x-3"
      style={{ backgroundColor: ROUTINE_CATEGORY_COLOURS[event.category] ?? "#FFF4EC" }}
    >
      {/* Time */}
      <View className="items-center" style={{ width: 48 }}>
        <Text
          className="text-terracotta text-sm"
          style={{ fontFamily: "Nunito_700Bold" }}
        >
          {formatTime12h(event.time)}
        </Text>
        <Text style={{ fontSize: 18, marginTop: 2 }}>
          {ROUTINE_CATEGORY_ICONS[event.category] ?? "⏰"}
        </Text>
      </View>

      {/* Divider */}
      <View className="w-px bg-border-warm mx-1" />

      {/* Content */}
      <View className="flex-1">
        <Text
          className="text-text-primary text-sm"
          style={{ fontFamily: "Nunito_700Bold" }}
        >
          {event.activity}
        </Text>
        <Text
          className="text-text-muted text-xs mt-0.5"
          style={{ fontFamily: "Nunito_400Regular" }}
        >
          {event.duration}
        </Text>
        {event.tip && (
          <Text
            className="text-text-secondary text-xs mt-2 italic"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            💡 {event.tip}
          </Text>
        )}
      </View>
    </View>
  );
}
