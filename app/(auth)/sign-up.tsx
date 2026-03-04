import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert("Just a sec", "Please fill in all fields to continue.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Password too short", "Please use at least 8 characters.");
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { full_name: name.trim() } },
    });

    if (error) {
      Alert.alert("Oops", error.message);
      setIsLoading(false);
      return;
    }

    // Create profile row
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: name.trim(),
      });
    }

    setIsLoading(false);
    // Redirect to onboarding
    router.replace("/(onboarding)/step1");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} className="mt-4 mb-8">
            <Text className="text-text-muted text-2xl">←</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text
            className="text-3xl text-text-primary mb-2"
            style={{ fontFamily: "Nunito_800ExtraBold" }}
          >
            Create your account 🌱
          </Text>
          <Text
            className="text-text-muted text-base mb-10"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Let's get you set up in just a few minutes.
          </Text>

          {/* Form */}
          <View className="gap-y-4">
            <View>
              <Text
                className="text-text-secondary text-sm mb-2"
                style={{ fontFamily: "Nunito_600SemiBold" }}
              >
                Your first name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Sarah"
                placeholderTextColor="#9E9690"
                autoCapitalize="words"
                className="bg-card-warm rounded-2xl px-4 py-4 text-text-primary text-base border border-border-soft"
                style={{ fontFamily: "Nunito_400Regular" }}
              />
            </View>

            <View>
              <Text
                className="text-text-secondary text-sm mb-2"
                style={{ fontFamily: "Nunito_600SemiBold" }}
              >
                Email address
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#9E9690"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-card-warm rounded-2xl px-4 py-4 text-text-primary text-base border border-border-soft"
                style={{ fontFamily: "Nunito_400Regular" }}
              />
            </View>

            <View>
              <Text
                className="text-text-secondary text-sm mb-2"
                style={{ fontFamily: "Nunito_600SemiBold" }}
              >
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="At least 8 characters"
                placeholderTextColor="#9E9690"
                secureTextEntry
                className="bg-card-warm rounded-2xl px-4 py-4 text-text-primary text-base border border-border-soft"
                style={{ fontFamily: "Nunito_400Regular" }}
              />
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={isLoading}
            className="bg-terracotta rounded-3xl py-4 items-center mt-8 shadow-sm"
            style={{ shadowColor: "#E07A5F", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                className="text-white text-base"
                style={{ fontFamily: "Nunito_700Bold" }}
              >
                Create my account
              </Text>
            )}
          </TouchableOpacity>

          {/* Sign in link */}
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/sign-in")}
            className="mt-6 items-center"
          >
            <Text
              className="text-text-muted text-sm"
              style={{ fontFamily: "Nunito_400Regular" }}
            >
              Already have an account?{" "}
              <Text className="text-terracotta" style={{ fontFamily: "Nunito_700Bold" }}>
                Sign in
              </Text>
            </Text>
          </TouchableOpacity>

          <Text
            className="text-text-muted text-xs text-center mt-6"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
