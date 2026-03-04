import { View } from "react-native";

interface Props {
  current: number;
  total: number;
}

export function OnboardingProgress({ current, total }: Props) {
  return (
    <View className="flex-row gap-x-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`h-2 rounded-full transition-all ${
            i < current ? "bg-terracotta" : i === current ? "bg-terracotta" : "bg-border-warm"
          }`}
          style={{ width: i === current ? 28 : 8, opacity: i <= current ? 1 : 0.4 }}
        />
      ))}
    </View>
  );
}
