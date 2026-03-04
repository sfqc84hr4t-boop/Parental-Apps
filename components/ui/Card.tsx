import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  variant?: "warm" | "blush" | "white";
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  warm: "bg-card-warm",
  blush: "bg-card-blush",
  white: "bg-white",
};

export function Card({ variant = "warm", children, className, ...props }: CardProps) {
  return (
    <View
      className={`rounded-3xl border border-border-soft p-4 ${variantStyles[variant]} ${className ?? ""}`}
      style={{ shadowColor: "#2D2A26", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1, ...((props.style as object) ?? {}) }}
      {...props}
    >
      {children}
    </View>
  );
}
