#!/usr/bin/env ts-node

/**
 * Advent of Code 2025 - Main CLI Entry Point
 * 
 * Provides unified CLI interface for solving daily puzzles.
 * 
 * Usage:
 *   ts-node src/index.ts <day> <input-file>
 *   npm run solve -- <day> <input-file>
 * 
 * Example:
 *   ts-node src/index.ts day-01 ./tests/fixtures/example.txt
 */

import * as fs from 'fs';
import * as path from 'path';
import { solvePuzzle, formatOutput } from './2025/day-01/solution';

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    printUsage();
    process.exit(0);
  }

  // Route to day 1 solution
  if (args[0] === 'day-01' || args[0] === '1') {
    if (args.length < 2) {
      console.error('Error: input file path required');
      printUsage();
      process.exit(1);
    }

    const inputFile = args[1];

    try {
      // Verify file exists
      if (!fs.existsSync(inputFile)) {
        console.error(`Error: File not found: ${inputFile}`);
        process.exit(1);
      }

      // Solve puzzle
      const result = await solvePuzzle(inputFile);

      // Output result
      console.log(formatOutput(result));
      process.exit(0);
    } catch (error) {
      console.error(`Error solving puzzle: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  console.error(`Error: Unknown day: ${args[0]}`);
  printUsage();
  process.exit(1);
}

/**
 * Print usage information
 */
function printUsage(): void {
  console.log(`
Advent of Code 2025 Solver

Usage:
  ts-node src/index.ts <day> <input-file>
  npm run solve -- <day> <input-file>

Days:
  day-01, 1         Day 1: Secret Entrance (Safe Dial)

Examples:
  npm run solve -- day-01 ./tests/fixtures/example.txt
  npm run solve -- 1 ./input.txt

Options:
  --help            Show this help message
`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
