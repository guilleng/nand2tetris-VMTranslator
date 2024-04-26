import { StackArithmetic } from './StackArithmetic'

/*
 * Returns the asm code that yields the `PUSH 0` operation `numLocals` times.
 */
const pushLocals = (numLocals: number): string => {
  let pushedLocals = "";
  
  while (numLocals--) {
    pushedLocals += StackArithmetic.pushConstant(0);
  }
  return pushedLocals;
}

/*
 * Implementations follow the protocols described in Chapter 8, figure 8.5.
 */
export const FunctionCalls = {

  function: (functionName: string, locals: number): string => (
  `// function ${functionName}
  (${functionName})
  ${pushLocals(locals)}
`),

  call: (functionName: string, locals: number, callCount: number): string => (
    `// call ${functionName} ${locals}
	@${functionName}$${callCount}
	D=A
	@SP
	A=M
	M=D
	@SP
	M=M+1
  @LCL
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @ARG
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @THIS
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @THAT
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @SP
	D=M
	@${locals}
	D=D-A
	@5
	D=D-A
	@ARG
	M=D
	@SP
	D=M
	@LCL
	M=D
	@${functionName}
	0;JMP
	(${functionName}$${callCount})
`),

  wreturn: (): string => (
    `// return
	@LCL
	D=M
	@FRAME
	M=D
	@5
	D=A
	@FRAME
	A=M-D
	D=M
	@RET
	M=D
	@SP
	M=M-1
	@SP
	A=M
	D=M
	@ARG
	A=M
	M=D
	@ARG
	D=M+1
	@SP
	M=D
	@1
	D=A
	@FRAME
	A=M-D
	D=M
	@THAT
	M=D
	@2
	D=A
	@FRAME
	A=M-D
	D=M
	@THIS
	M=D
	@3
	D=A
	@FRAME
	A=M-D
	D=M
	@ARG
	M=D
	@4
	D=A
	@FRAME
	A=M-D
	D=M
	@LCL
	M=D
	@RET
	A=M
	0;JMP
`)
};
