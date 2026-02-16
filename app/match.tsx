import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { router } from "expo-router";
import { theme } from "../src/theme";
import { Card } from "../src/ui/Card";
import { Button } from "../src/ui/Button";
import { useTournamentStore } from "../src/store/useTournamentStore";
import { Match, Player } from "../src/store/useTournamentStore";

function ScoreModal({
  visible,
  match,
  onClose,
  onSave,
  maxPoints,
}: {
  visible: boolean;
  match: Match;
  onClose: () => void;
  onSave: (team1Score: number, team2Score: number) => void;
  maxPoints: number;
}) {
  const [team1Score, setTeam1Score] = useState(match.team1Score);
  const [team2Score, setTeam2Score] = useState(match.team2Score);

  const handleTeam1Change = (score: number) => {
    setTeam1Score(score);
    setTeam2Score(maxPoints - score);
  };

  const handleTeam2Change = (score: number) => {
    setTeam2Score(score);
    setTeam1Score(maxPoints - score);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.85)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: theme.panel,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            gap: 16,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={{ gap: 8 }}>
            <Text style={{ color: theme.sub, fontWeight: "800" }}>
              COURT {match.court}
            </Text>
            <Text
              style={{ color: theme.text, fontSize: 20, fontWeight: "900" }}
            >
              Enter Score
            </Text>
          </View>

          {/* Team 1 */}
          <View style={{ gap: 10 }}>
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              {match.team1[0]} & {match.team1[1]}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {Array.from({ length: maxPoints + 1 }, (_, i) => i).map(
                (score) => (
                  <Pressable
                    key={score}
                    onPress={() => handleTeam1Change(score)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor:
                        team1Score === score ? theme.accent : theme.card2,
                      borderWidth: 1,
                      borderColor:
                        team1Score === score ? theme.accent : theme.stroke,
                    }}
                  >
                    <Text
                      style={{
                        color: team1Score === score ? "#fff" : theme.text,
                        fontWeight: "800",
                        fontSize: 16,
                      }}
                    >
                      {score}
                    </Text>
                  </Pressable>
                ),
              )}
            </ScrollView>
          </View>

          {/* Team 2 */}
          <View style={{ gap: 10 }}>
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              {match.team2[0]} & {match.team2[1]}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {Array.from({ length: maxPoints + 1 }, (_, i) => i).map(
                (score) => (
                  <Pressable
                    key={score}
                    onPress={() => handleTeam2Change(score)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor:
                        team2Score === score ? theme.accent : theme.card2,
                      borderWidth: 1,
                      borderColor:
                        team2Score === score ? theme.accent : theme.stroke,
                    }}
                  >
                    <Text
                      style={{
                        color: team2Score === score ? "#fff" : theme.text,
                        fontWeight: "800",
                        fontSize: 16,
                      }}
                    >
                      {score}
                    </Text>
                  </Pressable>
                ),
              )}
            </ScrollView>
          </View>

          <View style={{ gap: 10, paddingTop: 8 }}>
            <Button
              label="Save Score"
              onPress={() => {
                onSave(team1Score, team2Score);
                onClose();
              }}
            />
            <Button label="Cancel" variant="ghost" onPress={onClose} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function LeaderboardModal({
  visible,
  onClose,
  players,
  scoringMode = "WINS",
}: {
  visible: boolean;
  onClose: () => void;
  players: Array<Player>;
  scoringMode?: "WINS" | "POINTS";
}) {
  const [viewMode, setViewMode] = useState<"WINS" | "POINTS">(scoringMode);

  const sortedByWins = [...players].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.points !== a.points) return b.points - a.points;
    return b.pointsFor - b.pointsAgainst - (a.pointsFor - a.pointsAgainst);
  });

  const sortedByPoints = [...players].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.pointsFor - a.pointsFor;
  });

  const sorted = viewMode === "WINS" ? sortedByWins : sortedByPoints;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.85)",
          justifyContent: "flex-end",
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <View
          style={{
            backgroundColor: theme.panel,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "85%",
          }}
        >
          {/* Header */}
          <View style={{ padding: 20, paddingBottom: 12 }}>
            <Text style={{ color: theme.sub, fontWeight: "800" }}>
              STANDINGS
            </Text>
            <Text
              style={{
                color: theme.text,
                fontSize: 20,
                fontWeight: "900",
                marginTop: 4,
              }}
            >
              Leaderboard
            </Text>

            {/* Toggle between WINS and POINTS */}
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                marginTop: 12,
              }}
            >
              <Pressable
                onPress={() => setViewMode("WINS")}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor:
                    viewMode === "WINS" ? theme.accent : theme.card2,
                  borderWidth: 1,
                  borderColor:
                    viewMode === "WINS" ? theme.accent : theme.stroke,
                }}
              >
                <Text
                  style={{
                    color: viewMode === "WINS" ? "#fff" : theme.text,
                    fontWeight: "800",
                    textAlign: "center",
                  }}
                >
                  By Wins
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setViewMode("POINTS")}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor:
                    viewMode === "POINTS" ? theme.accent : theme.card2,
                  borderWidth: 1,
                  borderColor:
                    viewMode === "POINTS" ? theme.accent : theme.stroke,
                }}
              >
                <Text
                  style={{
                    color: viewMode === "POINTS" ? "#fff" : theme.text,
                    fontWeight: "800",
                    textAlign: "center",
                  }}
                >
                  By Points
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Scrollable List */}
          <ScrollView
            style={{ flexGrow: 0 }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 12,
            }}
          >
            {sorted.map((player, index) => (
              <View
                key={player.id}
                style={{
                  padding: 16,
                  backgroundColor: theme.card2,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.stroke,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor:
                          index === 0
                            ? "#FFD700"
                            : index === 1
                              ? "#C0C0C0"
                              : index === 2
                                ? "#CD7F32"
                                : theme.stroke2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: index < 3 ? "#000" : theme.text,
                          fontWeight: "900",
                          fontSize: 14,
                        }}
                      >
                        {index + 1}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: theme.text,
                          fontWeight: "800",
                          fontSize: 16,
                        }}
                      >
                        {player.name}
                      </Text>
                      {viewMode === "WINS" && scoringMode === "WINS" && (
                        <Text
                          style={{
                            color: theme.faint,
                            fontSize: 12,
                            marginTop: 2,
                          }}
                        >
                          {player.wins}W {player.draws}D {player.losses}L •{" "}
                          {player.pointsFor}-{player.pointsAgainst}
                        </Text>
                      )}
                      {viewMode === "POINTS" && (
                        <Text
                          style={{
                            color: theme.faint,
                            fontSize: 12,
                            marginTop: 2,
                          }}
                        >
                          {player.pointsFor} for • {player.pointsAgainst}{" "}
                          against
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text
                    style={{
                      color: theme.accent,
                      fontWeight: "900",
                      fontSize: 18,
                    }}
                  >
                    {viewMode === "WINS" && scoringMode === "WINS"
                      ? player.points.toFixed(1)
                      : player.points}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Footer Button */}
          <View style={{ padding: 20, paddingTop: 8 }}>
            <Button label="Close" variant="ghost" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function MatchScreen() {
  const {
    tournaments,
    activeTournamentId,
    updateMatchScore,
    nextRound,
    finishTournament,
    shuffleMatches,
  } = useTournamentStore();

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const tournament = useMemo(
    () => tournaments.find((t) => t.id === activeTournamentId),
    [tournaments, activeTournamentId],
  );

  if (!tournament) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, padding: 16 }}>
        <Text style={{ color: theme.text, fontWeight: "800" }}>
          No active tournament
        </Text>
      </View>
    );
  }

  const currentRound = tournament.rounds?.[tournament.currentRound - 1];
  const allMatchesComplete = currentRound?.matches.every(
    (m) => m.team1Score + m.team2Score === tournament.pointsToPlay,
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={{ gap: 6 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: theme.text, fontSize: 24, fontWeight: "900" }}
            >
              Round {tournament.currentRound}
            </Text>
            <Pressable onPress={() => setShowLeaderboard(true)}>
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: theme.card2,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: theme.stroke2,
                }}
              >
                <Text style={{ color: theme.accent, fontWeight: "800" }}>
                  Leaderboard
                </Text>
              </View>
            </Pressable>
          </View>
          <Text style={{ color: theme.sub }}>
            {tournament.name} • {tournament.format}
          </Text>
        </View>

        {/* Shuffle Button */}
        {!allMatchesComplete && (
          <Button
            label="🔀 Shuffle Matches"
            variant="secondary"
            onPress={() => shuffleMatches(tournament.id)}
          />
        )}

        {/* Matches */}
        <View style={{ gap: 10 }}>
          {currentRound?.matches.map((match) => {
            const isComplete =
              match.team1Score + match.team2Score === tournament.pointsToPlay;

            return (
              <Pressable key={match.id} onPress={() => setSelectedMatch(match)}>
                <Card
                  style={{
                    gap: 12,
                    opacity: isComplete ? 0.7 : 1,
                    borderWidth: 2,
                    borderColor: isComplete ? theme.good : theme.stroke,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: theme.sub, fontWeight: "800" }}>
                      COURT {match.court}
                    </Text>
                    {isComplete && (
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          backgroundColor: "rgba(34,197,94,0.15)",
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.good,
                            fontWeight: "800",
                            fontSize: 11,
                          }}
                        >
                          COMPLETE
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Team 1 */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: theme.text,
                          fontWeight: "800",
                          fontSize: 15,
                        }}
                      >
                        {match.team1[0]}
                      </Text>
                      <Text
                        style={{
                          color: theme.text,
                          fontWeight: "800",
                          fontSize: 15,
                        }}
                      >
                        {match.team1[1]}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        backgroundColor:
                          match.team1Score > match.team2Score && isComplete
                            ? "rgba(59,130,246,0.2)"
                            : theme.card2,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: theme.stroke2,
                        minWidth: 60,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: theme.text,
                          fontWeight: "900",
                          fontSize: 22,
                        }}
                      >
                        {match.team1Score}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      height: 1,
                      backgroundColor: theme.stroke,
                    }}
                  />

                  {/* Team 2 */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: theme.text,
                          fontWeight: "800",
                          fontSize: 15,
                        }}
                      >
                        {match.team2[0]}
                      </Text>
                      <Text
                        style={{
                          color: theme.text,
                          fontWeight: "800",
                          fontSize: 15,
                        }}
                      >
                        {match.team2[1]}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        backgroundColor:
                          match.team2Score > match.team1Score && isComplete
                            ? "rgba(59,130,246,0.2)"
                            : theme.card2,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: theme.stroke2,
                        minWidth: 60,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: theme.text,
                          fontWeight: "900",
                          fontSize: 22,
                        }}
                      >
                        {match.team2Score}
                      </Text>
                    </View>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>

        {/* Actions */}
        {allMatchesComplete && (
          <View style={{ gap: 10, marginTop: 8 }}>
            <Button
              label={`Start Round ${tournament.currentRound + 1}`}
              onPress={() => nextRound(tournament.id)}
            />
            <Button
              label="Finish Tournament"
              variant="secondary"
              onPress={() => {
                finishTournament(tournament.id);
                router.push("/");
              }}
            />
          </View>
        )}
      </ScrollView>

      {/* Score Modal */}
      {selectedMatch && (
        <ScoreModal
          visible={!!selectedMatch}
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSave={(team1Score, team2Score) => {
            updateMatchScore(
              tournament.id,
              tournament.currentRound,
              selectedMatch.id,
              team1Score,
              team2Score,
            );
          }}
          maxPoints={tournament.pointsToPlay}
        />
      )}

      {/* Leaderboard Modal */}
      <LeaderboardModal
        visible={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        players={tournament.players}
        scoringMode={tournament.config?.scoringMode}
      />
    </View>
  );
}
