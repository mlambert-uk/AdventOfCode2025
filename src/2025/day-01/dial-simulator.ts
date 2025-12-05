/**
 * DialSimulator - Simulate dial rotations on circular dial (0-99)
 * 
 * Applies rotation instructions to a dial starting at position 50.
 * Tracks position, history, and counts occurrences of landing on position 0.
 */

import { Rotation, DialState, SolutionResult } from './types';
import { normalize, rotate } from '../../lib/common/math-utils';

/**
 * Simulates a dial with positions 0-99
 * 
 * Starting position: 50
 * Tracks position after each rotation and counts landings on 0
 */
export class DialSimulator {
  /** Current dial state */
  private state: DialState;

  /** Initial state for reset */
  private initialState: DialState;

  /**
   * Initialize simulator with default starting state
   * 
   * Position: 50
   * Zero count: 0
   * History: [50]
   */
  constructor() {
    this.initialState = {
      currentPosition: 50,
      zeroCount: 0,
      history: [50]
    };

    this.state = { ...this.initialState, history: [...this.initialState.history] };
  }

  /**
   * Apply a single rotation instruction
   * 
   * Updates position, tracks in history, increments zero count if landing on 0.
   * 
   * @param rotation - Rotation instruction (direction + distance)
   * @throws Error if rotation is invalid
   * 
   * @example
   * simulator.applyRotation({ direction: 'L', distance: 68 });
   */
  public applyRotation(rotation: Rotation): void {
    if (!rotation || rotation.direction === undefined || rotation.distance === undefined) {
      throw new Error('Invalid rotation: must have direction and distance');
    }

    // Calculate new position using rotation helper
    const newPosition = rotate(this.state.currentPosition, rotation.direction, rotation.distance);

    // Update current position
    this.state.currentPosition = newPosition;

    // Track in history
    this.state.history.push(newPosition);

    // Check if landed on 0
    if (newPosition === 0) {
      this.state.zeroCount++;
    }
  }

  /**
   * Count how many times the dial will point at 0 during a rotation (including clicks during movement)
   *
   * This counts clicks that cause the dial to land on 0 while moving from `pos` in `direction`
   * for `distance` clicks. It does not count the starting position.
   */
  private countZerosDuringRotation(pos: number, direction: Rotation['direction'], distance: number): number {
    if (distance <= 0) return 0;

    // For right rotations, the k (1..distance) that makes (pos + k) % 100 === 0
    // For left rotations, the k that makes (pos - k) % 100 === 0
    // Compute the residue r in [0,99] that k must be congruent to.
    const r = direction === 'R' ? ((100 - (pos % 100)) % 100) : (pos % 100);

    if (r === 0) {
      // k values: 100, 200, ... <= distance
      return Math.floor(distance / 100);
    }

    if (r > distance) return 0;

    return 1 + Math.floor((distance - r) / 100);
  }

  /**
   * Apply a sequence of rotations
   * 
   * Applies each rotation in order and returns final result.
   * Supports an optional `method` option:
   *  - 'end' (default): count only landings at the end of each rotation
   *  - 'all': count any click that causes the dial to point at 0 during rotations
   *
   * @param rotations - Array of rotation instructions
   * @param options - Optional method selection
   * @returns SolutionResult with password, history, and total rotations
   */
  public applyRotations(rotations: Rotation[], options?: { method?: 'end' | 'all' }): SolutionResult {
    const method = options?.method ?? 'end';

    for (const rotation of rotations) {
      if (method === 'all') {
        // Count intermediate zero hits (during the click sequence)
        const hits = this.countZerosDuringRotation(this.state.currentPosition, rotation.direction, rotation.distance);
        this.state.zeroCount += hits;

        // Then perform the rotation to update position/history as before
        const newPosition = rotate(this.state.currentPosition, rotation.direction, rotation.distance);
        this.state.currentPosition = newPosition;
        this.state.history.push(newPosition);
        // Note: if the final position is 0, countZerosDuringRotation already included it when appropriate
      } else {
        this.applyRotation(rotation);
      }
    }

    return {
      password: this.state.zeroCount,
      dialHistory: [...this.state.history],
      totalRotations: rotations.length
    };
  }

  /**
   * Reset simulator to initial state
   * 
   * Useful for solving multiple puzzles or variations.
   * 
   * @example
   * simulator.reset();
   */
  public reset(): void {
    this.state = {
      currentPosition: this.initialState.currentPosition,
      zeroCount: this.initialState.zeroCount,
      history: [...this.initialState.history]
    };
  }

  /**
   * Get current dial position [0, 99]
   */
  public getCurrentPosition(): number {
    return this.state.currentPosition;
  }

  /**
   * Get count of zero landings so far
   */
  public getZeroCount(): number {
    return this.state.zeroCount;
  }

  /**
   * Get complete position history including initial position
   * 
   * @returns Array where history[i] is position after rotation i
   */
  public getHistory(): number[] {
    return [...this.state.history];
  }
}
