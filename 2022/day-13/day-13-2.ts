const rawInput = await Deno.readTextFile("input.txt");

function buildInput(input: string) {
  return input.replace(/\n\n/g, "\n").split("\n").map((line) =>
    JSON.parse(line)
  );
}

const inputs = buildInput(rawInput);

const convertToArray = (item: unknown): unknown[] =>
  Array.isArray(item) ? item : [item];

function compare(a: unknown, b: unknown): number {
  if (a == null) return -1;
  else if (b == null) return 1;
  else if (typeof a === "number" && typeof b === "number") return a - b;

  const aArray = convertToArray(a);
  const bArray = convertToArray(b);
  // loop over the indexes of the longer array and reduce to either zero or the first nonzero comparison of a and b's elements
  const range = [...Array(Math.max(aArray.length, bArray.length)).keys()]
  return range.reduce(
    (ret: number, _: unknown, i: number) =>
      ret !== 0 ? ret : compare(aArray[i], bArray[i]),
    0,
  );
}

const decoders: number[][][] = [[[2]], [[6]]];
const packets: unknown[] = inputs.concat(decoders).sort(compare);
console.log(
  (packets.indexOf(decoders[0]) + 1) *
    (packets.indexOf(decoders[1]) + 1),
);
