import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

class Computer {
  private memory: Array<number> = [];
  private pointer: number = 0;
  constructor(memory: Array<number>) {
    this.memory = memory;
  }

  private getInstruction(): {
    opcode: number;
    param1: number;
    param2: number;
    output: number;
  } {
    let ret = {
      opcode: this.memory[this.pointer],
      param1: this.memory[this.pointer + 1],
      param2: this.memory[this.pointer + 2],
      output: this.memory[this.pointer + 3],
    };
    this.pointer += 4;
    return ret;
  }
  public findTarget(target: number): { noun: number; verb: number } {
    let checkpoint = [...this.memory];
    for (let n = 0; n <= 99; n++) {
      for (let v = 0; v <= 99; v++) {
        this.memory = [...checkpoint];
        this.pointer = 0;
        this.execute(n, v);

        if (this.memory[0] === target) return { noun: n, verb: v };
      }
    }

    return { noun: -1, verb: -1 };
  }

  public execute(noun: number, verb: number): number {
    this.memory[1] = noun;
    this.memory[2] = verb;
    let { opcode, param1, param2, output } = { ...this.getInstruction() };

    while (opcode !== 99) {
      if (param1 >= this.memory.length || param2 >= this.memory.length)
        return -1;

      switch (opcode) {
        case 1:
          this.memory[output] = this.memory[param1] + this.memory[param2];
          break;
        case 2:
          this.memory[output] = this.memory[param1] * this.memory[param2];
          break;
        default:
          break;
      }

      ({ opcode, param1, param2, output } = { ...this.getInstruction() });
    }
    return this.memory[0];
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const integers = input.split(",").map(Number);
  const computer = new Computer(integers);

  return computer.execute(integers[1], integers[2]);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const integers = input.split(",").map(Number);
  const computer = new Computer(integers);
  const result = computer.findTarget(19690720);
  return result.noun * 100 + result.verb;
};

run({
  part1: {
    tests: [
      {
        input: `
        1,9,10,3,2,3,11,0,99,30,40,50
        `,
        expected: 3500,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        1,9,10,3,2,3,11,0,99,30,40,50
        `,
        expected: -101,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
