const input = await Deno.readTextFile("input.txt");

const delimiter = "\n\n";
const inputSplitByDelimiter = input.trim().split(delimiter);

const totals = [];
for (const rawInventory of inputSplitByDelimiter) {
  const inventory = rawInventory.trim().split("\n");
  totals.push(
    inventory.map((i) => Number(i)).reduce(
      (partialSum, number) => partialSum + number,
      0,
    ),
  );
}

totals.sort()
totals.reverse()

// Fairly sure this is a bug in Deno
const [_, __, first, second, third] = totals

console.log("Total is", first + second + third);
