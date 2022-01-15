import run from "aocrunner";
import { Planet } from "./Planet.js";

const parseInput = (rawInput: string) => rawInput;

const buildGraph = (input: string[]) => {
  let graphs = new Map();
  for (const connection of input) {
    const tokens = connection.split(")");
    if (!graphs.has(tokens[0])) graphs.set(tokens[0], new Planet(tokens[0]));

    if (!graphs.has(tokens[1])) graphs.set(tokens[1], new Planet(tokens[1]));

    const parent: Planet = graphs.get(tokens[0]),
      child: Planet = graphs.get(tokens[1]);

    parent.setOrbit(child);
    child.setParent(parent);
  }
  return graphs;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  let graphs = buildGraph(input);

  const com: Planet = graphs.get("COM");

  let orbits = 0;
  let queue: Planet[] = [];
  queue.push(com);
  while (queue.length > 0) {
    const obj = queue.shift();
    if (obj.parent !== undefined) obj.level = obj.parent.level + 1;

    orbits += obj.level;

    for (const child of obj.orbits) {
      queue.push(child);
    }
  }
  return orbits;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  let graph = buildGraph(input);

  let youPath: Planet[] = graph.get("YOU").path();
  let destPath: Planet[] = graph.get("SAN").path();

  let result: number = -1;
  destPath.map((node, i) => {
    const j = youPath.findIndex((n) => n === node);
    if (j !== -1 && result == -1) {
      result = i + j;
    }
  });

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
        COM)B
        B)C
        C)D
        D)E
        E)F
        B)G
        G)H
        D)I
        E)J
        J)K
        K)L
        `,
        expected: 42,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        COM)B
        B)C
        C)D
        D)E
        E)F
        B)G
        G)H
        D)I
        E)J
        J)K
        K)L
        K)YOU
        I)SAN
        `,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
