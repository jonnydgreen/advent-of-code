const input = await Deno.readTextFile("input.txt");

interface Vector {
  x: number;
  y: number;
}

let hVector: Vector = {
  x: 0,
  y: 0,
};

let tVector: Vector = {
  x: 0,
  y: 0,
};

const positions: string[] = [];
for (const instruction of input.split("\n")) {
  const [direction, distance] = [
    instruction.split(" ")[0],
    Number(instruction.split(" ")[1]),
  ];

  for (const _ of [...Array(distance)]) {
    hVector = moveH(hVector, direction);
    tVector = shouldMoveT(hVector, direction, tVector);
    positions.push(tVector.x.toString() + ',' + tVector.y.toString());
  }
}
console.log(new Set(positions).size);

function moveH(vector: Vector, direction: string): Vector {
  switch (direction) {
    case "R": {
      return {
        ...vector,
        x: vector.x + 1,
      };
    }
    case "L": {
      return {
        ...vector,
        x: vector.x - 1,
      };
    }
    case "U": {
      return {
        ...vector,
        y: vector.y + 1,
      };
    }
    case "D": {
      return {
        ...vector,
        y: vector.y - 1,
      };
    }
    default: {
      throw new Error(`Unknown direction ${direction}`);
    }
  }
}

function shouldMoveT(
  hVector: Vector,
  direction: string,
  tVector: Vector,
): Vector {
  if (isAdjacent(hVector, tVector)) {
    return tVector;
  }

  switch (direction) {
    case "R": {
      return {
        x: tVector.x + 1,
        y: hVector.y,
      };
    }
    case "L": {
      return {
        x: tVector.x - 1,
        y: hVector.y,
      };
    }
    case "U": {
      return {
        x: hVector.x,
        y: tVector.y + 1,
      };
    }
    case "D": {
      return {
        x: hVector.x,
        y: tVector.y - 1,
      };
    }
    default: {
      throw new Error(`Unknown direction ${direction}`);
    }
  }
}

function isAdjacent(hVector: Vector, tVector: Vector): boolean {
  return Math.abs(hVector.x - tVector.x) <= 1 &&
    Math.abs(hVector.y - tVector.y) <= 1;
}
