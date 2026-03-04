import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

const variantStyles = {
  primary: {
    container: "bg-terracotta",
    text: "text-white",
    shadow: { shadowColor: "#E07A5F", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  },
  secondary: {
    container: "border-2 border-terracotta bg-transparent",
    text: "text-terracotta",
    shadow: {},
  },
  ghost: {
    container: "bg-transparent",
    text: "text-text-secondary",
    shadow: {},
  },
};

export function Button({ label, variant = "primary", isLoading, disabled, className, ...props }: ButtonProps) {
  const v = variantStyles[variant];
  return (
    <TouchableOpacity
      disabled={isLoading || disabled}
      className={`rounded-3xl py-4 items-center ${v.container} ${disabled || isLoading ? "opacity-50" : ""} ${className ?? ""}`}
      style={v.shadow}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#E07A5F"} />
      ) : (
        <Text className={`text-base ${v.text}`} style={{ fontFamily: "Nunito_700Bold" }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
