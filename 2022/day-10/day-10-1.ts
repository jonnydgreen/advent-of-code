const input = await Deno.readTextFile("input.txt");

const cycleMap = new Map<number, number>();
let cycle = 1;
let value = 1;
for (const instruction of input.split("\n")) {
  const [type, ...params] = instruction.split(" ");
  switch (type) {
    case "noop": {
      handleNoop();
      break;
    }
    case "addx": {
      handleAddx(Number(params[0]));
      break;
    }
    default: {
      throw new Error(`Unknown type ${type}`);
    }
  }
}

function handleNoop(): void {
  cycleMap.set(cycle, value);
  cycle++;
}

function handleAddx(valueChange: number): void {
  // First tick
  cycleMap.set(cycle, value);
  cycle++;

  // Second tick
  cycleMap.set(cycle, value);
  value += valueChange;
  cycle++;
}

function signalStrength(cycle: number): number {
  return cycleMap.get(cycle)! * cycle;
}

let total = 0;
const cycles: number[] = [20, 60, 100, 140, 180, 220];
for (const cycle of cycles) {
  total += signalStrength(cycle);
}
console.log(total);
