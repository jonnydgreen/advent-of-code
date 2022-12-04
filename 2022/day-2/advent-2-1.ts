const input = await Deno.readTextFile("input.txt");

const mapper = {
  A: "rock",
  B: "paper",
  C: "scissors",
  X: "rock",
  Y: "paper",
  Z: "scissors",
} as const;

const opponent = {
  rock: {
    rock: 1 + 3,
    paper: 2 + 6,
    scissors: 3 + 0,
  },
  paper: {
    rock: 1 + 0,
    paper: 2 + 3,
    scissors: 3 + 6,
  },
  scissors: {
    rock: 1 + 6,
    paper: 2 + 0,
    scissors: 3 + 3,
  },
};

let totalScore = 0;
for (const round of input.trim().split("\n")) {
  const [opponentRawChoice, yourRawChoice] = round.split(" ");
  const [opponentChoice, yourChoice] = [
    mapper[opponentRawChoice as keyof typeof mapper],
    mapper[yourRawChoice as keyof typeof mapper],
  ];
  const score = opponent[opponentChoice][yourChoice];
  totalScore += score;
}

console.log(totalScore);
