import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { height } = Dimensions.get("window");

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Illustrated header area */}
      <LinearGradient
        colors={["#FFF4EC", "#FDFAF7"]}
        style={{ height: height * 0.48 }}
        className="items-center justify-center rounded-b-[48px]"
      >
        <Text style={{ fontSize: 80 }}>🌱</Text>
        <Text
          className="text-4xl text-text-primary mt-4"
          style={{ fontFamily: "Nunito_800ExtraBold", letterSpacing: -0.5 }}
        >
          Kindroots
        </Text>
        <Text
          className="text-text-muted text-base mt-2 text-center px-8"
          style={{ fontFamily: "Nunito_400Regular" }}
        >
          Your personal parenting companion,{"\n"}from bump to big kid.
        </Text>
      </LinearGradient>

      {/* Content */}
      <View className="flex-1 px-6 pt-10 justify-between pb-6">
        {/* Features */}
        <View className="gap-y-4">
          {[
            { emoji: "✨", text: "Personalised guidance from the world's best parenting books" },
            { emoji: "🤱", text: "Kira, your AI support companion — available at 3am" },
            { emoji: "📅", text: "Routines, milestones, and daily logs in one beautiful place" },
          ].map((item, i) => (
            <View key={i} className="flex-row items-center gap-x-3 bg-card-warm rounded-2xl p-4">
              <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
              <Text
                className="text-text-secondary text-sm flex-1"
                style={{ fontFamily: "Nunito_600SemiBold" }}
              >
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <View className="gap-y-3">
          <TouchableOpacity
            onPress={() => router.push("/(auth)/sign-up")}
            className="bg-terracotta rounded-3xl py-4 items-center shadow-sm"
            style={{ shadowColor: "#E07A5F", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
          >
            <Text
              className="text-white text-base"
              style={{ fontFamily: "Nunito_700Bold" }}
            >
              Get started — it's free
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/sign-in")}
            className="bg-transparent rounded-3xl py-4 items-center border border-border-warm"
          >
            <Text
              className="text-text-secondary text-base"
              style={{ fontFamily: "Nunito_600SemiBold" }}
            >
              I already have an account
            </Text>
          </TouchableOpacity>

          <Text
            className="text-text-muted text-xs text-center mt-2"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Kindroots is not a medical service. Always consult your GP,{"\n"}
            health visitor, or midwife for medical concerns.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
