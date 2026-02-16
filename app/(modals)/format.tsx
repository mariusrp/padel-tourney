import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { theme } from "../../src/theme";

const options = [
  {
    key: "MEXICANO",
    title: "Mexicano",
    desc: "Enabled (rounds based on ranking)",
    enabled: true,
  },
  { key: "AMERICANO", title: "Americano", desc: "Coming soon", enabled: false },
  {
    key: "FIXED_AMERICANO",
    title: "Fixed Americano",
    desc: "Coming soon",
    enabled: false,
  },
  {
    key: "FIXED_MEXICANO",
    title: "Fixed Mexicano",
    desc: "Coming soon",
    enabled: false,
  },
] as const;

export default function FormatModal() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, gap: 10 }}
    >
      {options.map((o) => (
        <Pressable
          key={o.key}
          onPress={o.enabled ? () => router.back() : undefined}
          style={({ pressed }) => ({
            padding: 14,
            borderRadius: theme.radius,
            borderWidth: 1,
            borderColor: theme.stroke,
            backgroundColor: theme.card,
            opacity: o.enabled ? (pressed ? 0.92 : 1) : 0.5,
          })}
        >
          <Text style={{ color: theme.text, fontWeight: "900", fontSize: 16 }}>
            {o.title}
          </Text>
          <Text style={{ color: theme.sub, marginTop: 6 }}>{o.desc}</Text>
          {!o.enabled && (
            <Text style={{ color: theme.faint, marginTop: 10, fontSize: 12 }}>
              Disabled
            </Text>
          )}
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
