const symbol: Record<string, string>= {
  "local":     "LCL",
  "argument":  "ARG",
  "this":      "THIS",
  "that":      "THAT",
};

const basis = (segment: string):number => {
  if (segment === "pointer") 
    return 3;
  else         /* "temp" */
    return 5;
};

export const MemoryAccess = {
	/*
	 * Pushing `LCL`, `ARG`, `THIS` and `THAT` instructions: 
	 *
	 * [Compute SYMBOL+i into D]->[*(SYMBOL+i) into D]->[Copy D to *SP]->[SP++]
	 */
	pushSymbol: (segment: string, index: number):string => (
		`// push ${segment} ${index}
  @${index}
  D=A
  @${symbol[segment]}
  A=D+M
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
`),

	/*
	 * Popping `LCL`, `ARG`, `THIS` and `THAT` instructions:
	 *
	 * [SP--]->[Compute SYMBOL+i into R13]->[Put *SP into D]->[Copy D to *(SYMBOL+i)]
	 */
  popSymbol: (segment: string, index: number):string => (
		`// pop ${segment} ${index}
	@SP
	M=M-1
	@${index}
	D=A
	@${symbol[segment]}
	D=D+M
	@R13
	M=D
	@SP
	A=M
	D=M
	@R13
	A=M
	M=D
`),

  /*
   * Translating both pop/push `POINTER 0/1` and `TEMP + i` is done by
   * referencing to the specific RAM address according to implementation.  
   */
  pushRegister: (segment: string, index: number):string => (
    `// push ${segment} ${index}
  @R${index + basis(segment)}
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
`),

  popRegister: (segment: string, index: number):string => (
    `// pop ${segment} ${index}
  @SP
  M=M-1
  @SP
  A=M
  D=M
  @R${index + basis(segment)}
  M=D
`),

	/*
	 * Static pushing/popping translation is straightforward.  
	 */
  popStatic: (index: number, fileName: string):string => (
    `// pop static ${index}
	@SP
	M=M-1
	@SP
	A=M
	D=M
	@${fileName}.${index}
	M=D
`),

  pushStatic: (index: number, fileName: string):string => (
    `// push static ${index}
	@${fileName}.${index}
	D=M
	@SP
	A=M
	M=D
	@SP
	M=M+1
`),
};
