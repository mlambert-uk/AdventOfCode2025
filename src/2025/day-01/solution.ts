/**
 * Main solution orchestrator for Safe Dial Password Cracker
 * 
 * Combines parser, simulator, and formatting to solve the puzzle.
 */

import { RotationParser } from './parser';
import { DialSimulator } from './dial-simulator';
import { SolutionResult, PasswordMethod } from './types';

/**
 * Solve the safe dial puzzle for a given input file
 * 
 * @param inputFilePath - Path to puzzle input file
 * @returns SolutionResult with password and metadata
 * @throws Error if file cannot be read or parsed
 * 
 * @example
 * const result = await solvePuzzle('./input.txt');
 * console.log(`Password: ${result.password}`);
 */
export async function solvePuzzle(inputFilePath: string, options?: { method?: PasswordMethod }): Promise<SolutionResult> {
  // Parse input file
  const parser = new RotationParser();
  const parsedInput = await parser.parseFile(inputFilePath);

  // Check for parse errors and warn if any
  if (parsedInput.errorLines && parsedInput.errorLines.length > 0) {
    console.warn(
      `Warning: ${parsedInput.errorLines.length} parse errors in input file`
    );
    for (const error of parsedInput.errorLines) {
      console.warn(`  Line ${error.lineNumber}: ${error.error}`);
    }
  }

  // Simulate rotations with optional method (default: 'end')
  const simulator = new DialSimulator();
  const method = options?.method ?? 'end';
  const result = simulator.applyRotations(parsedInput.rotations, { method });

  return result;
}

/**
 * Format solution result for console output
 * 
 * @param result - SolutionResult from puzzle solution
 * @returns Formatted string for display
 * 
 * @example
 * const output = formatOutput(result);
 * console.log(output);
 * // Password: 3
 * // Total Rotations: 10
 * // Final Position: 32
 */
export function formatOutput(result: SolutionResult): string {
  const lines: string[] = [
    `Password: ${result.password}`,
    `Total Rotations: ${result.totalRotations}`,
    `Final Position: ${result.dialHistory[result.dialHistory.length - 1]}`
  ];

  return lines.join('\n');
}
