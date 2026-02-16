import React from "react";
import { View, ViewStyle } from "react-native";
import { theme } from "../theme";

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.card,
          borderRadius: theme.radius,
          borderWidth: 1,
          borderColor: theme.stroke,
          padding: 14,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
