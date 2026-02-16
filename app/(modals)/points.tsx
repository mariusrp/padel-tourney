import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { theme } from "../../src/theme";

const points = [11, 15, 21, 24, 32];

export default function PointsModal() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, gap: 10 }}
    >
      {points.map((p) => (
        <Pressable
          key={p}
          onPress={() => router.back()}
          style={({ pressed }) => ({
            padding: 14,
            borderRadius: theme.radius,
            borderWidth: 1,
            borderColor: theme.stroke,
            backgroundColor: theme.card,
            opacity: pressed ? 0.92 : 1,
          })}
        >
          <Text style={{ color: theme.text, fontWeight: "900", fontSize: 16 }}>
            {p} points
          </Text>
          <Text style={{ color: theme.sub, marginTop: 6 }}>
            First to {p} (MVP)
          </Text>
        </Pressable>
      ))}
      <Pressable onPress={() => router.back()} style={{ padding: 14 }}>
        <Text
          style={{ color: theme.sub, fontWeight: "800", textAlign: "center" }}
        >
          Close
        </Text>
      </Pressable>
    </ScrollView>
  );
}
