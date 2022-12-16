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

function chunkInput(inputs: unknown[]): [unknown, unknown][] {
  const chunked: [unknown, unknown][] = []
  let index = 0;
  for (const input of inputs) {
    if (index % 2 === 0) {
      chunked.push([input, inputs[index + 1]])
    }
    index++
  }
  return chunked
}

const chunked = chunkInput(inputs);
let total = 0;
let index = 0;
for (const pair of chunked) {
  total += compare(pair[0], pair[1]) < 0 ? index + 1 : 0;
  index++;
}
console.log(total);