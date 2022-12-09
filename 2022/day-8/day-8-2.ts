const input = await Deno.readTextFile("input.txt");

const trees = input.split("\n").map((r) => [...r].map(Number));

function getScore(
  trees: number[][],
  tree: number,
  x: number,
  y: number,
): number {
  // If edge, always 0
  if (
    x === 0 || y === 0 || x === trees[0].length - 1 || y === trees.length - 1
  ) {
    return 0;
  }

  // Left
  let score = getScoreLeft(trees, tree, x, y);
  score *= getScoreRight(trees, tree, x, y);
  score *= getScoreUp(trees, tree, x, y);
  score *= getScoreDown(trees, tree, x, y);

  return score;
}

function getTreeScore(trees: number[], currentTree: number): number {
  let score = 0;
  for (const tree of trees) {
    score++
    if (currentTree <= tree) {
      break
    }
  }
  return score;
}

function getScoreLeft(
  trees: number[][],
  tree: number,
  x: number,
  y: number,
): number {
  const treesLeft = trees[y].slice(0, x).reverse();
  // console.log('LEFT', getTreeScore(treesLeft, tree), x, y)
  return getTreeScore(treesLeft, tree);
}

function getScoreRight(
  trees: number[][],
  tree: number,
  x: number,
  y: number,
): number {
  const treesRight = trees[y].slice(x + 1);
  // console.log('RIGHT', getTreeScore(treesRight, tree), x, y)
  return getTreeScore(treesRight, tree);
}

function getScoreUp(
  trees: number[][],
  tree: number,
  x: number,
  y: number,
): number {
  const treesUp = trees.slice(0, y).map((t) => t[x]).reverse();
  // console.log('UP', treesUp, getTreeScore(treesUp, tree), x, y)
  return getTreeScore(treesUp, tree);
}

function getScoreDown(
  trees: number[][],
  tree: number,
  x: number,
  y: number,
): number {
  const treesDown = trees.slice(y + 1).map((t) => t[x]);
  // console.log('DOWN', treesDown, getTreeScore(treesDown, tree), x, y)
  return getTreeScore(treesDown, tree);
}

let x = 0;
let y = 0;
let highestScore = 0;
for (const treeRow of trees) {
  for (const tree of treeRow) {
    const score = getScore(trees, tree, x, y);
    if (score > highestScore) {
      highestScore = score;
    }
    x++;

    // Reset if x edge
    if (x === treeRow.length) {
      x = 0;
    }
  }
  y++;
}
console.log(highestScore);
