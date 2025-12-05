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
   * Apply a sequence of rotations
   * 
   * Applies each rotation in order and returns final result.
   * 
   * @param rotations - Array of rotation instructions
   * @returns SolutionResult with password, history, and total rotations
   * 
   * @example
   * const result = simulator.applyRotations(rotations);
   * console.log(`Password: ${result.password}`);
   */
  public applyRotations(rotations: Rotation[]): SolutionResult {
    for (const rotation of rotations) {
      this.applyRotation(rotation);
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
