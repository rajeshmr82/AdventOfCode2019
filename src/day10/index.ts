import run from "aocrunner";
import { count } from "console";
import { stat } from "fs";
import { Coordinate } from "../common/Coordinate";

const parseInput = (rawInput: string) => rawInput;

const parseAsteriods = (input: string[]) => {
  let asteroids: Coordinate[] = [];
  for (let i = 0; i < input.length; i++) {
    const row = input[i];
    for (let j = 0; j < row.length; j++) {
      if (input[i][j] == "#") {
        asteroids.push(new Coordinate(j, i));
      }
    }
  }
  return asteroids;
};

const getAngle = (a: Coordinate, b: Coordinate) => {
  let angle =
    ((Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90 + 360) % 360;
  return {
    asteroid: b,
    angle: angle,
    distance: Math.hypot(a.x - b.x, a.y - b.y),
  };
};

const getVisibleAsteriods = (
  asteroid: Coordinate,
  asteroids: Coordinate[],
): any => {
  let allOthers = asteroids
    .map((o) => getAngle(asteroid, o))
    .filter((o) => o.distance !== 0);
  allOthers.sort((a, b) => a.distance - b.distance);

  for (let i = 0; i < allOthers.length; i++) {
    const curr = allOthers[i];
    if (curr == undefined) continue;
    allOthers = allOthers.filter(
      (o) =>
        o.angle !== curr.angle ||
        (o.angle === curr.angle && o.distance === curr.distance),
    );
  }

  return {
    asteroid: asteroid,
    //others: allOthers,
    count: allOthers.length,
  };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  let asteroids: Coordinate[] = parseAsteriods(input);

  const visibleCount = asteroids.map((asteroid) => {
    return getVisibleAsteriods(asteroid, asteroids);
  });

  return Math.max.apply(
    Math,
    visibleCount.map(function (o) {
      return o.count;
    }),
  );
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  let asteroids: Coordinate[] = parseAsteriods(input);

  const visibleAsteroids = asteroids.map((asteroid) => {
    return getVisibleAsteriods(asteroid, asteroids);
  });

  visibleAsteroids.sort((a, b) => b.count - a.count);
  const station = visibleAsteroids[0].asteroid;

  let others = asteroids
    .filter((a) => !(a.x === station.x && a.y === station.y))
    .map((o) => getAngle(station, o));

  others.sort((a, b) => {
    if (a.angle === b.angle) {
      return a.distance - b.distance;
    }
    return a.angle - b.angle;
  });

  let count = 0,
    angle = 0,
    result;

  while (count < 200) {
    let index = others.findIndex((a) => a.angle >= angle);
    let { asteroid } = others[index];
    result = asteroid.x * 100 + asteroid.y;
    others.splice(index, 1);

    angle = others.find((a) => a.angle > angle)?.angle || 0;
    count++;
  }

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##
        `,
        expected: 210,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        .#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##
        `,
        expected: 802,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
