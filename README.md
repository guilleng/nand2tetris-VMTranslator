VMTranslator from Nand2Tetris
=============================

A JavaScript implementation of the VMTranslator, adhering to the specified API
outlined in Projects 7 and 8 of the [NandToTetris](https://www.nand2tetris.org/)
course.


Development Approach
--------------------

Built using the Node.js runtime with TypeScript.  Unit testing leveraged by the
`mocha` framework.  The script `tests/compare.sh` runs the translator on each
testing program and runs the supplied `CPUEmulator` command to test the outputs
produced.

```sh
$ npm test            # Run unit tests and comparison script.
$ npm run compare     # Run the comparison script.
```


Usage
-----

Install dependencies, transpile and set executable permissions on the script:

```bash
$ npm install
$ npx tsc && chmod +x ./dist/VMTranslator.js
$ ./dist/VMTranslator.js <input file/folder>
```
