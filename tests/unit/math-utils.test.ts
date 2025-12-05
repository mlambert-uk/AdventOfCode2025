/**
 * Unit tests for math utility functions
 * 
 * Tests modulo normalization and rotation calculations
 */

import { normalize, rotate } from '../../src/lib/common/math-utils';

describe('Math Utilities', () => {
  describe('normalize()', () => {
    it('should leave positive numbers in range [0, 99] unchanged', () => {
      expect(normalize(0)).toBe(0);
      expect(normalize(50)).toBe(50);
      expect(normalize(99)).toBe(99);
    });

    it('should wrap numbers >= 100 into range [0, 99]', () => {
      expect(normalize(100)).toBe(0);
      expect(normalize(101)).toBe(1);
      expect(normalize(150)).toBe(50);
      expect(normalize(200)).toBe(0);
    });

    it('should wrap negative numbers into range [0, 99]', () => {
      expect(normalize(-1)).toBe(99);
      expect(normalize(-18)).toBe(82);
      expect(normalize(-50)).toBe(50);
      expect(normalize(-100)).toBe(0);
    });

    it('should handle large numbers correctly', () => {
      expect(normalize(1000)).toBe(0);
      expect(normalize(1068)).toBe(68);
      expect(normalize(-1068)).toBe(32); // (-1068 % 100 = -68) + 100 = 32
    });
  });

  describe('rotate()', () => {
    it('should rotate left correctly', () => {
      expect(rotate(50, 'L', 68)).toBe(82);
      expect(rotate(82, 'L', 30)).toBe(52);
      expect(rotate(0, 'L', 5)).toBe(95);
    });

    it('should rotate right correctly', () => {
      expect(rotate(52, 'R', 48)).toBe(0);
      expect(rotate(95, 'R', 60)).toBe(55);
      expect(rotate(0, 'R', 14)).toBe(14);
    });

    it('should handle zero distance', () => {
      expect(rotate(50, 'L', 0)).toBe(50);
      expect(rotate(50, 'R', 0)).toBe(50);
      expect(rotate(0, 'L', 0)).toBe(0);
    });

    it('should handle wrapping around edges', () => {
      // Wrap from 0 left to 99
      expect(rotate(0, 'L', 1)).toBe(99);
      // Wrap from 99 right to 0
      expect(rotate(99, 'R', 1)).toBe(0);
    });

    it('should handle large distances', () => {
      expect(rotate(50, 'R', 250)).toBe(0); // (50 + 250) % 100 = 0
      expect(rotate(50, 'L', 250)).toBe(0); // (50 - 250) = -200, -200 % 100 = 0
    });
  });
});
