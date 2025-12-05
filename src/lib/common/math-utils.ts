/**
 * Math utility functions for modulo arithmetic
 * 
 * Handles JavaScript's signed modulo operator to ensure
 * results are always in [0, 99] range for circular dial.
 */

/**
 * Normalize a number to be in [0, 99] range for circular dial
 * 
 * JavaScript's % operator preserves the sign of the dividend:
 * -18 % 100 = -18 (not 82)
 * 
 * This function normalizes to ensure positive results in [0, 99]
 * 
 * @param n - The number to normalize (can be negative or > 100)
 * @returns Normalized position in [0, 99]
 * 
 * @example
 * normalize(-18)  // returns 82
 * normalize(100)  // returns 0
 * normalize(52)   // returns 52
 */
export function normalize(n: number): number {
  return ((n % 100) + 100) % 100;
}

/**
 * Calculate new dial position after rotation
 * 
 * @param currentPosition - Starting position [0, 99]
 * @param direction - 'L' for left (subtract), 'R' for right (add)
 * @param distance - Number of clicks to rotate
 * @returns New normalized position [0, 99]
 * 
 * @example
 * rotate(50, 'L', 68)  // returns 82 (50 - 68 = -18 → 82)
 * rotate(52, 'R', 48)  // returns 0 (52 + 48 = 100 → 0)
 */
export function rotate(
  currentPosition: number,
  direction: 'L' | 'R',
  distance: number
): number {
  const delta = direction === 'L' ? -distance : distance;
  return normalize(currentPosition + delta);
}
