import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const moduleMass = input.split("\n");
  
  return moduleMass.reduce((acc,curr)=> acc + (Math.floor(parseInt(curr)/3)-2),0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const moduleMass = input.split("\n");

  return moduleMass.reduce((acc,curr)=> acc + recFuel(parseInt(curr)),0);
};

const recFuel=(curr: number):number => {
  if(Math.floor(curr/3)<=0)
    return 0;

    let fuel= Math.max(Math.floor(curr/3)-2,0);
    return fuel+ recFuel(fuel);
};


run({
  part1: {
    tests: [
      {
        input: `
        12
        14
        1969
        100756
        `,
        expected: 34241,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        1969
        `,
        expected: 966,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

