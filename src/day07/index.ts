import run from "aocrunner";
import { Computer } from "../common/Computer.js";

const parseInput = (rawInput: string) => rawInput;

class Circuit {
  memory: number[] = [];
  phases: number[];
  amplifiers: Computer[] = [];
  constructor(memory: number[], phases: number[]) {
    this.memory.push(...memory);
    this.phases = phases;
    for (let i = 0; i < 5; i++) {
      const comp = new Computer(memory);
      comp.setInput([phases[i]]);
      this.amplifiers.push(comp);
    }
  }

  public run() {
    let prevOutput = 0;
    while (!this.amplifiers.every((a) => a.halted)) {
      for (const amp of this.amplifiers) {
        amp.setInput([prevOutput]);
        const output = amp.runWithPause();
        prevOutput = output;
      }
    }

    return prevOutput;
  }
}

const permutations = (arr: number[]) => {
  if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;
  return arr.reduce(
    (acc, item, i) =>
      acc.concat(
        permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(
          (val: number[]) => [item, ...val],
        ),
      ),
    [],
  );
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const integers = input.split(",").map(Number);
  const phaseSeed = [0, 1, 2, 3, 4];
  const perms = permutations(phaseSeed);
  let maxThrust = Number.MIN_SAFE_INTEGER;
  for (const phase of perms) {
    let signal = 0;
    for (const p of phase) {
      const computer = new Computer(integers);
      computer.setInput([p, signal]);
      const output = computer.run();
      signal = output;
    }
    if (signal > maxThrust) {
      maxThrust = signal;
    }
  }
  return maxThrust;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const integers = input.split(",").map(Number);

  const phaseSeed = [5, 6, 7, 8, 9];
  const perms = permutations(phaseSeed);

  let maxThrust = Number.MIN_SAFE_INTEGER;

  for (const phase of perms) {
    let circuit = new Circuit(integers, phase);
    const thrust = circuit.run();
    maxThrust = Math.max(thrust, maxThrust);
  }

  return maxThrust;
};

run({
  part1: {
    tests: [
      {
        input: `
        3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0
        `,
        expected: 65210,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5
        `,
        expected: 139629729,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
