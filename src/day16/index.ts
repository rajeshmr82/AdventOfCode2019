import run from "aocrunner";
import { range } from "../common/range.js";

const parseInput = (rawInput: string) => rawInput;

const step = (phase: number[], n: number) => {
  const base = [0, 1, 0, -1];
  while (n-- > 0) {
    for (let i = 0; i < phase.length; i++) {
      const currBase = base.map((b) => Array(i + 1).fill(b)).flat();

      let digit = 0;
      for (let j = 0; j < phase.length; j++) {
        digit += phase[j] * currBase[(j + 1) % currBase.length];
      }
      phase[i] = Math.abs(digit) % 10;
    }
  }
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let phase = Array.from(String(input), Number);
  step(phase, 100);

  return phase.slice(0, 8).join("");
};

const makeRepeated = (arr: number[], repeats: number) =>
  Array.from({ length: repeats }, () => arr).flat();

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let phase = Array.from(String(input), Number);
  const offset = parseInt(phase.slice(0, 7).join(""), 10);
  phase = makeRepeated(phase, 10000);
  const slice = phase.slice(offset);

  for (let j = 0; j < 100; j++) {
    for (let i = slice.length - 2; i >= 0; i--) {
      slice[i] = (slice[i + 1] + slice[i]) % 10;
    }
  }

  return slice.slice(0, 8).join("");
};

run({
  part1: {
    tests: [
      {
        input: `
        69317163492948606335995924319873
        `,
        expected: "52432133",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        03036732577212944063491565474664
        `,
        expected: "84462026",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
