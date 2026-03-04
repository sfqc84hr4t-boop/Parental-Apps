import { TextInput, View, Text, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, className, ...props }: InputProps) {
  return (
    <View>
      {label && (
        <Text
          className="text-text-secondary text-sm mb-2"
          style={{ fontFamily: "Nunito_600SemiBold" }}
        >
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor="#9E9690"
        className={`bg-card-warm rounded-2xl px-4 py-4 text-text-primary border ${
          error ? "border-error" : "border-border-soft"
        } ${className ?? ""}`}
        style={{ fontFamily: "Nunito_400Regular", fontSize: 15 }}
        {...props}
      />
      {hint && !error && (
        <Text
          className="text-text-muted text-xs mt-1"
          style={{ fontFamily: "Nunito_400Regular" }}
        >
          {hint}
        </Text>
      )}
      {error && (
        <Text
          className="text-error text-xs mt-1"
          style={{ fontFamily: "Nunito_600SemiBold" }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
