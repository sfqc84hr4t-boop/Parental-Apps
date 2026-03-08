import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useFamilyStore } from "@/stores/familyStore";
import { useKiraStore } from "@/stores/kiraStore";
import { KiraMessage } from "@/lib/types";
import { getBabyAgeLabel, getBabyAgeWeeks, getCurrentLeap } from "@/lib/helpers";

const QUICK_REPLIES = [
  "Why is baby crying?",
  "Help with sleep",
  "Feeding questions",
  "Is this normal?",
  "I'm really struggling",
  "Wonder Weeks?",
];

function MessageBubble({ message }: { message: KiraMessage }) {
  const isKira = message.role === "assistant";
  return (
    <View
      className={`mb-3 flex-row ${isKira ? "justify-start" : "justify-end"}`}
      style={{ paddingHorizontal: 16 }}
    >
      {isKira && (
        <View className="w-8 h-8 bg-terracotta/20 rounded-full items-center justify-center mr-2 mt-auto">
          <Text style={{ fontSize: 16 }}>✨</Text>
        </View>
      )}
      <View
        className={`rounded-3xl px-4 py-3 max-w-[78%] ${
          isKira
            ? "bg-card-warm rounded-tl-sm border border-border-soft"
            : "bg-terracotta rounded-tr-sm"
        }`}
      >
        <Text
          className={isKira ? "text-text-primary" : "text-white"}
          style={{ fontFamily: "Nunito_400Regular", fontSize: 15, lineHeight: 22 }}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
}

function TypingIndicator() {
  return (
    <View className="flex-row items-center px-5 mb-4 gap-x-2">
      <View className="w-8 h-8 bg-terracotta/20 rounded-full items-center justify-center">
        <Text style={{ fontSize: 16 }}>✨</Text>
      </View>
      <View className="bg-card-warm rounded-3xl rounded-tl-sm px-4 py-3 border border-border-soft">
        <Text style={{ fontFamily: "Nunito_400Regular", color: "#9E9690" }}>
          Kira is typing...
        </Text>
      </View>
    </View>
  );
}

export default function KiraScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const { family, baby, leaps, familyContext } = useFamilyStore();
  const { messages, isTyping, sendMessage, fetchMessages } = useKiraStore();
  const [input, setInput] = useState(
    params.mode === "normal" ? "Is this normal? " : ""
  );
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (family) {
      fetchMessages(family.id).then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [family]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isTyping]);

  const canSend = input.trim().length > 0 && !isTyping;

  const handleSend = async () => {
    if (!canSend || !family || !familyContext) return;
    const text = input.trim();
    setInput("");
    await sendMessage(text, family.id, familyContext);
  };

  const handleQuickReply = (text: string) => {
    setInput(text);
  };

  // Pinned header info
  const ageWeeks = baby?.date_of_birth ? getBabyAgeWeeks(baby) : 0;
  const currentLeap = getCurrentLeap(ageWeeks, leaps);

  const allMessages = [...messages];
  if (allMessages.length === 0 && !isLoading) {
    // Synthetic welcome message
    allMessages.push({
      id: "welcome",
      created_at: new Date().toISOString(),
      family_id: family?.id ?? "",
      role: "assistant",
      content: `Hi ${profile?.full_name?.split(" ")[0] ?? "there"} 👋 I'm Kira, your Kindroots companion.${
        baby && baby.name !== "Baby"
          ? ` I know all about ${baby.name} and I'm here whenever you need me — day or night.`
          : " I'm here whenever you need me — day or night."
      } What's on your mind?`,
      session_id: "",
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* ── Header ── */}
        <View className="px-5 pt-4 pb-3 border-b border-border-soft bg-cream">
          <View className="flex-row items-center gap-x-3">
            <View className="w-10 h-10 bg-terracotta/20 rounded-full items-center justify-center">
              <Text style={{ fontSize: 20 }}>✨</Text>
            </View>
            <View className="flex-1">
              <Text
                className="text-text-primary text-base"
                style={{ fontFamily: "Nunito_700Bold" }}
              >
                Kira
              </Text>
              <Text
                className="text-text-muted text-xs"
                style={{ fontFamily: "Nunito_400Regular" }}
              >
                {baby?.name ? `${baby.name} · ${getBabyAgeLabel(baby)}` : "Your parenting companion"}
                {currentLeap ? ` · WW${currentLeap.leap_number} 🌩` : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Messages ── */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#E07A5F" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={allMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            ListHeaderComponent={<View className="h-4" />}
            ListFooterComponent={
              <>
                {isTyping && <TypingIndicator />}
                <View className="h-4" />
              </>
            }
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          />
        )}

        {/* ── Quick replies (show when no active conversation) ── */}
        {messages.length === 0 && !isTyping && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-grow-0"
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
          >
            <View className="flex-row gap-x-2">
              {QUICK_REPLIES.map((qr) => (
                <TouchableOpacity
                  key={qr}
                  onPress={() => handleQuickReply(qr)}
                  className="bg-card-warm rounded-2xl px-4 py-2 border border-border-soft"
                >
                  <Text
                    className="text-text-secondary text-sm"
                    style={{ fontFamily: "Nunito_600SemiBold" }}
                  >
                    {qr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* ── Input ── */}
        <View
          className="flex-row items-end gap-x-3 px-4 py-3 border-t border-border-soft bg-cream"
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={`Ask Kira anything...`}
            placeholderTextColor="#9E9690"
            multiline
            maxLength={1000}
            className="flex-1 bg-card-warm rounded-2xl px-4 py-3 text-text-primary border border-border-soft"
            style={{
              fontFamily: "Nunito_400Regular",
              fontSize: 15,
              maxHeight: 120,
              lineHeight: 22,
            }}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!canSend}
            className={`w-11 h-11 rounded-full items-center justify-center ${
              canSend ? "bg-terracotta" : "bg-border-warm"
            }`}
          >
            <Text style={{ fontSize: 18 }}>↑</Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <Text
          className="text-text-muted text-xs text-center pb-2"
          style={{ fontFamily: "Nunito_400Regular" }}
        >
          Kira is AI-powered and not a substitute for medical advice.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
