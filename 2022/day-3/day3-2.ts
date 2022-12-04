const input = await Deno.readTextFile("./input.txt");

function getCharPriority(char: string): number {
  const lowerValue = char.toLowerCase().charCodeAt(0) - 96;
  if (char.toLowerCase() === char) {
    return lowerValue;
  }
  return lowerValue + 26;
}

function getSharedValues(
  first: string[],
  second: string[],
  third: string[],
): string[] {
  return first.filter((value) =>
    second.includes(value) && third.includes(value)
  );
}

let index = 0;
let rucksackGroup: string[] = [];
const rucksackGroups: string[][] = [];
for (const rucksack of input.split("\n")) {
  if (index !== 0 && index % 3 === 0) {
    rucksackGroups.push(rucksackGroup);
    rucksackGroup = [];
  }
  rucksackGroup.push(rucksack);
  index++;
}
rucksackGroups.push(rucksackGroup);

let total = 0;
for (const rucksackGroup of rucksackGroups) {
  const [firstRucksack, secondRucksack, thirdRucksack] = rucksackGroup;
  const [sharedValue] = getSharedValues(
    [...firstRucksack],
    [...secondRucksack],
    [...thirdRucksack],
  );
  total += getCharPriority(sharedValue);
}
console.log(total);
