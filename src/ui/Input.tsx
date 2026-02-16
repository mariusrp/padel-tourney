import React from "react";
import { TextInput, KeyboardTypeOptions } from "react-native";
import { theme } from "../theme";

export function Input({
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.faint}
      keyboardType={keyboardType}
      style={{
        backgroundColor: theme.card2,
        borderWidth: 1,
        borderColor: theme.stroke,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: theme.text,
        fontWeight: "700",
        fontSize: 15,
      }}
    />
  );
}
