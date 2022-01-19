export class Computer {
  private memory: Array<number> = [];
  private pointer: number = 0;
  public inputs: number[] = [];
  output: number[] = [];
  halted: boolean = false;
  constructor(memory: Array<number>) {
    this.memory.push(...memory);
  }

  public setInput(inputs: number[]) {
    this.inputs.push(...inputs);
  }

  public run(): number {
    while (this.memory[this.pointer] != 99) {
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

  private processOpcode() {
    const instruction = this.memory[this.pointer].toString().padStart(4, "0");
    const opcode = parseInt(instruction.substring(2));
    const flag1 = instruction[1],
      flag2 = instruction[0];
    const arg1 = this.memory[this.pointer + 1],
      arg2 = this.memory[this.pointer + 2],
      arg3 = this.memory[this.pointer + 3];

    const value1 = flag1 === "1" ? arg1 : this.memory[arg1],
      value2 = flag2 === "1" ? arg2 : this.memory[arg2];

    switch (opcode) {
      case 1:
        this.memory[arg3] = value1 + value2;
        this.pointer += 4;
        break;
      case 2:
        this.memory[arg3] = value1 * value2;
        this.pointer += 4;
        break;
      case 7:
        this.memory[arg3] = value1 < value2 ? 1 : 0;
        this.pointer += 4;
        break;

      case 8:
        this.memory[arg3] = value1 == value2 ? 1 : 0;
        this.pointer += 4;
        break;

      case 5:
        if (value1 != 0) {
          this.pointer = value2;
          break;
        }
        this.pointer += 3;
        break;

      case 6:
        if (value1 === 0) {
          this.pointer = value2;
          break;
        }
        this.pointer += 3;
        break;

      case 3:
        this.memory[arg1] = this.inputs.shift();
        this.pointer += 2;
        break;
      case 4:
        //console.log(value1);
        this.output.push(value1);
        this.pointer += 2;
        break;

      default:
        console.log("invalid opcode: " + opcode);
    }
  }
}
