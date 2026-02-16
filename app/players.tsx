import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { theme } from "../src/theme";
import { Card } from "../src/ui/Card";
import { Button } from "../src/ui/Button";
import { Input } from "../src/ui/Input";
import { useTournamentStore } from "../src/store/useTournamentStore";

export default function PlayersScreen() {
  const { tournaments, activeTournamentId, addPlayer, removePlayer } =
    useTournamentStore();

  const tournament = useMemo(
    () => tournaments.find((t) => t.id === activeTournamentId),
    [tournaments, activeTournamentId],
  );

  const [name, setName] = useState("");

  if (!tournament) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, padding: 16 }}>
        <Text style={{ color: theme.text, fontWeight: "800" }}>
          No active tournament
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
    >
      <Text style={{ color: theme.text, fontSize: 22, fontWeight: "900" }}>
        Players
      </Text>

      <Card style={{ gap: 10 }}>
        <Input value={name} onChangeText={setName} placeholder="Player name" />

        <Button
          label="Add player"
          variant="secondary"
          disabled={name.trim().length < 2}
          onPress={() => {
            addPlayer(tournament.id, name);
            setName("");
          }}
        />
      </Card>

      <Card style={{ gap: 8 }}>
        {tournament.players.length === 0 && (
          <Text style={{ color: theme.faint }}>No players added yet.</Text>
        )}

        {tournament.players.map((p) => (
          <View
            key={p.id}
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: theme.card2,
              borderWidth: 1,
              borderColor: theme.stroke,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              {p.name}
            </Text>

            <Pressable onPress={() => removePlayer(tournament.id, p.id)}>
              <Text
                style={{
                  color: theme.sub,
                  fontWeight: "800",
                }}
              >
                Remove
              </Text>
            </Pressable>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}
