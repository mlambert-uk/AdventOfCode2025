/**
 * Type definitions for Safe Dial Password Cracker
 * 
 * Domain model entities representing rotation instructions and dial state.
 */

/**
 * Single rotation instruction from puzzle input
 * 
 * @example
 * const rotation: Rotation = { direction: 'L', distance: 68 };
 */
export interface Rotation {
  /** L = left (toward lower numbers), R = right (toward higher numbers) */
  direction: 'L' | 'R';
  /** Number of clicks to rotate in specified direction */
  distance: number;
}

/**
 * Internal state of dial simulator
 * 
 * Tracks current position, count of zero landings, and history for debugging.
 */
export interface DialState {
  /** Current position on dial [0, 99] */
  currentPosition: number;
  /** Total times dial has pointed at position 0 */
  zeroCount: number;
  /** Position after each rotation (for debugging) */
  history: number[];
}

/**
 * Result of parsing puzzle input file
 */
export interface ParsedInput {
  /** All successfully parsed rotation instructions */
  rotations: Rotation[];
  /** Total number of lines in input file */
  lineCount: number;
  /** Optional array of parse errors (line number + message) */
  errorLines?: { lineNumber: number; error: string }[];
}

/**
 * Final solution result
 */
export interface SolutionResult {
  /** The password (count of zero landings) */
  password: number;
  /** Position after each rotation */
  dialHistory: number[];
  /** Total number of rotations applied */
  totalRotations: number;
}
