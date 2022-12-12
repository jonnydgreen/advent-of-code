import * as yaml from "https://deno.land/std@0.167.0/encoding/yaml.ts";

let rawInput = await Deno.readTextFile("input.txt");

rawInput = rawInput.replace(/Test: (.+)/g, (_, group1) => {
  return `Test:\n    Condition: ${group1}`;
});

export interface RawTest {
  Condition: string;
  "If true": string;
  "If false": string;
}

export type RawMonkey = {
  "Starting items": string;
  Operation: string;
  Test: RawTest;
};

export type OperationType = "*" | "+";

export interface MonkeyOperation {
  type: OperationType;
  value1: bigint | "old";
  value2: bigint | "old";
}

export interface MonkeyTest {
  condition: bigint;
  ifTrue: number;
  ifFalse: number;
}

export interface IMonkey {
  id: number;
  items: bigint[];
  operation: MonkeyOperation;
  test: MonkeyTest;
}

class Monkey implements IMonkey {
  public id: number;
  public items: bigint[];
  public operation: MonkeyOperation;
  public test: MonkeyTest;
  public numInspections = 0;

  constructor(name: string, raw: RawMonkey) {
    const monkey = this.#parseRaw(name, raw);
    this.id = monkey.id;
    this.items = monkey.items;
    this.operation = monkey.operation;
    this.test = monkey.test;
  }

  #parseRaw(name: string, raw: RawMonkey): IMonkey {
    const [rawV1, rawType, rawV2] = raw.Operation.replace("new = ", "").split(
      " ",
    );
    return {
      id: Number(name.split(" ")[1]),
      items: raw["Starting items"].toString().split(", ").map(BigInt),
      operation: {
        type: rawType as OperationType,
        value1: rawV1 as "old",
        value2: rawV2 as "old",
      },
      test: {
        condition: BigInt(raw.Test.Condition.replace("divisible by ", "")),
        ifTrue: Number(raw.Test["If true"].replace("throw to monkey ", "")),
        ifFalse: Number(raw.Test["If false"].replace("throw to monkey ", "")),
      },
    };
  }
}

const input = yaml.parse(rawInput) as Record<string, RawMonkey>;
const monkeys: Monkey[] = [];
for (const [name, raw] of Object.entries(input)) {
  monkeys.push(new Monkey(name, raw));
}

function calculateWorryLevel(operation: MonkeyOperation, item: bigint): bigint {
  const v1 = operation.value1 === "old" ? item : BigInt(operation.value1);
  const v2 = operation.value2 === "old" ? item : BigInt(operation.value2);
  let newWorryLevel: bigint;
  switch (operation.type) {
    case "*": {
      newWorryLevel = v1 * v2;
      break;
    }
    case "+": {
      newWorryLevel = v1 + v2;
      break;
    }
    default: {
      throw new Error(`Unknown type ${operation.type}`);
    }
  }
  return newWorryLevel / BigInt(3);
}

function getMonkeyToThrowTo(test: MonkeyTest, level: bigint): number {
  return level % test.condition === 0n ? test.ifTrue : test.ifFalse;
}

for (const _round of [...Array(20).keys()].map((r) => r + 1)) {
  for (const monkey of monkeys) {
    for (const item of monkey.items) {
      const newWorryLevel = calculateWorryLevel(monkey.operation, item);
      const monkeyToThrowTo = getMonkeyToThrowTo(monkey.test, newWorryLevel);
      monkeys[monkeyToThrowTo].items.push(newWorryLevel);
      monkey.numInspections++;
    }
    monkey.items = [];
  }
}

const [first, second] = monkeys.map((m) => m.numInspections).sort((a, b) => b - a);

console.log(first * second);
