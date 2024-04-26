export const ProgramFlow = {

	label: (label: string, fileName: string):string => (
		`(${fileName}$${label})
`),

  goto: (label: string, fileName: string): string => (
    `// goto ${label}$${fileName}
  @${fileName}$${label}
  0;JMP
`),

  if: (label: string, fileName: string): string => (
    `// if-goto ${label}
	@SP
	AM=M-1
	D=M
  @${fileName}$${label}
	D;JNE
`),
};
