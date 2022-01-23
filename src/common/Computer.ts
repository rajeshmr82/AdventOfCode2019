export class Computer {
  private memory: Array<number> = [];
  private pointer: number = 0;
  public inputs: number[] = [];
  output: number[] = [];
  halted: boolean = false;
  base: number = 0;
  constructor(memory: Array<number>) {
    this.memory.push(...memory);
  }

  public setInput(inputs: number[]) {
    this.inputs.push(...inputs);
  }

  public getOutput(): number[] {
    return this.output;
  }

  public run(): number {
    while (!this.halted) {
      this.processOpcode();
    }

    return this.output[0];
  }

  public runWithPause(): number {
    this.output = [];
    while (this.memory[this.pointer] != 99 && this.output.length === 0) {
      this.processOpcode();
    }
    if (this.memory[this.pointer] % 100 === 99) this.halted = true;

    return this.output[0];
  }

  private getParameter(position: number): number {
    const instruction = this.memory[this.pointer].toString().padStart(5, "0");
    const mode = instruction[3 - position],
      arg = this.memory[Number(this.pointer) + Number(position)];

    if (mode === "0") {
      return this.memory[arg] || 0;
    } else if (mode === "1") {
      return arg;
    } else if (mode === "2") {
      return this.memory[arg + this.base] || 0;
    }

    return -1;
  }

  private setParameter(position: number, value: number) {
    const instruction = this.memory[this.pointer].toString().padStart(5, "0");
    const mode = instruction[3 - position],
      arg = this.memory[Number(this.pointer) + Number(position)];

    if (mode === "0") {
      this.memory[arg] = value;
    } else if (mode === "2") {
      this.memory[arg + Number(this.base)] = value;
    } else {
      console.log("Invalid. Destination cannot be in direct mode");
    }
  }

  private processOpcode() {
    const instruction = this.memory[this.pointer].toString().padStart(4, "0");
    const opcode = this.memory[this.pointer] % 100;

    switch (opcode) {
      case 1:
        this.setParameter(3, this.getParameter(1) + this.getParameter(2));
        this.pointer += 4;
        break;
      case 2:
        this.setParameter(3, this.getParameter(1) * this.getParameter(2));
        this.pointer += 4;
        break;
      case 7:
        if (this.getParameter(1) < this.getParameter(2)) {
          this.setParameter(3, 1);
        } else {
          this.setParameter(3, 0);
        }
        this.pointer += 4;
        break;
      case 8:
        if (this.getParameter(1) == this.getParameter(2)) {
          this.setParameter(3, 1);
        } else {
          this.setParameter(3, 0);
        }
        this.pointer += 4;
        break;
      case 5:
        if (this.getParameter(1) != 0) {
          this.pointer = this.getParameter(2);
        } else {
          this.pointer += 3;
        }
        break;
      case 6:
        if (this.getParameter(1) === 0) {
          this.pointer = this.getParameter(2);
        } else {
          this.pointer += 3;
        }
        break;
      case 3:
        this.setParameter(1, this.inputs.shift() || 0);
        this.pointer += 2;
        break;
      case 4:
        this.output.push(this.getParameter(1));
        //console.log(this.output[this.output.length - 1]);
        this.pointer += 2;
        break;
      case 9:
        this.base += this.getParameter(1);
        this.pointer += 2;
        break;
      case 99:
        this.halted = true;
        this.pointer += 1;
        break;
      default:
        console.log("invalid opcode: " + opcode);
    }
  }
}
