import run from "aocrunner";
import { Computer } from "../common/Computer.js";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split(",").map(Number);

  const comp = new Computer(input);
  comp.setInput([1]);
  return comp.run();
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split(",").map(Number);

  const comp = new Computer(input);
  comp.setInput([2]);
  return comp.run();
};

run({
  part1: {
    tests: [
      {
        input: `
        104,1125899906842624,99
        `,
        expected: 1125899906842624,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
