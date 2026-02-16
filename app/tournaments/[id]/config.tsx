import React, { useState } from "react";
import { View, Text, ScrollView, Switch, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { theme } from "../../../src/theme";
import { Card } from "../../../src/ui/Card";
import { Button } from "../../../src/ui/Button";
import { Input } from "../../../src/ui/Input";
import { useTournamentStore } from "../../../src/store/useTournamentStore";

export default function TournamentConfig() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tournaments, updateTournament, startTournament } =
    useTournamentStore();
  const tournament = tournaments.find((t) => t.id === id);

  const [pointsToWin, setPointsToWin] = useState(
    String(tournament?.pointsToPlay ?? 21),
  );
  const [roundsBeforeRanking, setRoundsBeforeRanking] = useState("2");
  const [allowDraws, setAllowDraws] = useState(false);
  const [courtRotation, setCourtRotation] = useState(true);
  const [autoAdvanceRounds, setAutoAdvanceRounds] = useState(true);
  const [scoringMode, setScoringMode] = useState<"WINS" | "POINTS">(
    tournament?.config?.scoringMode ?? "WINS",
  );

  if (!tournament) {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: theme.bg }}>
        <Text style={{ color: theme.text, fontWeight: "900" }}>
          Tournament not found
        </Text>
      </View>
    );
  }

  const handleStart = () => {
    updateTournament(id, {
      pointsToPlay: Number(pointsToWin),
      config: {
        roundsBeforeRanking: Number(roundsBeforeRanking),
        allowDraws,
        courtRotation,
        autoAdvanceRounds,
        scoringMode,
      },
    });
    startTournament(id);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 28 }}
    >
      <View style={{ gap: 6 }}>
        <Text style={{ color: theme.text, fontSize: 22, fontWeight: "900" }}>
          Tournament Settings
        </Text>
        <Text style={{ color: theme.sub }}>
          Configure before starting {tournament.name}
        </Text>
      </View>

      <Card style={{ gap: 14 }}>
        <Text style={{ color: theme.sub, fontWeight: "800" }}>SCORING</Text>

        <View style={{ gap: 6 }}>
          <Text style={{ color: theme.text, fontWeight: "800" }}>
            Points to win
          </Text>
          <Input
            value={pointsToWin}
            onChangeText={setPointsToWin}
            placeholder="21"
            keyboardType="number-pad"
          />
          <Text style={{ color: theme.faint, fontSize: 12 }}>
            Standard: 16, 21, or 32 points
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 8,
          }}
        >
          <View style={{ gap: 2, flex: 1 }}>
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              Allow draws
            </Text>
            <Text style={{ color: theme.faint, fontSize: 12 }}>
              If disabled, matches must have a winner
            </Text>
          </View>
          <Switch value={allowDraws} onValueChange={setAllowDraws} />
        </View>
      </Card>

      <Card style={{ gap: 14 }}>
        <Text style={{ color: theme.sub, fontWeight: "800" }}>MATCHMAKING</Text>

        <View style={{ gap: 6 }}>
          <Text style={{ color: theme.text, fontWeight: "800" }}>
            Scoring mode
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={() => setScoringMode("WINS")}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                backgroundColor:
                  scoringMode === "WINS" ? theme.accent : theme.card2,
                borderWidth: 1,
                borderColor:
                  scoringMode === "WINS" ? theme.accent : theme.stroke,
              }}
            >
              <Text
                style={{
                  color: scoringMode === "WINS" ? "#fff" : theme.text,
                  fontWeight: "800",
                  textAlign: "center",
                }}
              >
                Wins
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setScoringMode("POINTS")}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                backgroundColor:
                  scoringMode === "POINTS" ? theme.accent : theme.card2,
                borderWidth: 1,
                borderColor:
                  scoringMode === "POINTS" ? theme.accent : theme.stroke,
              }}
            >
              <Text
                style={{
                  color: scoringMode === "POINTS" ? "#fff" : theme.text,
                  fontWeight: "800",
                  textAlign: "center",
                }}
              >
                Points
              </Text>
            </Pressable>
          </View>
          <Text style={{ color: theme.faint, fontSize: 12 }}>
            Wins: 1p for win, 0.5p for draw (like football/chess){"\n"}
            Points: Accumulate match points scored
          </Text>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={{ color: theme.text, fontWeight: "800" }}>
            Random rounds before ranking
          </Text>
          <Input
            value={roundsBeforeRanking}
            onChangeText={setRoundsBeforeRanking}
            placeholder="2"
            keyboardType="number-pad"
          />
          <Text style={{ color: theme.faint, fontSize: 12 }}>
            Initial rounds with random matchups. After this, 1st plays 4th, 2nd
            plays 3rd, etc.
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 8,
          }}
        >
          <View style={{ gap: 2, flex: 1 }}>
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              Court rotation
            </Text>
            <Text style={{ color: theme.faint, fontSize: 12 }}>
              Players rotate through different courts
            </Text>
          </View>
          <Switch value={courtRotation} onValueChange={setCourtRotation} />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ gap: 2, flex: 1 }}>
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              Auto-advance rounds
            </Text>
            <Text style={{ color: theme.faint, fontSize: 12 }}>
              Automatically start next round when all matches done
            </Text>
          </View>
          <Switch
            value={autoAdvanceRounds}
            onValueChange={setAutoAdvanceRounds}
          />
        </View>
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={{ color: theme.sub, fontWeight: "800" }}>SUMMARY</Text>
        <View style={{ gap: 8 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: theme.faint }}>Players:</Text>
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              {tournament.players.length}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: theme.faint }}>Courts:</Text>
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              {tournament.courts}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: theme.faint }}>Format:</Text>
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              {tournament.format}
            </Text>
          </View>
        </View>
      </Card>

      <Button
        label="Start Tournament"
        disabled={tournament.players.length < 4}
        onPress={handleStart}
      />

      <Button
        label="Back to Setup"
        variant="ghost"
        onPress={() => router.back()}
      />
    </ScrollView>
  );
}
