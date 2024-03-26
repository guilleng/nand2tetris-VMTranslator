#!/bin/env bash

# Assumes CPUEmulator is on $PATH.
# Translates all supplied .vm files into assembler. 
# Runs the corresponding *.tst scripts through the CPUEmulator.  

SimpleAdd="test/resources/Stage1_StackArithmetic/SimpleAdd/SimpleAdd"
StackTest="test/resources/Stage1_StackArithmetic/StackTest/StackTest"

BasicTest="test/resources/Stage2_MemoryAccess/BasicTest/BasicTest"
PointerTest="test/resources/Stage2_MemoryAccess/PointerTest/PointerTest"
StaticTest="test/resources/Stage2_MemoryAccess/StaticTest/StaticTest"

BasicLoop="test/resources/Stage3_ProgramFlow/BasicLoop/BasicLoop"
FibonacciSeries="test/resources/Stage3_ProgramFlow/FibonacciSeries/FibonacciSeries"

NestedCall="test/resources/Stage4_FunctionCalls/NestedCall/NestedCall"
SimpleFunction="test/resources/Stage4_FunctionCalls/SimpleFunction/SimpleFunction"

FibonacciElement="test/resources/Stage4_FunctionCallsBootstrap/FibonacciElement/"
NestedCallBst="test/resources/Stage4_FunctionCallsBootstrap/NestedCall/"
StaticsTest="test/resources/Stage4_FunctionCallsBootstrap/StaticsTest/"

translate_and_compare() {

  node dist/VMTranslator.js "$SimpleAdd".vm
  CPUEmulator "$SimpleAdd".tst > /dev/null 2>&1
  if [ ! $? -eq 0 ]; then                                                 
    echo "Failed test: $(basename -s .tst "$SimpleAdd")"
    exit 1
  else
    echo "Passed test: $(basename -s .tst "$SimpleAdd")"
    rm "$SimpleAdd".asm
  fi 

  node dist/VMTranslator.js "$StackTest".vm
  CPUEmulator "$StackTest".tst > /dev/null 2>&1
  if [ ! $? -eq 0 ]; then                                                 
    echo "Failed test: $(basename -s .tst "$StackTest")"
    exit 1
  else
    echo "Passed test: $(basename -s .tst "$StackTest")"
    rm "$StackTest".asm
  fi 


  # Stage 2 ####################################################################
  
  node dist/VMTranslator.js "$BasicTest".vm
  CPUEmulator "$BasicTest".tst > /dev/null 2>&1
  if [ ! $? -eq 0 ]; then                                                 
    echo "Failed test: $(basename -s .tst "$BasicTest")"
    exit 1
  else
    echo "Passed test: $(basename -s .tst "$BasicTest")"
    rm "$BasicTest".asm
  fi 

  node dist/VMTranslator.js "$PointerTest".vm
  CPUEmulator "$PointerTest".tst > /dev/null 2>&1
  if [ ! $? -eq 0 ]; then                                                 
    echo "Failed test: $(basename -s .tst "$PointerTest")"
    exit 1
  else
    echo "Passed test: $(basename -s .tst "$PointerTest")"
    rm "$PointerTest".asm
  fi 

  node dist/VMTranslator.js "$StaticTest".vm
  CPUEmulator "$StaticTest".tst > /dev/null 2>&1
  if [ ! $? -eq 0 ]; then                                                 
    echo "Failed test: $(basename -s .tst "$StaticTest")"
    exit 1
  else
    echo "Passed test: $(basename -s .tst "$StaticTest")"
    rm "$StaticTest".asm
  fi 
}

npx tsc
translate_and_compare
