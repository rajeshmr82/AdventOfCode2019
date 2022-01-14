export class Computer {
  private memory: Array<number> = [];
  private pointer: number = 0;
  private input: number;
  output: number;
  constructor(memory: Array<number>) {
    this.memory = memory;
  }

  public run(input: number) {
    this.input = input;
    while (this.memory[this.pointer] != 99) {
      this.processOpcode();
    }

    return this.output;
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
        if (value1 == 0) {
          this.pointer = value2;
          break;
        }
        this.pointer += 3;
        break;

      case 3:
        this.memory[arg1] = this.input;
        this.pointer += 2;
        break;
      case 4:
        console.log(value1);
        this.output = value1;
        this.pointer += 2;
        break;

      default:
        console.log("unimplemented opcode: " + opcode);
    }
  }
}
