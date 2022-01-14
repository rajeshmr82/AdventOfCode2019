import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const checkEnhancedCriteria = (num: string): boolean => {
  if (num.length != 6) return false;

  // if (!/([0-9])\1{2}/.test(num.toString())) return false;
  // let repeate = false;

  let map: { [key: string]: number } = {};

  for (let i = 1; i < num.length; i++) {
    if (num[i - 1] > num[i]) return false;

    if (num[i - 1] === num[i]) {
      map[num[i]] = map[num[i]] + 1 || 1;
    }
  }

  let repeateCount = Object.keys(map).reduce(
    (acc, item) => acc + (map[item] === 1 ? 1 : 0),
    0,
  );

  return true && repeateCount >= 1;
};

const checkCriteria = (num: string): boolean => {
  if (num.length != 6) return false;

  let repeate = false;

  for (let i = 1; i < num.length; i++) {
    if (num[i - 1] > num[i]) return false;

    if (num[i - 1] === num[i]) repeate = true;
  }

  return true && repeate;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split("-");
  const start = parseInt(input[0]);
  const end = parseInt(input[1]);

  let count = 0;
  for (let num = start; num <= end; num++) {
    if (checkCriteria(num.toString())) {
      count++;
    }
  }
  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split("-");
  const start = parseInt(input[0]);
  const end = parseInt(input[1]);

  let count = 0;
  for (let num = start; num <= end; num++) {
    if (checkEnhancedCriteria(num.toString())) {
      count++;
    }
  }
  return count;
};

run({
  part1: {
    tests: [
      {
        input: `
        146810-612564
        `,
        expected: 1748,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        146810-612564
        `,
        expected: 1748,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
