import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { theme } from "../../src/theme";
import { Card } from "../../src/ui/Card";
import { Button } from "../../src/ui/Button";
import { Input } from "../../src/ui/Input";
import { useTournamentStore } from "../../src/store/useTournamentStore";

export default function TournamentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tournaments, addPlayer, removePlayer, updateTournament } =
    useTournamentStore();
  const t = useMemo(
    () => tournaments.find((x) => x.id === id),
    [tournaments, id],
  );

  const [playerName, setPlayerName] = useState("");

  if (!t) {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: theme.bg }}>
        <Text style={{ color: theme.text, fontWeight: "900" }}>
          Tournament not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 28 }}
    >
      <View style={{ gap: 6 }}>
        <Text style={{ color: theme.text, fontSize: 22, fontWeight: "900" }}>
          {t.name}
        </Text>
        <Text style={{ color: theme.sub }}>
          {t.status} • {t.format} • {t.players.length} players • {t.courts}{" "}
          courts
        </Text>
      </View>

      <Card style={{ gap: 10 }}>
        <Text style={{ color: theme.sub, fontWeight: "800" }}>PLAYERS</Text>
        <Input
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Add player name"
        />
        <Button
          label="Add player"
          variant="secondary"
          onPress={() => {
            addPlayer(t.id, playerName);
            setPlayerName("");
          }}
          disabled={playerName.trim().length < 2}
        />

        <View style={{ gap: 8, marginTop: 6 }}>
          {t.players.length === 0 ? (
            <Text style={{ color: theme.faint }}>No players yet.</Text>
          ) : (
            t.players.map((p) => (
              <View
                key={p.id}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  backgroundColor: theme.card2,
                  borderWidth: 1,
                  borderColor: theme.stroke,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: theme.text, fontWeight: "800" }}>
                  {p.name}
                </Text>
                <Pressable onPress={() => removePlayer(t.id, p.id)}>
                  <Text style={{ color: theme.sub, fontWeight: "800" }}>
                    Remove
                  </Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={{ color: theme.sub, fontWeight: "800" }}>COURTS</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: theme.text, fontWeight: "800" }}>
            Auto courts
          </Text>
          <Pressable
            onPress={() =>
              updateTournament(t.id, { autoCourts: !t.autoCourts })
            }
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: theme.stroke2,
              backgroundColor: t.autoCourts
                ? "rgba(59,130,246,0.14)"
                : "transparent",
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              {t.autoCourts ? "ON" : "OFF"}
            </Text>
          </Pressable>
        </View>

        <Text style={{ color: theme.faint, fontSize: 12 }}>
          Courts increase as players are added (4 players = 1 court).
        </Text>
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={{ color: theme.sub, fontWeight: "800" }}>ACTIONS</Text>

        <Button
          label={
            t.format === "MEXICANO"
              ? "Configure & Start"
              : "Start (coming soon)"
          }
          disabled={t.format !== "MEXICANO" || t.players.length < 4}
          onPress={() => router.push(`/tournaments/${t.id}/config`)}
        />

        <Text style={{ color: theme.faint, fontSize: 12 }}>
          Mexicano only for now. Need at least 4 players.
        </Text>
      </Card>
    </ScrollView>
  );
}
