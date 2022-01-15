export class Planet {
  level: number = 0;
  parent: Planet | undefined;
  orbits: Planet[] = [];
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  public setOrbit(orbit: Planet) {
    this.orbits.push(orbit);
  }

  public setParent(object: Planet) {
    this.parent = object;
  }

  public setLevel(level: number) {
    this.level = level;
  }

  public path() {
    let nodes: Planet[] = [];
    let n: Planet = this.parent;
    while (n.name != "COM") {
      nodes.push(n);
      n = n.parent;
    }

    return nodes;
  }
}
