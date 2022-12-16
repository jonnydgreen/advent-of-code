const input = await Deno.readTextFile("input.txt");

const details: [number, number, number, number][] = [];
for (const raw of input.split("\n")) {
  if (!raw) {
    continue;
  }
  const [sensor, beacon] = raw.replace("Sensor at ", "").replace(
    " closest beacon is at ",
    "",
  ).split(":");
  const [sX, sY] = sensor.split(", ").map((s) => Number(s.split("=")[1]));
  const [bX, bY] = beacon.split(", ").map((b) => Number(b.split("=")[1]));
  details.push([sX, sY, bX, bY]);
}

function rangesNotContainingBeacon(max: number): [number, number][] {
  const ranges: [number, number][] = [];
  for (const [sX, sY, bX, bY] of details) {
    const distance = Math.abs(bX - sX) + Math.abs(bY - sY);
    if (Math.abs(max - sY) < distance) {
      const diff = distance - Math.abs(max - sY);
      ranges.push([sX - diff, sX + diff]);
    }
  }
  // Sort the ranges to make sorting out the overlaps easier
  ranges.sort((a, b) => a[0] - b[0]);

  // Sort out the overlaps
  let index = 0;
  while (index < ranges.length - 1) {
    if (ranges[index][1] + 1 >= ranges[index + 1][0]) {
      ranges[index][1] = Math.max(ranges[index + 1][1], ranges[index][1])
      ranges.splice(index + 1, 1);
      continue
    }
    index++;
  }
  return ranges;
}

const max = 4000000
for (const currentMax of [...Array(max).keys()]) {
  const ranges = rangesNotContainingBeacon(currentMax);
  let foundFullyOverlappingRange = false
  for (const range of ranges) {
    // Check for invalid ranges
    if (range[0] <= 0 && range[1] >= max) {
      foundFullyOverlappingRange = true;
      break
    }
  }
  if (!foundFullyOverlappingRange) {
    for (const range of ranges) {
      // Check for invalid ranges
      if (range[0] <= 0 && range[1] >= 0) {
        console.log((range[1] + 1) * max + currentMax)
      }
    }
  }
}
