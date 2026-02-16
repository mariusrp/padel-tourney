import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { theme } from "../src/theme";
import { Card } from "../src/ui/Card";
import { Button } from "../src/ui/Button";
import { useTournamentStore } from "../src/store/useTournamentStore";

export default function Home() {
  const { tournaments, hydrate, setActiveTournament } = useTournamentStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const active = tournaments.filter((t) => t.status === "ACTIVE");
  const drafts = tournaments.filter((t) => t.status === "DRAFT");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 28 }}
    >
      <View style={{ gap: 6 }}>
        <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>
          Tournaments
        </Text>
        <Text style={{ color: theme.sub }}>
          Clean, fast, and made for phone scoring.
        </Text>
      </View>

      {tournaments.length === 0 ? (
        <Card style={{ gap: 10, padding: 16 }}>
          <Text style={{ color: theme.text, fontWeight: "900", fontSize: 18 }}>
            No tournaments
          </Text>
          <Text style={{ color: theme.sub }}>
            Create your first padel tournament in under 30 seconds.
          </Text>
          <Button
            label="Play padel"
            onPress={() => router.push("/tournaments/new")}
          />
        </Card>
      ) : (
        <>
          {active.length > 0 && (
            <View style={{ gap: 10 }}>
              <Text style={{ color: theme.sub, fontWeight: "800" }}>
                ACTIVE
              </Text>
              {active.map((t) => (
                <Pressable
                  key={t.id}
                  onPress={() => {
                    setActiveTournament(t.id);
                    router.push(`/tournaments/${t.id}`);
                  }}
                >
                  <Card style={{ gap: 6 }}>
                    <Text style={{ color: theme.text, fontWeight: "900" }}>
                      {t.name}
                    </Text>
                    <Text style={{ color: theme.sub }}>
                      {t.format} • {t.players.length} players • {t.courts}{" "}
                      courts
                    </Text>
                  </Card>
                </Pressable>
              ))}
            </View>
          )}

          <View style={{ gap: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.sub, fontWeight: "800" }}>
                TOURNAMENTS
              </Text>
              <Pressable onPress={() => router.push("/tournaments/new")}>
                <Text style={{ color: theme.text, fontWeight: "800" }}>
                  New
                </Text>
              </Pressable>
            </View>

            {drafts.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => {
                  setActiveTournament(t.id);
                  router.push(`/tournaments/${t.id}`);
                }}
              >
                <Card style={{ gap: 6 }}>
                  <Text style={{ color: theme.text, fontWeight: "900" }}>
                    {t.name}
                  </Text>
                  <Text style={{ color: theme.sub }}>
                    Draft • {t.format} • {t.players.length} players
                  </Text>
                </Card>
              </Pressable>
            ))}
          </View>

          <Button
            label="Create tournament"
            onPress={() => router.push("/tournaments/new")}
          />
        </>
      )}
    </ScrollView>
  );
}
