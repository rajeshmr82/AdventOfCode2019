import run from "aocrunner";
import { LCM } from "../common/Util.js";

const parseInput = (rawInput: string) => rawInput;

class Moon {
  x: number;
  y: number;
  z: number;
  vx: number = 0;
  vy: number = 0;
  vz: number = 0;
  constructor(coordinates: number[]) {
    this.x = coordinates[0];
    this.y = coordinates[1];
    this.z = coordinates[2];
  }

  public velocity() {
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
  }

  public energy() {
    return (
      (Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z)) *
      (Math.abs(this.vx) + Math.abs(this.vy) + Math.abs(this.vz))
    );
  }

  public gravity(moon2: Moon) {
    if (this.x > moon2.x) {
      this.vx--;
      moon2.vx++;
    } else if (this.x < moon2.x) {
      this.vx++;
      moon2.vx--;
    }

    if (this.y > moon2.y) {
      this.vy--;
      moon2.vy++;
    } else if (this.y < moon2.y) {
      this.vy++;
      moon2.vy--;
    }

    if (this.z > moon2.z) {
      this.vz--;
      moon2.vz++;
    } else if (this.z < moon2.z) {
      this.vz++;
      moon2.vz--;
    }
  }

  public getProp(prop: string) {
    if (prop === "x") return { pos: this.x, vel: this.vx };
    if (prop === "y") return { pos: this.y, vel: this.vy };
    if (prop === "z") return { pos: this.z, vel: this.vz };

    return { pos: 0, vel: 0 };
  }
}

const parseMoons = (input: string[]) => {
  return input.map((m) => new Moon((m.match(/-?\d+/g) || []).map(Number)));
};

const step = (moons: Moon[]) => {
  moons.forEach((moon1, idx1) =>
    moons.forEach((moon2, idx2) => {
      if (idx1 > idx2) moon1.gravity(moon2);
    }),
  );

  moons.forEach((m) => m.velocity());
};

const simulate = (moons: Moon[], prop: string): number => {
  const original = [...moons];
  const compare = original.map((m) => m.getProp(prop));
  let steps = 0;
  while (true) {
    step(moons);
    steps++;
    if (
      JSON.stringify(compare) ===
      JSON.stringify(moons.map((m) => m.getProp(prop)))
    )
      return steps;
  }

  return 0;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  const moons = parseMoons(input);

  let steps = 1000;
  while (steps-- > 0) {
    step(moons);
  }
  const energy = moons.reduce((acc, m) => acc + m.energy(), 0);
  return energy;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  const moons = parseMoons(input);
  const xSteps = simulate(moons, "x"),
    ySteps = simulate(moons, "y"),
    zSteps = simulate(moons, "z");

  return LCM(LCM(xSteps, ySteps), zSteps);
};

run({
  part1: {
    tests: [
      {
        input: `
        <x=-1, y=0, z=2>
        <x=2, y=-10, z=-7>
        <x=4, y=-8, z=8>
        <x=3, y=5, z=-1>
        `,
        expected: 183,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        <x=-8, y=-10, z=0>
        <x=5, y=5, z=10>
        <x=2, y=-7, z=3>
        <x=9, y=-8, z=-3>
        `,
        expected: 4686774924,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
