#!/usr/bin/env node

import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { Parser, CommandType } from './Parser';
import { CodeWriter } from './CodeWriter';

const ASM_EXT = '.asm';
const args: string[] = process.argv.slice(2);


function isVMExtension(fname: string): boolean  {
  const extension = fname.split('.').pop();
  return extension === 'vm';
}

async function translateVMFile(vmFile: string, writer: CodeWriter) {
  const parser = new Parser();

  await parser.setVMFile(vmFile);

  while (parser.hasMoreCommands()) {
    const c = parser.commandType()

    switch(c) {
    case "C_ARITHMETIC":
      await writer.writeArithmetic(parser.arg1());
      break;
    case "C_PUSH":
      case "C_POP":
      await writer.writePushPop(c, parser.arg1(), parser.arg2());
      break;
    case "C_LABEL":
      break;
    case "C_GOTO":
      break;
    case "C_IF":
      break;
    case "C_FUNCTION":
      break;
    case "C_CALL":
      break;
    case "C_RETURN":
      break;
    }
    parser.advance();
  }
}

/*
 * Main program:
 */
async function main(argument: string):Promise<void> {

  if (args.length !== 1) {
    throw new Error(`Usage: VMTranslator [*.vm || folder/>]`);
  } 
  
  const stat = await fsPromises.stat(argument);

  if (stat.isFile() && isVMExtension(argument)) {
    await fsPromises.access(path.dirname(argument), fsPromises.constants.W_OK);

    const outputFile = path.join(path.dirname(argument), path.basename(argument, path.extname(argument)) + ASM_EXT);
    const writer = new CodeWriter(outputFile);
    await translateVMFile(argument, writer);

  } else if (stat.isDirectory()) {
    
  } else {
    throw new Error(`The file ${argument} does not have a vm extension`);
  }
}

main(args[0]).catch(console.error);
