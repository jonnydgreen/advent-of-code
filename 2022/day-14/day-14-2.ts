const input = await Deno.readTextFile("input.txt");

let down = 0;
let left = 10000;
let right = 0;

const lines = input.split("\n");
for (const line of lines) {
  for (const row of line.split(" -> ")) {
    const [x, y] = row.split(",").map(Number);
    if (x < left) {
      left = x;
    }
    if (x > right) {
      right = x;
    }
    if (y > down) {
      down = y;
    }
  }
}
console.log({ left, right, down });
lines.push(`${100},${down + 2} -> ${900},${down + 2}`);

down += 2;
left = 100;
right = 900;

const map: string[][] = [];
for (const _ of [...Array(down + 2)]) {
  const row: string[] = [];
  for (const __ of [...Array(right - left + 2)]) {
    row.push(" ");
  }
  map.push(row);
}

for (const line of lines) {
  let previous: [number, number] | undefined = undefined;
  for (const item of line.split(" -> ")) {
    const [x, y] = item.split(",").map(Number);
    if (previous) {
      let currentX = previous[0] - left;
      let currentY = previous[1];
      if (previous[0] === x) {
        // Y changes
        for (const _ of [...Array(Math.abs(y - previous[1]) + 1)]) {
          map[currentY][currentX] = "#";
          if (previous[1] < y) {
            currentY++;
          } else {
            currentY--;
          }
        }
      } else {
        // X changes
        for (const _ of [...Array(Math.abs(x - previous[0]) + 1)]) {
          map[currentY][currentX] = "#";
          if (previous[0] < x) {
            currentX++;
          } else {
            currentX--;
          }
        }
      }
    }
    previous = [x, y];
  }
}

function renderMap(): void {
  console.log("+++++++++++++");
  for (const row of map) {
    console.log("+" + row.join("") + "+");
  }
  console.log("+++++++++++++");
}

type Move = "down" | "down-left" | "down-right" | "stop";
function getNextMove(currentX: number, currentY: number): Move {
  if (map[currentY + 1]?.[currentX] === " ") {
    return "down";
  }
  if (map[currentY + 1]?.[currentX - 1] === " ") {
    return "down-left";
  }
  if (map[currentY + 1]?.[currentX + 1] === " ") {
    return "down-right";
  }
  return "stop";
}

let numberOfParticles = 0;
let stopExecution = false;
while (stopExecution === false) {
  let sandIsStopped = false;
  let currentX = 500 - left;
  let currentY = 0;
  numberOfParticles++;
  while (sandIsStopped === false) {
    const nextMove = getNextMove(currentX, currentY);
    switch (nextMove) {
      case "down": {
        currentY++;
        break;
      }
      case "down-left": {
        currentX--;
        currentY++;
        break;
      }
      case "down-right": {
        currentX++;
        currentY++;
        break;
      }
      default: {
        sandIsStopped = true;
        map[currentY][currentX] = "o";
        // Check if blocked
        if (currentY === 0) {
          stopExecution = true;
        }
        break;
      }
    }
  }
}
console.log(numberOfParticles);
