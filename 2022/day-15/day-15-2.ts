const input = await Deno.readTextFile("input.txt");

const max = 20;

interface Details {
  sensor: [number, number];
  beacon: [number, number];
}

const details: Details[] = [];
let dX: number | undefined = undefined
let dY: number | undefined = undefined
for (const raw of input.split("\n")) {
  const [sensor, beacon] = raw.replace("Sensor at ", "").replace(
    " closest beacon is at ",
    "",
  ).split(":");
  const [sX, sY] = sensor.split(", ").map((s) => Number(s.split("=")[1]));
  const [bX, bY] = beacon.split(", ").map((b) => Number(b.split("=")[1]));
  details.push({ sensor: [sX, sY], beacon: [bX, bY] });
}

for (const row of [...Array(max + 1).keys()]) {
  const paths: [number, number][] = [];
  for (const detail of details) {
    const coverage = getCoverageAtRow(detail.sensor, detail.beacon, row);
    if (coverage) {
      paths.push(coverage);
    }
  }
  const points: number[] = [];
  for (const [pX, pY] of paths) {
    const arr = [...Array(pY - pX).keys()].map((p) => p + pX);
    for (const p of arr) {
      points.push(p);
    }
  }
  const unique = new Set(points)
  if (unique.size === max - 2) {
    console.log(unique)
    for (const x of [...Array(max + 1).keys()]) {
      if (!unique.has(x)) {
        console.log({ x, row })
        dX = x
        dY = row
        break
      }
    }
    break
  }
}

console.log(dX! * 4000000 + dY!)


function getCoverageAtRow(
  [sX, sY]: [number, number],
  [bX, bY]: [number, number],
  row: number,
): [number, number] | undefined {
  // console.log({ sX, sY, bX, bY });
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

  let rStart = sStart + Math.abs(rDiff);
  let rEnd = sEnd - Math.abs(rDiff);
  if (rEnd < 0) {
    return undefined;
  }
  if (rStart > max) {
    return undefined;
  }
  if (rStart < 0) {
    rStart = 0;
  }
  if (rEnd > max) {
    rEnd = max;
  }
  return [rStart, rEnd];
}
