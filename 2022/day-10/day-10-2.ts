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

let render = "";
let currentCycle = 1;
for (const _ of [...Array(6)]) {
  let rowRender = "";
  for (const xPosition of [...Array(40).keys()]) {
    const xRegisterDuringCycle = cycleMap.get(currentCycle)!;
    if (shouldLightPixel(xPosition, xRegisterDuringCycle)) {
      rowRender += "#";
    } else {
      rowRender += ".";
    }
    currentCycle++
  }
  render += rowRender;
  render += "\n";
}

function shouldLightPixel(
  xPosition: number,
  xRegisterDuringCycle: number,
): boolean {
  return (xRegisterDuringCycle === xPosition) ||
    (xRegisterDuringCycle === xPosition - 1) ||
    (xRegisterDuringCycle === xPosition + 1);
}

console.log(render);
