import { alg, Graph as GLGraph } from "npm:graphlib@2.1.8";

const input = await Deno.readTextFile("input.txt");

class Node {
  constructor(public readonly coord: string, public readonly z: string) {
  }
}

class Graph {
  public nodes = new Map<string, Node>();

  #glGraph: typeof GLGraph;
  constructor() {
    this.#glGraph = new GLGraph({ directed: true });
  }

  setNode(node: Node): void {
    this.nodes.set(node.coord, node);
    return this.#glGraph.setNode(node.coord, node.z);
  }

  setEdge(source: string, target: string): void {
    return this.#glGraph.setEdge(source, target);
  }

  getShortest(start: string, end: string): number {
    return alg.dijkstra(this.#glGraph, start)[end].distance;
  }

  runDijkstra(start: string): Record<string, { distance: number }> {
    return alg.dijkstra(this.#glGraph, start);
  }
}

function getZValue(z: string): number {
  if (z === "S") {
    return 1;
  }
  if (z === "E") {
    return 26;
  }
  return z.charCodeAt(0) - 96;
}

function buildMap(): string[][] {
  const rows = input.split("\n");
  const map: string[][] = [];
  for (const row of rows) {
    const columns = [...row];
    const rowToAdd: string[] = [];
    for (const column of columns) {
      rowToAdd.push(column);
    }
    map.push(rowToAdd);
  }
  return map;
}

let end = "";
function buildGraph(): Graph {
  let y = 0;
  const map = buildMap();
  const graph = new Graph();
  for (const row of map) {
    let x = 0;
    for (const column of row) {
      const coord = `${x},${y}`;
      const node = new Node(coord, column);
      if (column === "E") {
        end = node.coord;
      }
      const neighbours = [
        `${x},${y - 1}`,
        `${x},${y + 1}`,
        `${x - 1},${y}`,
        `${x + 1},${y}`,
      ];
      graph.setNode(node);
      for (const neighbour of neighbours) {
        const [x, y] = neighbour.split(",").map(Number);
        const value = map[y]?.[x];
        if (value) {
          const neighbourZ = getZValue(value);
          const neighbourNode = new Node(neighbour, value);
          graph.setNode(neighbourNode);
          if (neighbourZ <= getZValue(node.z) + 1) {
            // Flip the directions to only calculate the algorithm once
            graph.setEdge(neighbour, node.coord);
          }
        }
      }
      x++;
    }
    y++;
  }
  return graph;
}

const graph = buildGraph();
const result = graph.runDijkstra(end);
let shortestDistance: number | undefined;
for (const [coord, { distance }] of Object.entries(result)) {
  if (graph.nodes.get(coord)?.z === 'a') {
    if (!shortestDistance || distance < shortestDistance) {
      shortestDistance = distance
    }
  }
}
console.log(shortestDistance)
