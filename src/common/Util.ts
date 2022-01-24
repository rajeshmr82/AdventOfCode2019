export function LCM(x: number, y: number) {
  return !x || !y ? 0 : Math.abs((x * y) / GCD(x, y));
}

export function GCD(x: number, y: number) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}
