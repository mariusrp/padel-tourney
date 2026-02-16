import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export type Format =
  | "MEXICANO"
  | "AMERICANO"
  | "FIXED_AMERICANO"
  | "FIXED_MEXICANO";

export type ScoringMode = "WINS" | "POINTS";

export type Player = {
  id: string;
  name: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
};

export type Match = {
  id: string;
  court: number;
  team1: [string, string]; // player names
  team2: [string, string];
  team1Score: number;
  team2Score: number;
};

export type Round = {
  roundNumber: number;
  matches: Match[];
};

export type TournamentConfig = {
  roundsBeforeRanking: number;
  allowDraws: boolean;
  courtRotation: boolean;
  autoAdvanceRounds: boolean;
  scoringMode: ScoringMode;
};

export type Tournament = {
  id: string;
  name: string;
  format: Format;
  pointsToPlay: number;
  description?: string;
  club?: string;
  startAt?: string;
  ranked: boolean;
  courtBooked: boolean;
  entranceFee?: number;
  status: "DRAFT" | "ACTIVE" | "FINISHED";
  players: Player[];
  autoCourts: boolean;
  courts: number;
  createdAt: number;
  updatedAt: number;
  currentRound: number;
  rounds?: Round[];
  config?: TournamentConfig;
};

type State = {
  tournaments: Tournament[];
  activeTournamentId?: string;
  hydrate: () => Promise<void>;
  clearAll: () => void;
  createTournament: (
    t: Omit<
      Tournament,
      "id" | "status" | "players" | "createdAt" | "updatedAt"
    >,
  ) => string;
  updateTournament: (id: string, patch: Partial<Tournament>) => void;
  setActiveTournament: (id?: string) => void;
  addPlayer: (tId: string, name: string) => void;
  removePlayer: (tId: string, playerId: string) => void;
  startTournament: (tId: string) => void;
  updateMatchScore: (
    tId: string,
    roundNumber: number,
    matchId: string,
    team1Score: number,
    team2Score: number,
  ) => void;
  nextRound: (tId: string) => void;
  finishTournament: (tId: string) => void;
  shuffleMatches: (tId: string) => void;
};

const KEY = "padel_tourney_v3";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function computeCourts(playersCount: number) {
  return Math.max(1, Math.floor(playersCount / 4));
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateMatches(
  players: Player[],
  courts: number,
  roundNumber: number,
  roundsBeforeRanking: number,
  scoringMode: ScoringMode = "WINS",
): Match[] {
  const shuffledPlayers = shuffle([...players]);
  const matches: Match[] = [];

  // After initial random rounds, use ranking-based matchmaking
  if (roundNumber > roundsBeforeRanking) {
    const sorted = [...players].sort((a, b) => {
      if (scoringMode === "WINS") {
        // Sort by wins first, then by points
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.points !== a.points) return b.points - a.points;
        return b.pointsFor - b.pointsAgainst - (a.pointsFor - a.pointsAgainst);
      }
      // POINTS mode
      return b.points - a.points;
    });

    // Mexicano style: 1st with 4th, 2nd with 3rd, etc.
    const pairs: string[][] = [];
    for (let i = 0; i < sorted.length; i += 4) {
      if (i + 3 < sorted.length) {
        // Team 1: 1st and 4th
        // Team 2: 2nd and 3rd
        pairs.push([sorted[i].name, sorted[i + 3].name]);
        pairs.push([sorted[i + 1].name, sorted[i + 2].name]);
      }
    }

    let courtNum = 1;
    for (let i = 0; i < pairs.length; i += 2) {
      if (i + 1 < pairs.length) {
        matches.push({
          id: uid(),
          court: courtNum++,
          team1: [pairs[i][0], pairs[i][1]],
          team2: [pairs[i + 1][0], pairs[i + 1][1]],
          team1Score: 0,
          team2Score: 0,
        });
      }
    }
  } else {
    // Random matchmaking for initial rounds
    let courtNum = 1;
    for (let i = 0; i < shuffledPlayers.length; i += 4) {
      if (i + 3 < shuffledPlayers.length) {
        matches.push({
          id: uid(),
          court: courtNum++,
          team1: [shuffledPlayers[i].name, shuffledPlayers[i + 1].name],
          team2: [shuffledPlayers[i + 2].name, shuffledPlayers[i + 3].name],
          team1Score: 0,
          team2Score: 0,
        });
      }
    }
  }

  return matches;
}

