const input = await Deno.readTextFile("./input.txt");

function getCharPriority(char: string): number {
  const lowerValue = char.toLowerCase().charCodeAt(0) - 96;
  if (char.toLowerCase() === char) {
    return lowerValue;
  }
  return lowerValue + 26;
}

function getSharedValues(first: string[], second: string[]): string[] {
  return first.filter((value) => second.includes(value));
}

let total = 0;
for (const rucksacks of input.split("\n")) {
  const rucksackLength = rucksacks.length / 2;
  const [firstRucksack, secondRucksack] = [
    rucksacks.slice(0, rucksackLength),
    rucksacks.slice(rucksackLength),
  ];
  const [sharedValue] = getSharedValues([...firstRucksack], [
    ...secondRucksack,
  ]);
  total += getCharPriority(sharedValue);
}
console.log(total);
