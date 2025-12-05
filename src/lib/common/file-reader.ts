/**
 * File I/O utilities for reading puzzle input
 */

import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as readline from 'readline';

/**
 * Read file line-by-line asynchronously
 * 
 * Useful for processing large files without loading entire content in memory.
 * 
 * @param filePath - Path to file to read
 * @returns Promise<string[]> Array of lines (whitespace preserved)
 * @throws Error if file not found
 * 
 * @example
 * const lines = await readLinesFromFile('./input.txt');
 * lines.forEach(line => console.log(line));
 */
export async function readLinesFromFile(filePath: string): Promise<string[]> {
  // Check if file exists first
  try {
    await fsPromises.access(filePath, fs.constants.R_OK);
  } catch {
    throw new Error(`File not found or not readable: ${filePath}`);
  }

  const lines: string[] = [];

  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath, {
      encoding: 'utf-8'
    });

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    rl.on('line', (line: string) => {
      lines.push(line);
    });

    rl.on('error', (error) => {
      reject(new Error(`Error reading file: ${error.message}`));
    });

    rl.on('close', () => {
      resolve(lines);
    });
  });
}

/**
 * Read entire file as string
 * 
 * Use when you need the complete file content at once.
 * For large files, prefer readLinesFromFile.
 * 
 * @param filePath - Path to file to read
 * @returns Promise<string> Complete file content
 * @throws Error if file not found
 */
export async function readFileAsString(filePath: string): Promise<string> {
  try {
    return await fsPromises.readFile(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${(error as Error).message}`);
  }
}

/**
 * Write string content to file
 * 
 * @param filePath - Path to file to write
 * @param content - Content to write
 * @returns Promise<void>
 * @throws Error if write fails
 */
export async function writeFileAsString(
  filePath: string,
  content: string
): Promise<void> {
  try {
    await fsPromises.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${(error as Error).message}`);
  }
}
