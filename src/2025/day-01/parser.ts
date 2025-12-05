/**
 * RotationParser - Parse rotation instructions from input file
 * 
 * Converts raw text lines into strongly-typed Rotation objects.
 * Handles validation, whitespace trimming, and error collection.
 */

import { Rotation, ParsedInput } from './types';
import { readLinesFromFile } from '../../lib/common/file-reader';

/**
 * Parser for rotation instruction lines
 * 
 * Input format: [L|R][0-9]+
 * Examples: "L68", "R48", "  L30  "
 */
export class RotationParser {
  /**
   * Regular expression to match valid rotation instructions
   * 
   * Matches:
   * - First character: L or R (case-sensitive)
   * - Remaining: one or more digits
   * 
   * Examples that match: L68, R0, L999
   * Examples that don't: l68, R-5, L 68
   */
  private static readonly ROTATION_PATTERN = /^[LR]\d+$/;

  /**
   * Parse a single line into a Rotation object
   * 
   * @param line - Raw input line
   * @returns Rotation object if valid, null if invalid
   * 
   * @example
   * parseLine('L68')        // { direction: 'L', distance: 68 }
   * parseLine('  R48  ')    // { direction: 'R', distance: 48 }
   * parseLine('invalid')    // null
   */
  public parseLine(line: string): Rotation | null {
    // Trim whitespace
    const trimmed = line.trim();

    // Empty lines are invalid
    if (trimmed.length === 0) {
      return null;
    }

    // Check format with regex
    if (!RotationParser.ROTATION_PATTERN.test(trimmed)) {
      return null;
    }

    // Extract direction (first character)
    const direction = trimmed.charAt(0) as 'L' | 'R';

    // Extract and parse distance (remaining characters)
    const distanceStr = trimmed.substring(1);
    const distance = parseInt(distanceStr, 10);

    // Return parsed rotation
    return { direction, distance };
  }

  /**
   * Parse entire file of rotation instructions
   * 
   * Reads file line-by-line and parses each line.
   * Collects successful rotations and errors separately.
   * 
   * @param filePath - Path to input file
   * @returns ParsedInput with rotations array, line count, and optional errors
   * @throws Error if file cannot be read
   * 
   * @example
   * const result = await parser.parseFile('./input.txt');
   * console.log(`Parsed ${result.rotations.length} rotations`);
   * if (result.errorLines) {
   *   console.log(`${result.errorLines.length} parse errors`);
   * }
   */
  public async parseFile(filePath: string): Promise<ParsedInput> {
    const lines = await readLinesFromFile(filePath);

    const rotations: Rotation[] = [];
    const errorLines: { lineNumber: number; error: string }[] = [];

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
      const line = lines[lineNumber];
      const rotation = this.parseLine(line);

      if (rotation === null) {
        errorLines.push({
          lineNumber: lineNumber + 1, // 1-based for user-facing messages
          error: `Invalid rotation format: "${line}"`
        });
      } else {
        rotations.push(rotation);
      }
    }

    // Return result
    const result: ParsedInput = {
      rotations,
      lineCount: lines.length
    };

    // Only include errorLines if there were errors
    if (errorLines.length > 0) {
      result.errorLines = errorLines;
    }

    return result;
  }
}
