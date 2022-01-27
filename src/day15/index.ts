import run from "aocrunner";
import { Computer } from "../common/Computer.js";
import { Coordinate } from "../common/Coordinate.js";
import { Queue } from "../common/Queue.js";

const parseInput = (rawInput: string) => rawInput;

const Directions: { [key: string]: number } = {
  NORTH: 1,
  SOUTH: 2,
  WEST: 3,
  EAST: 4,
};

const Steps: { [key: string]: { dx: number; dy: number } } = {
  NORTH: { dx: 0, dy: 1 },
  SOUTH: { dx: 0, dy: -1 },
  WEST: { dx: -1, dy: 0 },
  EAST: { dx: 1, dy: 0 },
};

const Responses = {
  HIT_WALL: 0,
  MADE_STEP: 1,
  FOUND_OXYGEN: 2,
};

class Maze {
  input: number[] = [];
  computer: Computer;
  oxygen: Coordinate;
  constructor(input: number[]) {
    this.computer = new Computer(input);
    this.oxygen = new Coordinate(0, 0);
  }

  public discoverMap() {
    let crumbs = new Map();
    let loc: Coordinate = new Coordinate(0, 0);
    const edges = new Map();
    crumbs.set(loc.coord, 1);
    let direction = Directions.NORTH;
    this.computer.setInput([direction]);
    let notVisited = new Set();
    while (!this.computer.halted) {
      const status = this.computer.runWithPause();
      const attempt = loc.add(Steps[Object.keys(Directions)[direction - 1]]);
      notVisited.delete(attempt.coord);

      if (status === Responses.HIT_WALL) {
        crumbs.set(attempt.coord, -1);
      } else {
        edges.has(loc.coord)
          ? edges.get(loc.coord).push(attempt)
          : edges.set(loc.coord, [attempt]);
        edges.has(attempt.coord)
          ? edges.get(attempt.coord).push(loc)
          : edges.set(attempt.coord, [loc]);
        loc = attempt;
        crumbs.set(loc.coord, (crumbs.get(loc.coord) || 0) + 1);
      }
      if (status === Responses.FOUND_OXYGEN) {
        this.oxygen = loc;
      }

      let min = null;
      for (const d of Object.keys(Directions)) {
        let neighbor = loc.add(Steps[d]);

        if (crumbs.get(neighbor.coord) === -1) continue;

        const crumbCount = crumbs.get(neighbor.coord) || 0;
        if (crumbCount == 0) {
          notVisited.add(neighbor.coord);
        }

        if (min == null || crumbCount < min) {
          min = crumbCount;
          direction = Directions[d];
        }
      }
      if (notVisited.size === 0) {
        break;
      }

      this.computer.setInput([direction]);
    }

    return edges;
  }

  public getDistance(edges: Map<string, Coordinate[]>, startLoc: Coordinate) {
    const distances = new Map();
    distances.set(startLoc.coord, 0);

    const queue = new Queue<Coordinate>();
    queue.enqueue(startLoc);
    while (!queue.isEmpty()) {
      let loc: Coordinate = queue.dequeue() || new Coordinate(0, 0);
      const neighbours = edges.get(loc.coord) || [];
      for (const neighbor of neighbours) {
        if (
          !distances.has(neighbor?.coord) ||
          distances.get(loc.coord) + 1 < distances.get(neighbor)
        ) {
          distances.set(neighbor.coord, distances.get(loc.coord) + 1);
          queue.enqueue(neighbor);
        }
      }
    }

    return distances;
  }

  public getO2Distance(): number {
    const edges = this.discoverMap();
    const distances = this.getDistance(edges, new Coordinate(0, 0));

    return distances.get(this.oxygen.coord);
  }

  public getMaxDistance(): number {
    const edges = this.discoverMap();
    const distances = this.getDistance(edges, this.oxygen);

    return Math.max(...distances.values());
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split(",").map(Number);
  const maze = new Maze(input);
  return maze.getO2Distance();
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split(",").map(Number);
  const maze = new Maze(input);
  return maze.getMaxDistance();
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
