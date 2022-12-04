const input = await Deno.readTextFile("input.txt");

const opponentMapper = {
  A: "rock",
  B: "paper",
  C: "scissors",
} as const;

const yourMapper = {
  X: "lose",
  Y: "draw",
  Z: "win",
} as const;

const opponent = {
  rock: {
    draw: 1 + 3,
    win: 2 + 6,
    lose: 3 + 0,
  },
  paper: {
    lose: 1 + 0,
    draw: 2 + 3,
    win: 3 + 6,
  },
  scissors: {
    win: 1 + 6,
    lose: 2 + 0,
    draw: 3 + 3,
  },
};

let totalScore = 0;
for (const round of input.trim().split("\n")) {
  const [opponentRawChoice, yourRawChoice] = round.split(" ");
  const [opponentChoice, yourChoice] = [
    opponentMapper[opponentRawChoice as keyof typeof opponentMapper],
    yourMapper[yourRawChoice as keyof typeof yourMapper],
  ];
  const score = opponent[opponentChoice][yourChoice];
  totalScore += score;
}

console.log(totalScore);
