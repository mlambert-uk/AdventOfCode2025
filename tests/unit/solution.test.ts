/**
 * Integration tests for complete solution
 * 
 * Tests end-to-end puzzle solving from input file to result.
 */

import { solvePuzzle, formatOutput } from '../../src/2025/day-01/solution';

describe('Solution - End-to-End', () => {
  describe('solvePuzzle()', () => {
    it('should solve example.txt and return password = 3', async () => {
      const result = await solvePuzzle('./tests/fixtures/example.txt');

      expect(result.password).toBe(3);
      expect(result.totalRotations).toBe(10);
      expect(result.dialHistory).toHaveLength(11);
    });

    it('should have correct positions in example', async () => {
      const result = await solvePuzzle('./tests/fixtures/example.txt');

      expect(result.dialHistory[0]).toBe(50); // Initial position
      expect(result.dialHistory[3]).toBe(0); // After R48
      expect(result.dialHistory[6]).toBe(0); // After L55
      expect(result.dialHistory[8]).toBe(0); // After L99
      expect(result.dialHistory[10]).toBe(32); // Final position
    });

    it('should throw for non-existent file', async () => {
      await expect(
        solvePuzzle('./tests/fixtures/non-existent.txt')
      ).rejects.toThrow();
    });
  });

  describe('formatOutput()', () => {
    it('should format result correctly', async () => {
      const result = await solvePuzzle('./tests/fixtures/example.txt');
      const output = formatOutput(result);

      expect(output).toContain('Password: 3');
      expect(output).toContain('Total Rotations: 10');
      expect(output).toContain('Final Position: 32');
    });

    it('should contain all required information', async () => {
      const result = await solvePuzzle('./tests/fixtures/example.txt');
      const output = formatOutput(result);

      const lines = output.split('\n');
      expect(lines.length).toBe(3);
    });
  });
});
