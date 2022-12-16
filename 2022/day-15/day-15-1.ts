const input = await Deno.readTextFile("input.txt");

const row = 2000000;
const paths: [number, number][] = []
for (const raw of input.split("\n")) {
  const [sensor, beacon] = raw.replace("Sensor at ", "").replace(
    " closest beacon is at ",
    "",
  ).split(":");
  const [sX, sY] = sensor.split(", ").map((s) => Number(s.split("=")[1]));
  const [bX, bY] = beacon.split(", ").map((b) => Number(b.split("=")[1]));
  const coverage = getCoverageAtRow([sX, sY], [bX, bY], row);
  if (coverage) {
    paths.push(coverage)
  }
}

const points: number[] = []
for (const [pX, pY] of paths) {
  const arr = [...Array(pY - pX).keys()].map(p => p + pX)
  for (const p of arr) {
    points.push(p)
  }
}
console.log(new Set(points).size)

function getCoverageAtRow(
  [sX, sY]: [number, number],
  [bX, bY]: [number, number],
  row: number,
): [number, number] | undefined {
  console.log({ sX, sY, bX, bY })
  // S: 8, 7
  // B: 2, 10
  // R12: 4, 12

  const yDiff = Math.abs(sY - bY);
  const xDiff = Math.abs(sX - bX);
  const sStart = sX - (xDiff + yDiff);
  const sEnd = sX + (xDiff + yDiff);

  const rDiff = sY - row;

  // Not within the diamond
  if (Math.abs(rDiff) > xDiff + yDiff) {
    return undefined;
  }

  const rStart = sStart + Math.abs(rDiff);
  const rEnd = sEnd - Math.abs(rDiff);
  return [rStart, rEnd];
}


