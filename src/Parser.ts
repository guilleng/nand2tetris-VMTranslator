import * as path from 'path';
import * as fs from 'fs';
import readlinePromises from 'readline';

export type CommandType = "C_PUSH" | "C_POP" | "C_ARITHMETIC" | "C_LABEL"  | 
                          "C_GOTO" | "C_IF"  | "C_FUNCTION"   | "C_RETURN" | 
                          "C_CALL" | "UNDEF";

export class Parser {
  private filePath: string;
  private code: string[];
  private position: number;
  private line: string[];
  private currentCommand: CommandType;

  constructor() {
    this.filePath = '';
    this.code = [];
    this.position = -1;
    this.line = [];
    this.currentCommand = "UNDEF";
  }

  /* 
   * Getter methods used in unit tests
   */
  get allCode() { return this.code; }
  get currentLine() { return this.code[this.position]; }

  /*
   * Cleans the input code by removing withe lines and comments.
   */
  private preprocessInput():void {
    const regexLineComments = /^\/\//;
    const regexInline = /\s*\/\/.*/g;

    this.code = this.code
        .map(line => line.replace(regexInline, '').trim())
        .filter(line => !regexLineComments.test(line) && line.length != 0);
  }

  /*
   * Loads the supplied *.vm file commands into the code[] string array.
   */
  public async setVMFile(file: string):Promise<void> {
    this.filePath = file;
    let inputStream = await fs.createReadStream(`${this.filePath}`);
    let rl = readlinePromises.createInterface({
      input: inputStream,
      crlfDelay: Infinity,
    });

    let i = 1;
    for await (const line of rl) {
      this.code.push(line);
    }

    this.preprocessInput();

    if (this.code.length !== 0) {     // File may be empty
      this.advance();
    }
  }

  public hasMoreCommands():boolean {
    return (this.position !== -1) && (this.position !== this.code.length);
  }

  public advance():void {
    this.position++;
  }

  public commandType():CommandType {

    this.line  = this.code[this.position].split(' ');

    switch (this.line[0]) {
    case "add": 
    case "sub": 
    case "neg": 
    case "eq": 
    case "lt": 
    case "gt": 
    case "and": 
    case "or": 
    case "not":
      return this.currentCommand = "C_ARITHMETIC";
      break;
    case "push":
      return this.currentCommand = "C_PUSH";
      break;
    case "pop":
      return this.currentCommand = "C_POP";
      break;
    case "label":
      return this.currentCommand = "C_LABEL";
      break;
    case "goto":
      return this.currentCommand = "C_GOTO";
      break;
    case "if-goto":
      return this.currentCommand = "C_IF";
      break;
    case "function":
      return this.currentCommand = "C_FUNCTION";
      break;
    case "call":
      return this.currentCommand = "C_CALL";
      break;
    case "return":
      return this.currentCommand = "C_RETURN";
      break;
    default:
      throw new Error(`Invalid command type ${this.line[0]}`);
    }
  }

  public arg1():string {
    if (this.currentCommand === "C_ARITHMETIC") {
      return this.line[0];
    }
    return this.line[1];
  }

  public arg2():number {
    return parseInt(this.line[2]);
  }
}
