import { alg, Graph as GLGraph } from "npm:graphlib@2.1.8";

const input = await Deno.readTextFile("input.txt");

class Graph {
  #glGraph: typeof GLGraph;
  constructor() {
    this.#glGraph = new GLGraph({ directed: true });
  }

  setNode(node: Valve): void {
    return this.#glGraph.setNode(node.name, node.name);
  }

  setEdge(source: Valve, target: Valve): void {
    return this.#glGraph.setEdge(source.name, target.name);
  }

  dijkstra(): DijkstraResults {
    return alg.dijkstraAll(this.#glGraph);
  }
}

class Valve {
  isOpen = false;
  openedAt: number | undefined;
  readonly name: string;
  readonly flowRate: number;
  readonly valves: string[];

  constructor(valve: string, rawFlowRate: string, rawValves: string) {
    this.name = valve;
    this.flowRate = Number(rawFlowRate);
    this.valves = rawValves.split(", ");
  }

  open(openedAt: number): void {
    this.isOpen = true;
    this.openedAt = openedAt;
  }
}

function buildValveMap(): Map<string, Valve> {
  const lines = input.split("\n");
  const valves = new Map<string, Valve>();
  for (const line of lines) {
    const [, rawValve, rawFlowRate, rawValves] = line.match(
      /Valve ([A-Z]{2}) has flow rate=([\d]+); tunnels? leads? to valves? (.+)/,
    )!;
    const valve = new Valve(rawValve, rawFlowRate, rawValves);
    valves.set(valve.name, valve);
  }
  return valves;
}

const valves = buildValveMap();
const openableValveNames: string[] = [];

function buildGraph(): Graph {
  const graph = new Graph();
  for (const [name, valve] of valves) {
    if (valve.flowRate !== 0) {
      openableValveNames.push(name);
    }
    graph.setNode(valve);
    for (const edge of valve.valves) {
      const edgeValve = valves.get(edge)!;
      graph.setEdge(valve, edgeValve);
    }
  }
  return graph;
}

const swap = function (array: string[], pos1: number, pos2: number) {
  const temp = array[pos1];
  array[pos1] = array[pos2];
  array[pos2] = temp;
};

interface DijkstraResult {
  distance: number;
  predecessor: string;
}

type DijkstraResults = Record<string, Record<string, DijkstraResult>>;

const graph = buildGraph();
const results = graph.dijkstra();
let mostPressureReleased = 0;
let bestPath: string[] = [];
const maxIter = 1300000000000;
let calculations = 0;
// heapsPermute(openableValveNames);

// const valvesLeft = [...openableValveNames];
// while (valvesLeft.length > 0) {
//   let nextHighestPressureReleased
//   for (const valveLeft of valvesLeft) {

//   }
// }
// const permutationWithoutStart = ["DD", "BB", "JJ", "HH", "EE", "CC"];
// calculatePressureReleased(permutationWithoutStart);
getPermutations(openableValveNames);
console.log(mostPressureReleased);
console.log(bestPath);

function calculatePressureReleased(permutationWithoutStart: string[]): void {
  let timeLeft = 30;
  let index = 0;
  let pressureReleased = 0;
  const permutation = ["AA", ...permutationWithoutStart];
  for (const node of permutation) {
    const valve = valves.get(node)!;

    if (valve.flowRate > 0) {
      // Take 1 min to open
      timeLeft--;
      pressureReleased += timeLeft * valve.flowRate;
    }

    const nextPermutation = permutation[index + 1];
    if (!nextPermutation) {
      if (pressureReleased > mostPressureReleased) {
        mostPressureReleased = pressureReleased;
        bestPath = permutation;
      }
      break;
    }

    const distance = results[valve.name][nextPermutation].distance;
    timeLeft -= distance;
    index++;
  }
}

function getPermutations(
  possibleValues: string[],
  current: string[] = [],
): void {
  if (possibleValues.length === 0) {
    calculatePressureReleased(current);
    return;
  }
  for (const value of possibleValues) {
    const nextArray = [...current, value];
    if (!isViablePermutation(nextArray)) {
      calculatePressureReleased(current);
      continue;
    }

    getPermutations(
      possibleValues.filter((v) => v !== value),
      nextArray,
    );
  }
}

function isViablePermutation(permutationWithoutStart: string[]): boolean {
  let timeLeft = 30;
  let index = 0;
  const permutation = ["AA", ...permutationWithoutStart];
  for (const node of permutation) {
    const valve = valves.get(node)!;

    if (valve.flowRate > 0) {
      // Take 1 min to open
      timeLeft--;
    }

    const nextPermutation = permutation[index + 1];
    if (!nextPermutation) {
      return true;
    }

    const distance = results[valve.name][nextPermutation].distance;
    timeLeft -= distance;
    index++;

    if (timeLeft <= 0) {
      return false;
    }
  }
  return true;
}
