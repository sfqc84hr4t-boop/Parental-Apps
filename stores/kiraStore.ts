import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { KiraMessage } from "@/lib/types";

interface KiraState {
  messages: KiraMessage[];
  sessionId: string | null;
  isTyping: boolean;
  dailyMessageCount: number;
  isLoading: boolean;
  sendMessage: (
    content: string,
    familyId: string,
    familyContext: object
  ) => Promise<void>;
  fetchMessages: (familyId: string) => Promise<void>;
  resetSession: () => void;
}

const FREE_DAILY_LIMIT = 10;

export const useKiraStore = create<KiraState>((set, get) => ({
  messages: [],
  sessionId: null,
  isTyping: false,
  dailyMessageCount: 0,
  isLoading: false,

  fetchMessages: async (familyId: string) => {
    set({ isLoading: true });
    const { data } = await supabase
      .from("kira_messages")
      .select("*")
      .eq("family_id", familyId)
      .order("created_at", { ascending: true })
      .limit(100);

    if (data) {
      set({ messages: data });
      // Use last session id
      if (data.length > 0) {
        set({ sessionId: data[data.length - 1].session_id });
      }
    }
    set({ isLoading: false });
  },

  sendMessage: async (content, familyId, familyContext) => {
    const { messages, sessionId, dailyMessageCount } = get();

    // Generate session id if first message
    const currentSessionId =
      sessionId ?? crypto.randomUUID();

    if (!sessionId) set({ sessionId: currentSessionId });

    // Optimistically add user message
    const userMsg: KiraMessage = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      family_id: familyId,
      role: "user",
      content,
      session_id: currentSessionId,
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true,
    }));

    // Save user message to DB
    await supabase.from("kira_messages").insert({
      family_id: familyId,
      role: "user",
      content,
      session_id: currentSessionId,
    });

    // Build message history for API (last 20 messages)
    const history = [...messages, userMsg]
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const { data, error } = await supabase.functions.invoke("kira-chat", {
        body: { messages: history, familyContext },
      });

      if (error) throw error;

      const assistantMsg: KiraMessage = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        family_id: familyId,
        role: "assistant",
        content: data.response,
        session_id: currentSessionId,
      };

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isTyping: false,
        dailyMessageCount: state.dailyMessageCount + 1,
      }));

      // Save assistant response to DB
      await supabase.from("kira_messages").insert({
        family_id: familyId,
        role: "assistant",
        content: data.response,
        session_id: currentSessionId,
      });
    } catch (err) {
      set({ isTyping: false });
      console.error("Kira error:", err);
    }
  },

  resetSession: () => set({ sessionId: null }),
}));
