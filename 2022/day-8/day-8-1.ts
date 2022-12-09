const input = await Deno.readTextFile("input.txt");

const trees = input.split("\n").map((r) => [...r].map(Number));

function isVisible(
  trees: number[][],
  tree: number,
  x: number,
  y: number,
): boolean {
  // If edge, always true
  if (
    x === 0 || y === 0 || x === trees[0].length - 1 || y === trees.length - 1
  ) {
    return true;
  }

  // Left
  if (isVisibleLeft(trees, tree, x, y)) {
    // console.log("LEFT", { tree, x, y });
    return true;
  }

  // Right
  if (isVisibleRight(trees, tree, x, y)) {
    // console.log("RIGHT", { tree, x, y });
    return true;
  }

  // Up
  if (isVisibleUp(trees, tree, x, y)) {
    // console.log("Up", { tree, x, y });
    return true;
  }

  // Down
  if (isVisibleDown(trees, tree, x, y)) {
    // console.log("Down", { tree, x, y });
    return true;
  }

  return false;
}

function isVisibleLeft(
  trees: number[][],
  tree: number,
  x: number,
  y: number,
): boolean {
  const treesLeft = trees[y].slice(0, x);
  return tree > Math.max(...treesLeft);
}

function isVisibleRight(
  trees: number[][],
  tree: number,
  x: number,
  y: number,
): boolean {
  const treesRight = trees[y].slice(x + 1);
  return tree > Math.max(...treesRight);
}

function isVisibleUp(
  trees: number[][],
  tree: number,
  x: number,
  y: number,
): boolean {
  const treesUp = trees.slice(0, y).map((t) => t[x]);
  return tree > Math.max(...treesUp);
}

function isVisibleDown(
  trees: number[][],
  tree: number,
  x: number,
  y: number,
): boolean {
  const treesDown = trees.slice(y + 1).map((t) => t[x]);
  return tree > Math.max(...treesDown);
}

let x = 0;
let y = 0;
let total = 0;
for (const treeRow of trees) {
  for (const tree of treeRow) {
    if (isVisible(trees, tree, x, y)) {
      total++;
    }
    x++;

    // Reset if x edge
    if (x === treeRow.length) {
      x = 0
    }
  }
  y++;

}
console.log(total);
