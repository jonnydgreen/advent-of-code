const input = await Deno.readTextFile("input.txt");

interface Vector {
  x: number;
  y: number;
}

const start: Vector = {
  x: 0,
  y: 0,
};

let hVector: Vector = {
  ...start,
};

let tVector: Vector = {
  ...start,
};

const mVectors: Vector[] = [
  { ...start },
  { ...start },
  { ...start },
  { ...start },
  { ...start },
  { ...start },
  { ...start },
  { ...start },
];

let matrix: string[][] = [];

function resetMatrix(): void {
  matrix = [];
  for (const _ of Array(26)) {
    matrix.push([...Array(26)].map(() => "."));
  }
}

const positions: string[] = [];
for (const instruction of input.split("\n")) {
  const [direction, distance] = [
    instruction.split(" ")[0],
    Number(instruction.split(" ")[1]),
  ];

  for (const _ of [...Array(distance)]) {
    resetMatrix();
    hVector = moveH(hVector, direction);
    let index = 0;
    let prevVector = hVector;
    for (const _ of mVectors) {
      if (index > 0) {
        prevVector = mVectors[index - 1];
      }
      mVectors[index] = shouldMoveVector(
        prevVector,
        mVectors[index],
      );
      index++;
    }
    tVector = shouldMoveVector(
      mVectors[mVectors.length - 1],
      tVector,
    );
    positions.push(tVector.x.toString() + "," + tVector.y.toString());
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

function shouldMoveVector(
  hVector: Vector,
  tVector: Vector,
): Vector {
  if (isAdjacent(hVector, tVector)) {
    return tVector;
  }

  // Tx . Hx
  if (hVector.x - tVector.x === 2) {
    if (hVector.y - tVector.y === 2) {
      return {
        x: tVector.x + 1,
        y: tVector.y + 1,
      }
    }
    if (hVector.y - tVector.y === -2) {
      return {
        x: tVector.x + 1,
        y: tVector.y - 1,
      }
    }
    return {
      x: tVector.x + 1,
      y: hVector.y,
    };
  }

  // Hx . Tx
  if (hVector.x - tVector.x === -2) {
    if (hVector.y - tVector.y === 2) {
      return {
        x: tVector.x - 1,
        y: tVector.y + 1,
      }
    }
    if (hVector.y - tVector.y === -2) {
      return {
        x: tVector.x - 1,
        y: tVector.y - 1,
      }
    }
    return {
      x: tVector.x - 1,
      y: hVector.y,
    };
  }

  // Hy
  // .
  // Ty
  if (hVector.y - tVector.y === 2) {
    if (hVector.x - tVector.x === 2) {
      return {
        x: hVector.x + 1,
        y: tVector.y + 1,
      }
    }
    if (hVector.x - tVector.x === - 2) {
      return {
        x: hVector.x - 1,
        y: tVector.y + 1,
      }
    }
    return {
      x: hVector.x,
      y: tVector.y + 1,
    };
  }

  // Ty
  // .
  // Hy
  if (hVector.y - tVector.y === -2) {
    if (hVector.x - tVector.x === 2) {
      return {
        x: hVector.x + 1,
        y: tVector.y - 1,
      }
    }
    if (hVector.x - tVector.x === - 2) {
      return {
        x: hVector.x - 1,
        y: tVector.y - 1,
      }
    }
    return {
      x: hVector.x,
      y: tVector.y - 1,
    };
  }

  throw new Error(
    `Unknown situation ${hVector.x},${hVector.y} ${tVector.x},${tVector.y}`,
  );
}

function isAdjacent(hVector: Vector, tVector: Vector): boolean {
  return Math.abs(hVector.x - tVector.x) <= 1 &&
    Math.abs(hVector.y - tVector.y) <= 1;
}
