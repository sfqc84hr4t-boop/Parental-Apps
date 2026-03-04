import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabIconProps = {
  emoji: string;
  label: string;
  focused: boolean;
};

function TabIcon({ emoji, label, focused }: TabIconProps) {
  return (
    <View className="items-center gap-y-0.5" style={{ paddingTop: 6 }}>
      <Text style={{ fontSize: focused ? 24 : 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
      <Text
        style={{
          fontSize: 10,
          fontFamily: focused ? "Nunito_700Bold" : "Nunito_400Regular",
          color: focused ? "#E07A5F" : "#9E9690",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FDFAF7",
          borderTopColor: "#EDE9E4",
          borderTopWidth: 1,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📚" label="Guides" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="routine"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📅" label="Routine" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⭐" label="Tracker" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="kira"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="✨" label="Kira" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
