import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Switch, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { theme } from "../../src/theme";
import { Card } from "../../src/ui/Card";
import { Button } from "../../src/ui/Button";
import { Input } from "../../src/ui/Input";
import { useTournamentStore } from "../../src/store/useTournamentStore";

function Row({
  label,
  value,
  onPress,
  disabled,
}: {
  label: string;
  value?: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <View
        style={{
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.stroke,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: theme.text, fontWeight: "800" }}>{label}</Text>
        <Text style={{ color: theme.sub, fontWeight: "700" }}>
          {value ?? "Select"}
        </Text>
      </View>
    </Pressable>
  );
}

export default function NewTournament() {
  const { createTournament } = useTournamentStore();

  const [name, setName] = useState("");
  const [format, setFormat] = useState<
    "MEXICANO" | "AMERICANO" | "FIXED_AMERICANO" | "FIXED_MEXICANO"
  >("MEXICANO");
  const [pointsToPlay, setPointsToPlay] = useState(24);

  const [description, setDescription] = useState("");
  const [club, setClub] = useState("");
  const [startAt, setStartAt] = useState("");
  const [ranked, setRanked] = useState(false);
  const [courtBooked, setCourtBooked] = useState(false);
  const [entranceFee, setEntranceFee] = useState("");

  const canCreate = useMemo(() => name.trim().length >= 2, [name]);

  const handleCreateTournament = () => {
    try {
      console.log("CREATE pressed - starting");
      console.log("Tournament name:", name.trim());

      const id = createTournament({
        name: name.trim(),
        format,
        pointsToPlay,
        description: description.trim() || undefined,
        club: club.trim() || undefined,
        startAt: startAt.trim() || undefined,
        ranked,
        courtBooked,
        entranceFee: entranceFee.trim() ? Number(entranceFee) : undefined,
        autoCourts: true,
        courts: 1,
        currentRound: 0,
      });

      console.log("CREATED id:", id);
      console.log("About to navigate to:", `/tournaments/${id}`);

      // Try immediate navigation
      router.replace(`/tournaments/${id}`);

      console.log("Navigation called");
    } catch (e) {
      console.error("CREATE failed:", e);
      Alert.alert("Error", `Failed to create tournament: ${e}`);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 28 }}
    >
      <Text style={{ color: theme.text, fontSize: 22, fontWeight: "900" }}>
        New tournament
      </Text>
      <Text style={{ color: theme.sub }}>Minimal color, maximum clarity.</Text>

      <Card style={{ gap: 10 }}>
        <Text style={{ color: theme.sub, fontWeight: "800" }}>BASICS</Text>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Tournament name"
        />

        <Row
          label="Type"
          value={
            format === "MEXICANO"
              ? "Mexicano (enabled)"
              : format === "AMERICANO"
                ? "Americano (soon)"
                : format === "FIXED_AMERICANO"
                  ? "Fixed Americano (soon)"
                  : "Fixed Mexicano (soon)"
          }
          onPress={() =>
            router.push({
              pathname: "/format",
              params: { current: format },
            })
          }
        />

        <Row
          label="Points"
          value={`${pointsToPlay}`}
          onPress={() =>
            router.push({
              pathname: "/points",
              params: { current: String(pointsToPlay) },
            })
          }
        />
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={{ color: theme.sub, fontWeight: "800" }}>DETAILS</Text>
        <Input
          value={description}
          onChangeText={setDescription}
          placeholder="Description (optional)"
        />
        <Input
          value={club}
          onChangeText={setClub}
          placeholder="Club (optional)"
        />
        <Input
          value={startAt}
          onChangeText={setStartAt}
          placeholder="Date & time (optional)"
        />
        <Input
          value={entranceFee}
          onChangeText={setEntranceFee}
          placeholder="Entrance fee (optional)"
        />
      </Card>

      <Card style={{ gap: 14 }}>
        <Text style={{ color: theme.sub, fontWeight: "800" }}>SETTINGS</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ gap: 2 }}>
            <Text style={{ color: theme.text, fontWeight: "800" }}>Ranked</Text>
            <Text style={{ color: theme.faint, fontSize: 12 }}>
              Affects leaderboard visibility later
            </Text>
          </View>
          <Switch value={ranked} onValueChange={setRanked} />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ gap: 2 }}>
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              Court booked
            </Text>
            <Text style={{ color: theme.faint, fontSize: 12 }}>
              Just a flag for now
            </Text>
          </View>
          <Switch value={courtBooked} onValueChange={setCourtBooked} />
        </View>
      </Card>

      <Button
        label="Create tournament"
        disabled={!canCreate}
        onPress={handleCreateTournament}
      />

      <Button label="Cancel" variant="ghost" onPress={() => router.back()} />
    </ScrollView>
  );
}
