import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

class Point {
  x: number = 0;
  y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
class Wire {
  sections: Array<{ p1: Point; p2: Point }> = [];
  constructor(path: string) {
    this.parse(path);
  }

  private parse(path: string) {
    let current = { x: 0, y: 0 };
    const tokens = path.split(",");

    for (const move of tokens) {
      let next = { ...current };

      switch (move[0]) {
        case "R":
          next.x += Number(move.substring(1));
          break;
        case "L":
          next.x -= Number(move.substring(1));
          break;
        case "U":
          next.y += Number(move.substring(1));
          break;
        case "D":
          next.y -= Number(move.substring(1));
          break;
        default:
          break;
      }

      this.sections.push({
        p1: new Point(current.x, current.y),
        p2: new Point(next.x, next.y),
      });

      current = next;
    }
  }

  public pointIsOnLine(p: Point, p1: Point, p2: Point): boolean {
    return (p1.x === p.x && p2.x === p.x) || (p1.y === p.y && p2.y === p.y);
  }

  public steps(p: Point): number {
    let steps = 0;
    for (const { p1, p2 } of this.sections) {
      if (this.pointIsOnLine(p1, p2, p)) {
        steps += Math.abs(p.x - p1.x) + Math.abs(p.y - p1.y);
        break;
      } else {
        steps += Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
      }
    }

    return steps;
  }
}

const findIntersection = (p1: Point, p2: Point, p3: Point, p4: Point) => {
  const s1_x = p2.x - p1.x;
  const s1_y = p2.y - p1.y;
  const s2_x = p4.x - p3.x;
  const s2_y = p4.y - p3.y;
  const s =
    (-s1_y * (p1.x - p3.x) + s1_x * (p1.y - p3.y)) /
    (-s2_x * s1_y + s1_x * s2_y);
  const t =
    (s2_x * (p1.y - p3.y) - s2_y * (p1.x - p3.x)) /
    (-s2_x * s1_y + s1_x * s2_y);
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    return {
      x: p1.x + t * s1_x,
      y: p1.y + t * s1_y,
    };
  }
  return null;
};

const getIntersections = (wires: Wire[]): Point[] => {
  const points = [];
  for (let i = 0; i < wires.length; i++) {
    const wire = wires[i];

    for (let j = i + 1; j < wires.length; j++) {
      const other = wires[j];
      for (const line1 of wire.sections) {
        for (const line2 of other.sections) {
          const intersection = findIntersection(
            line1.p1,
            line1.p2,
            line2.p1,
            line2.p2,
          );
          if (
            intersection !== null &&
            !(intersection.x === 0 && intersection.y === 0)
          ) {
            points.push(intersection);
          }
        }
      }
    }
  }
  return points;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");

  const wires = [];
  for (let i = 0; i < input.length; i++) {
    const wire = input[i];
    wires.push(new Wire(wire));
  }

  const intersections = getIntersections(wires);
  let minDistance = Number.MAX_SAFE_INTEGER;

  for (const point of intersections) {
    const distance = Math.abs(point.x) + Math.abs(point.y);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }
  return minDistance;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");

  const wires = [];
  for (let i = 0; i < input.length; i++) {
    const wire = input[i];
    wires.push(new Wire(wire));
  }
  const intersections = getIntersections(wires);
  let minSteps = Number.MAX_SAFE_INTEGER;
  for (const point of intersections) {
    let stepsCount = 0;
    for (const wire of wires) {
      stepsCount += wire.steps(point);
    }

    if (stepsCount < minSteps) {
      minSteps = stepsCount;
    }
  }
  return minSteps;
};

run({
  part1: {
    tests: [
      {
        input: `
        R75,D30,R83,U83,L12,D49,R71,U7,L72
        U62,R66,U55,R34,D71,R55,D58,R83
        `,
        expected: 159,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        R75,D30,R83,U83,L12,D49,R71,U7,L72
        U62,R66,U55,R34,D71,R55,D58,R83     
        `,
        expected: 610,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
