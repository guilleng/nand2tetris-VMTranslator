const instruction: Record<string, string>= {
  "neg": "-M",
  "not": "!M",
  "add": "D+M", 
  "sub": "M-D", 
  "and": "D&M", 
  "or":  "D|M", 
  "eq":  "JEQ",
  "gt":  "JGT",
  "lt":  "JLT"
};

export const StackArithmetic = {
  pushConstant: (index: number):string => (
    `// push constant ${index}
  @${index}
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
`),

	/*
	 * Translates commands 'neg' and 'not'.
	 *
	 * Conveniently grouped together because both operations follow the pattern:
	 * [Load SP-- to A-Reg]->[Compute+Store]
	 */
	unaryComputation: (command: string):string => (
    `// ${command}
  @SP
  A=M-1
  M=${instruction[command]}
`),

	/*
	 * Translates commands 'add', 'sub', 'and' and 'or'.  
	 * 
	 * Conveniently grouped together because all these operations follow the
	 * pattern:
	 * [Load SP-- to A&M Reg]->[Load *SP to D-Reg]->[Load *(SP--) to A-Reg]
	 * ->[Compute+Store]
	 */
	binayComputation: (command: string):string => ( 
    `// ${command}
  @SP
  AM=M-1
  D=M
  A=A-1
  M=${instruction[command]}
`),

	/*
	 * Translates labeled commands 'eq', 'gt' and 'lt'.  Generates a unique label
	 *  concatenating the command and a counter.
	 * 
	 * Conveniently grouped together because all these operations follow the
	 * pattern:
	 * [Load *SP-- to D Reg]->[Compute (*SP-- - D) into D]->[Branch accordingly]
	 * ->[SP++]
	 */
  conditionalComputation: (command: string, counter: string):string => (
		`// ${command}
  @SP
  M=M-1
  A=M
  D=M
  @SP
  M=M-1
  A=M
  D=M-D
  @SP
  A=M
  M=-1
  @${instruction[command]}_L${counter}
  D;${instruction[command]}
  @SP
  A=M
  M=0
  (${instruction[command]}_L${counter})
  @SP
  M=M+1
`)};
