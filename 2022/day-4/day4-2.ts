const input = await Deno.readTextFile("./input.txt");

function doesPartiallyContain(
  [lower1, upper1]: readonly [number, number],
  [lower2, upper2]: readonly [number, number],
): boolean {
  if (lower1 >= lower2 && lower1 <= upper2) {
    return true
  }

  if (upper1 >= lower2 && upper1 <= upper2) {
    return true
  }

  return false
}

let total = 0;
for (const assignments of input.split("\n")) {
  const [rawAssignments1, rawAssignments2] = assignments.split(",");
  const assignments1 = [
    Number(rawAssignments1.split("-")[0]),
    Number(rawAssignments1.split("-")[1]),
  ] as const;
  const assignments2 = [
    Number(rawAssignments2.split("-")[0]),
    Number(rawAssignments2.split("-")[1]),
  ] as const;

  if (
    doesPartiallyContain(assignments1, assignments2) ||
    doesPartiallyContain(assignments2, assignments1)
  ) {
    total++;
  }
}
console.log(total);
