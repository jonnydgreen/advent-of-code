const input = await Deno.readTextFile("input.txt");

const [stackSetup, instructions] = input.split("\n\n");

const stackSetupParts = stackSetup.split("\n");
const numberOfStacks =
  stackSetupParts.pop()!.replace(/ +/g, " ").trim().split(" ").length;

const stacks: string[][] = [];

for (const stackSetupPart of stackSetupParts.reverse()) {
  for (const index of [...Array(numberOfStacks).keys()]) {
    if (!stacks[index]) {
      stacks.push([] as string[]);
    }
    const crate = stackSetupPart.slice(index * 4, index * 4 + 4).trim().replace(
      "]",
      "",
    ).replace(
      "[",
      "",
    );
    if (crate) {
      stacks[index].push(crate);
    }
  }
}

for (const instruction of instructions.split("\n")) {
  const [, numberOfCratesToMove, srcStackID, destStackID] = /move (\d+) from (\d) to (\d)/.exec(instruction) as RegExpExecArray;
  const srcStackIdx = Number(srcStackID) - 1
  const destStackIdx = Number(destStackID) - 1
  for (const _ of [...Array(Number(numberOfCratesToMove)).keys()]) {
    const crate = stacks[srcStackIdx].pop()
    if (crate) {
      stacks[destStackIdx].push(crate)
    }
  }
}

let result = ''
for (const stack of stacks) {
  const topCrate = stack.pop()
  if (topCrate) {
    result += topCrate
  }
}

console.log(result)
