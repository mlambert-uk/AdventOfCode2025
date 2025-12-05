/**
 * Unit tests for DialSimulator
 * 
 * Tests dial rotation simulation on circular dial (0-99).
 * Follows test-first approach: tests written BEFORE implementation.
 */

import { DialSimulator } from '../../src/2025/day-01/dial-simulator';
import { Rotation } from '../../src/2025/day-01/types';

describe('DialSimulator', () => {
  let simulator: DialSimulator;

  beforeEach(() => {
    simulator = new DialSimulator();
  });

  describe('applyRotation() - Single rotations', () => {
    it('should rotate left correctly from starting position', () => {
      simulator.applyRotation({ direction: 'L', distance: 68 });
      expect(simulator.getCurrentPosition()).toBe(82);
    });

    it('should rotate right correctly', () => {
      // First rotate to a known position
      simulator.applyRotation({ direction: 'L', distance: 68 }); // 50 -> 82
      simulator.applyRotation({ direction: 'L', distance: 30 }); // 82 -> 52
      simulator.applyRotation({ direction: 'R', distance: 48 }); // 52 -> 0
      expect(simulator.getCurrentPosition()).toBe(0);
    });

    it('should detect landing on position 0', () => {
      simulator.applyRotation({ direction: 'L', distance: 68 }); // 50 -> 82
      expect(simulator.getZeroCount()).toBe(0);

      simulator.applyRotation({ direction: 'L', distance: 30 }); // 82 -> 52
      expect(simulator.getZeroCount()).toBe(0);

      simulator.applyRotation({ direction: 'R', distance: 48 }); // 52 -> 0
      expect(simulator.getZeroCount()).toBe(1);
    });

    it('should handle rotation from position 0 to 99 (wrap-around left)', () => {
      // First get to position 0
      simulator.applyRotation({ direction: 'R', distance: 50 }); // 50 -> 0
      expect(simulator.getZeroCount()).toBe(1);

      // Then rotate left by 1, should wrap to 99
      simulator.applyRotation({ direction: 'L', distance: 1 }); // 0 -> 99
      expect(simulator.getCurrentPosition()).toBe(99);
      expect(simulator.getZeroCount()).toBe(1); // Not incremented
    });

    it('should handle rotation from position 99 to 0 (wrap-around right)', () => {
      // Get to position 99 first: 50 - 1 = 49, then from 49 - 50 = -1 = 99
      simulator.applyRotation({ direction: 'L', distance: 1 }); // 50 -> 49
      simulator.applyRotation({ direction: 'L', distance: 50 }); // 49 -> 99

      expect(simulator.getCurrentPosition()).toBe(99);
      expect(simulator.getZeroCount()).toBe(0);

      // Then rotate right by 1, should wrap to 0
      simulator.applyRotation({ direction: 'R', distance: 1 }); // 99 -> 0
      expect(simulator.getCurrentPosition()).toBe(0);
      expect(simulator.getZeroCount()).toBe(1);
    });

    it('should handle zero distance (no rotation)', () => {
      const before = simulator.getCurrentPosition();
      simulator.applyRotation({ direction: 'L', distance: 0 });
      expect(simulator.getCurrentPosition()).toBe(before);

      simulator.applyRotation({ direction: 'R', distance: 0 });
      expect(simulator.getCurrentPosition()).toBe(before);
    });

    it('should handle large distances with wrapping', () => {
      // 50 + 250 = 300, 300 % 100 = 0
      simulator.applyRotation({ direction: 'R', distance: 250 });
      expect(simulator.getCurrentPosition()).toBe(0);
      expect(simulator.getZeroCount()).toBe(1);
    });
  });

  describe('applyRotations() - Sequences', () => {
    it('should process example sequence correctly', () => {
      const rotations: Rotation[] = [
        { direction: 'L', distance: 68 },
        { direction: 'L', distance: 30 },
        { direction: 'R', distance: 48 },
        { direction: 'L', distance: 5 },
        { direction: 'R', distance: 60 },
        { direction: 'L', distance: 55 },
        { direction: 'L', distance: 1 },
        { direction: 'L', distance: 99 },
        { direction: 'R', distance: 14 },
        { direction: 'L', distance: 82 }
      ];

      const result = simulator.applyRotations(rotations);

      expect(result.password).toBe(3);
      expect(result.totalRotations).toBe(10);
      expect(result.dialHistory).toHaveLength(11); // Initial + 10 rotations
      expect(result.dialHistory[0]).toBe(50); // Starting position
      expect(result.dialHistory[10]).toBe(32); // Final position
    });

    it('should track history correctly', () => {
      const rotations: Rotation[] = [
        { direction: 'R', distance: 50 }, // 50 -> 0
        { direction: 'L', distance: 5 }   // 0 -> 95
      ];

      const result = simulator.applyRotations(rotations);

      expect(result.dialHistory).toEqual([50, 0, 95]);
    });

    it('should count multiple zero landings', () => {
      const rotations: Rotation[] = [
        { direction: 'R', distance: 50 },   // 50 -> 0
        { direction: 'L', distance: 0 },    // 0 -> 0
        { direction: 'L', distance: 100 }   // 0 -> 0
      ];

      const result = simulator.applyRotations(rotations);

      expect(result.password).toBe(3);
      expect(result.dialHistory).toEqual([50, 0, 0, 0]);
    });

    it('should handle empty rotation sequence', () => {
      const result = simulator.applyRotations([]);

      expect(result.password).toBe(0);
      expect(result.totalRotations).toBe(0);
      expect(result.dialHistory).toEqual([50]); // Only initial position
    });

    it('should handle sequence with no zeros', () => {
      const rotations: Rotation[] = [
        { direction: 'L', distance: 1 },
        { direction: 'L', distance: 1 },
        { direction: 'L', distance: 1 }
      ];

      const result = simulator.applyRotations(rotations);

      expect(result.password).toBe(0);
      expect(result.totalRotations).toBe(3);
    });
  });

  describe('State management', () => {
    it('should maintain position invariant [0, 99]', () => {
      // Apply many rotations and verify position stays in range
      for (let i = 0; i < 100; i++) {
        simulator.applyRotation({ direction: 'L', distance: 1 });
        const pos = simulator.getCurrentPosition();
        expect(pos).toBeGreaterThanOrEqual(0);
        expect(pos).toBeLessThanOrEqual(99);
      }
    });

    it('should reset to initial state', () => {
      // Apply some rotations
      simulator.applyRotation({ direction: 'R', distance: 50 });
      expect(simulator.getCurrentPosition()).toBe(0);
      expect(simulator.getZeroCount()).toBe(1);

      // Reset
      simulator.reset();

      expect(simulator.getCurrentPosition()).toBe(50);
      expect(simulator.getZeroCount()).toBe(0);
      expect(simulator.getHistory()).toEqual([50]);
    });

    it('should provide getters for all state', () => {
      simulator.applyRotation({ direction: 'L', distance: 10 });

      const pos = simulator.getCurrentPosition();
      const count = simulator.getZeroCount();
      const history = simulator.getHistory();

      expect(typeof pos).toBe('number');
      expect(typeof count).toBe('number');
      expect(Array.isArray(history)).toBe(true);
    });
  });
});
