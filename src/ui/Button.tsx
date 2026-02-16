import React from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import { theme } from "../theme";

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const bg =
    variant === "primary"
      ? theme.accent
      : variant === "secondary"
        ? theme.card2
        : variant === "danger"
          ? theme.bad
          : "transparent";

  const border =
    variant === "ghost"
      ? { borderWidth: 1, borderColor: theme.stroke2 }
      : variant === "secondary"
        ? { borderWidth: 1, borderColor: theme.stroke }
        : null;

  const textColor =
    variant === "secondary" || variant === "ghost" ? theme.text : "#fff";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          height: 52,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bg,
          opacity: disabled ? 0.45 : pressed ? 0.92 : 1,
        },
        border,
        style,
      ]}
    >
      <Text style={{ color: textColor, fontWeight: "800", fontSize: 16 }}>
        {label}
      </Text>
    </Pressable>
  );
}
