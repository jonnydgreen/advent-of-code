const input = await Deno.readTextFile("input.txt");

const delimiter = "\n\n";
const inputSplitByDelimiter = input.trim().split(delimiter);

let currentElf = 1;
let highestTotal = 0;
let highestElf = 1;
for (const rawInventory of inputSplitByDelimiter) {
  const inventory = rawInventory.trim().split("\n");
  const total = inventory.map((i) => Number(i)).reduce(
    (partialSum, number) => partialSum + number,
    0,
  );
  if (total > highestTotal) {
    highestTotal = total
    highestElf = currentElf
  }
  currentElf++
}

console.log("Elf", highestElf, "is carrying", highestTotal, "calories");
