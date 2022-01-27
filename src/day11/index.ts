import run from "aocrunner";
import { Computer } from "../common/Computer.js";

const parseInput = (rawInput: string) => rawInput;

interface panel {
  [key: string]: number;
}

class Direction {
  x: number;
  y: number;
  direction: number;

  private directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.direction = 0;
  }

  move(dir: number) {
    this.direction =
      (dir === 1
        ? this.direction + 1
        : this.direction - 1 + this.directions.length) % this.directions.length;

    const { x, y } = this.directions[this.direction];

    this.x += x;
    this.y += y;
  }

  get coord() {
    return `${this.x},${this.y}`;
  }
}

class Robot {
  computer: Computer;
  directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  x = 0;
  y = 0;
  direction = 0;
  panel: panel = {};
  constructor(input: number[], initColor: number) {
    this.panel[this.getKey()] = initColor;
    this.computer = new Computer(input);
  }

  public getKey() {
    return `(${this.x},${this.y})`;
  }

  public run() {
    while (!this.computer.halted) {
      let key = this.getKey();
      this.computer.setInput([this.panel[key] || 0]);
      const output1 = this.computer.runWithPause();
      const output2 = this.computer.runWithPause();

      if (!this.computer.halted) {
        this.panel[key] = output1;
        if (output2 === 1) {
          this.direction = (this.direction + 1) % this.directions.length;
        } else if (output2 === 0) {
          this.direction =
            (this.direction - 1 + this.directions.length) %
            this.directions.length;
        }
        this.x += this.directions[this.direction][0];
        this.y += this.directions[this.direction][1];
      }
    }
  }

  public count() {
    return Object.keys(this.panel).length;
  }

  print() {
    const registration = Array(6)
      .fill("")
      .map(() => Array(40).fill(" "));

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 40; col++) {
        if (this.panel[`(${col},${row})`] === 1) registration[row][col] = "*";
      }
    }

    for (const row of registration) {
      console.log(row.join(""));
    }
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split(",").map(Number);
  const robot = new Robot(input, 0);
  robot.run();
  return robot.count();
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split(",").map(Number);
  const robot = new Robot(input, 1);
  robot.run();
  robot.print();
  return "JKZLZJBH";
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
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