async function persist(get: () => State) {
  const s = get();
  await AsyncStorage.setItem(
    KEY,
    JSON.stringify({
      tournaments: s.tournaments,
      activeTournamentId: s.activeTournamentId,
    }),
  );
}

export const useTournamentStore = create<State>((set, get) => ({
  tournaments: [],
  activeTournamentId: undefined,

  hydrate: async () => {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      set({
        tournaments: data.tournaments ?? [],
        activeTournamentId: data.activeTournamentId,
      });
    } catch {}
  },

  clearAll: () => {
    set({ tournaments: [], activeTournamentId: undefined });
    AsyncStorage.removeItem(KEY).catch(() => {});
  },

  createTournament: (t) => {
    const id = uid();
    const now = Date.now();
    const tournament: Tournament = {
      id,
      status: "DRAFT",
      players: [],
      createdAt: now,
      updatedAt: now,
      ...t,
    };
    set((s) => ({
      tournaments: [tournament, ...s.tournaments],
      activeTournamentId: id,
    }));
    persist(get);
    return id;
  },

  updateTournament: (id, patch) => {
    set((s) => ({
      tournaments: s.tournaments.map((t) =>
        t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t,
      ),
    }));
    persist(get);
  },

  setActiveTournament: (id) => {
    set({ activeTournamentId: id });
    persist(get);
  },

  addPlayer: (tId, name) => {
    const clean = name.trim();
    if (!clean) return;
    set((s) => ({
      tournaments: s.tournaments.map((t) => {
        if (t.id !== tId) return t;
        const players = [
          ...t.players,
          {
            id: uid(),
            name: clean,
            points: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            pointsFor: 0,
            pointsAgainst: 0,
          },
        ];
        const courts = t.autoCourts ? computeCourts(players.length) : t.courts;
        return {
          ...t,
          players,
          courts,
          updatedAt: Date.now(),
        };
      }),
    }));
    persist(get);
  },

  removePlayer: (tId, playerId) => {
    set((s) => ({
      tournaments: s.tournaments.map((t) => {
        if (t.id !== tId) return t;
        const players = t.players.filter((p) => p.id !== playerId);
        const courts = t.autoCourts ? computeCourts(players.length) : t.courts;
        return {
          ...t,
          players,
          courts,
          updatedAt: Date.now(),
        };
      }),
    }));
    persist(get);
  },

  startTournament: (tId) => {
    console.log("Starting tournament:", tId);

    set((s) => ({
      tournaments: s.tournaments.map((t) => {
        if (t.id !== tId) return t;

        const config = t.config ?? {
          roundsBeforeRanking: 2,
          allowDraws: false,
          courtRotation: true,
          autoAdvanceRounds: true,
          scoringMode: "WINS" as const,
        };

        const matches = generateMatches(
          t.players,
          t.courts,
          1,
          config.roundsBeforeRanking,
          config.scoringMode,
        );

        return {
          ...t,
          status: "ACTIVE" as const,
          currentRound: 1,
          rounds: [
            {
              roundNumber: 1,
              matches,
            },
          ],
          config,
          updatedAt: Date.now(),
        };
      }),
      activeTournamentId: tId,
    }));

    persist(get);
    router.push("/match");
  },

  updateMatchScore: (tId, roundNumber, matchId, team1Score, team2Score) => {
    set((s) => ({
      tournaments: s.tournaments.map((t) => {
        if (t.id !== tId || !t.rounds) return t;

        const updatedRounds = t.rounds.map((round) => {
          if (round.roundNumber !== roundNumber) return round;

          return {
            ...round,
            matches: round.matches.map((match) =>
              match.id === matchId
                ? { ...match, team1Score, team2Score }
                : match,
            ),
          };
        });

        const scoringMode = t.config?.scoringMode ?? "WINS";

        // Update player stats
        const updatedPlayers = t.players.map((player) => {
          let totalPoints = 0;
          let wins = 0;
          let draws = 0;
          let losses = 0;
          let pointsFor = 0;
          let pointsAgainst = 0;

          updatedRounds.forEach((round) => {
            round.matches.forEach((match) => {
              const isComplete =
                match.team1Score + match.team2Score === t.pointsToPlay;
              if (!isComplete) return;

              const isInTeam1 = match.team1.includes(player.name);
              const isInTeam2 = match.team2.includes(player.name);

              if (!isInTeam1 && !isInTeam2) return;

              if (scoringMode === "WINS") {
                // Win/Draw/Loss system
                if (match.team1Score > match.team2Score) {
                  if (isInTeam1) {
                    wins++;
                    totalPoints += 1; // 1 point for win
                  } else {
                    losses++;
                  }
                } else if (match.team2Score > match.team1Score) {
                  if (isInTeam2) {
                    wins++;
                    totalPoints += 1;
                  } else {
                    losses++;
                  }
                } else {
                  // Draw
                  draws++;
                  totalPoints += 0.5; // 0.5 points for draw
                }

                // Track goals for/against
                if (isInTeam1) {
                  pointsFor += match.team1Score;
                  pointsAgainst += match.team2Score;
                } else {
                  pointsFor += match.team2Score;
                  pointsAgainst += match.team1Score;
                }
              } else {
                // POINTS mode - just accumulate match points
                if (isInTeam1) {
                  totalPoints += match.team1Score;
                  pointsFor += match.team1Score;
                  pointsAgainst += match.team2Score;
                } else {
                  totalPoints += match.team2Score;
                  pointsFor += match.team2Score;
                  pointsAgainst += match.team1Score;
                }
              }
            });
          });

          return {
            ...player,
            points: totalPoints,
            wins,
            draws,
            losses,
            pointsFor,
            pointsAgainst,
          };
        });

        return {
          ...t,
          rounds: updatedRounds,
          players: updatedPlayers,
          updatedAt: Date.now(),
        };
      }),
    }));
    persist(get);
  },

  nextRound: (tId) => {
    set((s) => ({
      tournaments: s.tournaments.map((t) => {
        if (t.id !== tId || !t.rounds) return t;

        const nextRoundNumber = t.currentRound + 1;
        const config = t.config ?? {
          roundsBeforeRanking: 2,
          allowDraws: false,
          courtRotation: true,
          autoAdvanceRounds: true,
          scoringMode: "WINS" as const,
        };

        const matches = generateMatches(
          t.players,
          t.courts,
          nextRoundNumber,
          config.roundsBeforeRanking,
          config.scoringMode,
        );

        return {
          ...t,
          currentRound: nextRoundNumber,
          rounds: [
            ...t.rounds,
            {
              roundNumber: nextRoundNumber,
              matches,
            },
          ],
          updatedAt: Date.now(),
        };
      }),
    }));
    persist(get);
  },

  finishTournament: (tId) => {
    set((s) => ({
      tournaments: s.tournaments.map((t) =>
        t.id === tId
          ? { ...t, status: "FINISHED" as const, updatedAt: Date.now() }
          : t,
      ),
      activeTournamentId: undefined,
    }));
    persist(get);
  },

  shuffleMatches: (tId) => {
    set((s) => ({
      tournaments: s.tournaments.map((t) => {
        if (t.id !== tId || !t.rounds) return t;

        const config = t.config ?? {
          roundsBeforeRanking: 2,
          allowDraws: false,
          courtRotation: true,
          autoAdvanceRounds: true,
          scoringMode: "WINS" as const,
        };

        const newMatches = generateMatches(
          t.players,
          t.courts,
          t.currentRound,
          config.roundsBeforeRanking,
          config.scoringMode,
        );

        const updatedRounds = t.rounds.map((round) =>
          round.roundNumber === t.currentRound
            ? { ...round, matches: newMatches }
            : round,
        );

        return {
          ...t,
          rounds: updatedRounds,
          updatedAt: Date.now(),
        };
      }),
    }));
    persist(get);
  },
}));
