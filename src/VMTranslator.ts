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
      await writer.writeLabel(parser.arg1());
      break;
    case "C_GOTO":
      await writer.writeGoto(parser.arg1());
      break;
    case "C_IF":
      await writer.writeIf(parser.arg1());
      break;
    case "C_FUNCTION":
      await writer.writeFunction(parser.arg1(), parser.arg2());
      break;
    case "C_CALL":
      await writer.writeCall(parser.arg1(), parser.arg2());
      break;
    case "C_RETURN":
      await writer.writeReturn();
      break;
    }
    parser.advance();
  }
}

/*
 * Main entry point.
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
    await fsPromises.access(argument, fsPromises.constants.W_OK);

    const outputFile = path.join(argument, path.basename(argument) + ASM_EXT);
    const dirFiles = await fsPromises.readdir(argument);
    const vmFiles = dirFiles.filter((file) => isVMExtension(file));

    if (vmFiles.length === 0) {
      throw new Error(`No vm files in ${argument}`);
    }

    const writer = new CodeWriter(outputFile);
    await writer.writeInit();

    for (const file of vmFiles) {

      writer.setFileName(file);
      await translateVMFile(argument + file, writer);
    }
  } else {
    throw new Error(`The file ${argument} does not have a vm extension`);
  }
}

main(args[0]).catch(console.error);
