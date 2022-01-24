import run from "aocrunner";
import { Computer } from "../common/Computer.js";

const parseInput = (rawInput: string) => rawInput;
enum TileType {
  Empty,
  Wall,
  Block,
  Paddle,
  Ball,
}

class Tile {
  type: TileType;
  x: number;
  y: number;
  constructor(type: number, x: number, y: number) {
    this.type = TileType[TileType[type]];
    this.x = x;
    this.y = y;
  }
}

class Game {
  computer: Computer;
  tiles: Tile[];
  score: number = 0;
  constructor(input: number[]) {
    this.computer = new Computer(input);
    this.tiles = [];
  }

  public run() {
    let paddle: number = 0,
      ball: number = 0;
    while (!this.computer.halted) {
      const x = this.computer.runWithPause();
      const y = this.computer.runWithPause();
      const tileId: number = this.computer.runWithPause();
      if (!this.computer.halted) {
        if (x === -1 && y == 0) {
          this.score = tileId;
        } else if (TileType[TileType[tileId]] === TileType.Paddle) {
          paddle = x;
        } else if (TileType[TileType[tileId]] === TileType.Ball) {
          ball = x;
          this.computer.setInput([ball > paddle ? 1 : ball < paddle ? -1 : 0]);
        } else {
          this.tiles.push(new Tile(tileId, x, y));
        }
      }
    }
  }

  public blockTilesCount() {
    return this.tiles.filter((t) => t.type === TileType.Block).length;
  }

  public insertCoin(coins: number) {
    this.computer.set(0, coins);
  }

  public getScore() {
    return this.score;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split(",").map(Number);
  const game = new Game(input);
  game.run();
  return game.blockTilesCount();
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split(",").map(Number);
  const game = new Game(input);
  game.insertCoin(2);
  game.run();

  return game.getScore();
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
