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

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Just a sec", "Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      Alert.alert("Couldn't sign in", "Please check your email and password and try again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    // Auth state change handler in _layout.tsx will redirect
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
            Welcome back 👋
          </Text>
          <Text
            className="text-text-muted text-base mb-10"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Great to see you again.
          </Text>

          {/* Form */}
          <View className="gap-y-4">
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
                placeholder="Your password"
                placeholderTextColor="#9E9690"
                secureTextEntry
                className="bg-card-warm rounded-2xl px-4 py-4 text-text-primary text-base border border-border-soft"
                style={{ fontFamily: "Nunito_400Regular" }}
              />
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity
            onPress={handleSignIn}
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
                Sign in
              </Text>
            )}
          </TouchableOpacity>

          {/* Demo account shortcut */}
          <TouchableOpacity
            onPress={() => {
              setEmail("demo@kindroots.app");
              setPassword("Demo1234!");
            }}
            className="mt-4 items-center"
          >
            <Text
              className="text-text-muted text-sm"
              style={{ fontFamily: "Nunito_400Regular" }}
            >
              Try the{" "}
              <Text className="text-terracotta" style={{ fontFamily: "Nunito_700Bold" }}>
                demo account
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/(auth)/sign-up")}
            className="mt-6 items-center"
          >
            <Text
              className="text-text-muted text-sm"
              style={{ fontFamily: "Nunito_400Regular" }}
            >
              Don't have an account?{" "}
              <Text className="text-terracotta" style={{ fontFamily: "Nunito_700Bold" }}>
                Sign up free
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
