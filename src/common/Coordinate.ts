import { dirxml } from "console";

export class Coordinate {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public move(delta: { dx: number; dy: number }) {
    this.x += delta.dx;
    this.y += delta.dy;
  }

  public add(delta: { dx: number; dy: number }) {
    return new Coordinate(this.x + delta.dx, this.y + delta.dy);
  }

  get coord() {
    return `${this.x},${this.y}`;
  }
}
