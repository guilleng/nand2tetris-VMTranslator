import {strict as assert } from 'assert';
import { Parser, CommandType } from '../src/Parser';

describe('Parser Module', () => {
  let parserStrings:any;
  let parserCommands:any;
  beforeEach(async () => { 
    parserStrings = await new Parser(); 
    parserStrings.setVMFile('./test/resources/ParserStrings.vm') 
  });
  beforeEach(async () => { 
    parserCommands = new Parser(); 
    await parserCommands.setVMFile('./test/resources/ParserCommands.vm') 
  });

  describe('Initialization Test', () => {
    it('loads a .vm file striping it of comments and withe spaces', () => {
      let targetContents = [
          'valid command 1',
          'valid command 2',
          'another valid command 0',
          'end',
      ];

      assert.deepEqual(parserStrings.allCode, targetContents);
    });
  });


  describe('Public Interface Tests', () => {
    it('hasMoreCommand() returns true only if there are lines left to process', () => {
      assert.equal(parserStrings.hasMoreCommands(), true);
      parserStrings.advance();
      parserStrings.advance();
      parserStrings.advance();
      parserStrings.advance();
      assert.equal(parserStrings.hasMoreCommands(), false);
    });

    it('advance() moves the parser to the next line of vm code', () => {
      assert.deepEqual(parserStrings.currentLine, 'valid command 1');
      parserStrings.advance();
      parserStrings.advance();
      assert.deepEqual(parserStrings.currentLine, 'another valid command 0');
      parserStrings.advance();
      parserStrings.advance();
      assert.equal(parserStrings.hasMoreCommands(), false);
    });

    it('commandType() method tests', () => {
      assert.throws(() => parserStrings.commandType());
      assert.equal(parserCommands.commandType(), "C_PUSH");
      parserCommands.advance();
      assert.equal(parserCommands.commandType(), "C_PUSH");
      parserCommands.advance();
      assert.equal(parserCommands.commandType(), "C_ARITHMETIC");
      parserCommands.advance();
      assert.throws(() => parserCommands.commandType());
    });

    it('arg1() and arg2() methods tests', () => {
      parserCommands.commandType();
      assert.equal(parserCommands.arg1(), "constant");
      assert.equal(parserCommands.arg2(), 7);
      parserCommands.advance();
      parserCommands.commandType();
      assert.equal(parserCommands.arg1(), "constant");
      assert.equal(parserCommands.arg2(), 8);
      parserCommands.advance();
      parserCommands.commandType();
      assert.equal(parserCommands.arg1(), "add");
    });

  });
});
