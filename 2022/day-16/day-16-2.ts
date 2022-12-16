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

interface DijkstraResult {
  distance: number;
  predecessor: string;
}

type DijkstraResults = Record<string, Record<string, DijkstraResult>>;

const graph = buildGraph();
const results = graph.dijkstra();
let mostPressureReleased = 0;
let bestPath: [string[], string[]] = [[], []];
const maxTime = 26;
// const permutationWithoutStart = ["DD", "BB", "JJ", "HH", "EE", "CC"];
// calculatePressureReleased(permutationWithoutStart);
getPermutations(openableValveNames);
console.log(mostPressureReleased);
console.log(bestPath);

function calculatePressureReleased(
  permutationWithoutStart: string[],
): [number, string[], number] {
  let timeLeft = maxTime;
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
      break;
    }

    const distance = results[valve.name][nextPermutation].distance;
    timeLeft -= distance;
    index++;
  }
  return [pressureReleased, permutation, timeLeft];
}

function getPermutations(
  possibleValues: string[],
  current1: string[] = [],
  current2: string[] = [],
): void {
  if (possibleValues.length === 0) {
    const [pressure1, bestPath1] = calculatePressureReleased(current1);
    const [pressure2, bestPath2] = calculatePressureReleased(current2);
    if ((pressure1 + pressure2) > mostPressureReleased) {
      mostPressureReleased = pressure1 + pressure2;
      console.log("Current", mostPressureReleased);
      bestPath = [bestPath1, bestPath2];
    }
    return;
  }
  const nextHighest = calculateHighestPossiblePressureReleased(
    possibleValues,
    current1,
    current2,
  );
  if (nextHighest < mostPressureReleased) {
    return;
  }
  for (const value of possibleValues) {
    // Current 1
    {
      const nextArray = [...current1, value];
      if (!isViablePermutation(nextArray)) {
        const [pressure1, bestPath1] = calculatePressureReleased(current1);
        const [pressure2, bestPath2] = calculatePressureReleased(current2);
        if ((pressure1 + pressure2) > mostPressureReleased) {
          mostPressureReleased = pressure1 + pressure2;
          console.log("Current", mostPressureReleased);
          bestPath = [bestPath1, bestPath2];
        }
      }
      getPermutations(
        possibleValues.filter((v) => v !== value),
        nextArray,
        current2,
      );
    }

    // Current 2
    {
      const nextArray = [...current2, value];
      if (!isViablePermutation(nextArray)) {
        const [pressure1, bestPath1] = calculatePressureReleased(current1);
        const [pressure2, bestPath2] = calculatePressureReleased(current2);
        if ((pressure1 + pressure2) > mostPressureReleased) {
          mostPressureReleased = pressure1 + pressure2;
          console.log("Current", mostPressureReleased);
          bestPath = [bestPath1, bestPath2];
        }
      }
      getPermutations(
        possibleValues.filter((v) => v !== value),
        current1,
        nextArray,
      );
    }
  }
}

function calculateHighestPossiblePressureReleased(
  possibleValves: string[],
  current1: string[],
  current2: string[],
): number {
  const [pressure1, , timeLeft1] = calculatePressureReleased(current1);
  const [pressure2, , timeLeft2] = calculatePressureReleased(current2);
  const timeLeft = Math.max(timeLeft1, timeLeft2);
  let pressureReleased = pressure1 + pressure2;
  for (const node of possibleValves) {
    const valve = valves.get(node)!;

    if (valve.flowRate > 0) {
      pressureReleased += timeLeft * valve.flowRate;
    }
  }
  return pressureReleased;
}

function isViablePermutation(permutationWithoutStart: string[]): boolean {
  let timeLeft = maxTime;
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

    if (timeLeft < 0) {
      return false;
    }
  }
  return true;
}
