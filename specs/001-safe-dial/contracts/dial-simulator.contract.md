# Contract: DialSimulator

## Interface

```typescript
interface IDialSimulator {
  applyRotation(rotation: Rotation): void;
  applyRotations(rotations: Rotation[]): SolutionResult;
  reset(): void;
  getCurrentPosition(): number;
  getZeroCount(): number;
  getHistory(): number[];
}
```

## Responsibility

Simulate dial rotations on a circular dial (0-99), tracking position changes and counting occurrences of position 0.

## Input Specification

### Rotation Input

```typescript
interface Rotation {
  direction: 'L' | 'R';
  distance: number;
}
```

- **direction**: 'L' = left (toward lower numbers), 'R' = right (toward higher numbers)
- **distance**: Non-negative integer clicks to rotate

### Initial State

- **Position**: 50
- **Zero Count**: 0
- **History**: [50]

## Output Specification

### SolutionResult

```typescript
interface SolutionResult {
  password: number;          // Final zero count (the answer)
  dialHistory: number[];     // Position after each rotation
  totalRotations: number;    // Number of rotations applied
}
```

## Rotation Mathematics

### Circular Dial Properties

- Dial has positions 0-99 (100 total positions)
- Positions form a circle: ...98, 99, 0, 1, 2...
- Left (L): Move toward lower numbers
- Right (R): Move toward higher numbers

### Formula

For each rotation:

```
if direction == 'L':
  newPosition = normalize((currentPosition - distance) % 100)
else (direction == 'R'):
  newPosition = normalize((currentPosition + distance) % 100)

where normalize(n) = ((n % 100) + 100) % 100
  to handle JavaScript's signed modulo
```

### Examples

| Current | Direction | Distance | Calculation | New Position | Zero? |
|---------|-----------|----------|---|---|---|
| 50 | L | 68 | (50 - 68) % 100 = -18 → 82 | 82 | No |
| 82 | L | 30 | (82 - 30) % 100 = 52 | 52 | No |
| 52 | R | 48 | (52 + 48) % 100 = 0 | 0 | **Yes** |
| 0 | L | 5 | (0 - 5) % 100 = -5 → 95 | 95 | No |
| 95 | R | 60 | (95 + 60) % 100 = 55 | 55 | No |
| 55 | L | 55 | (55 - 55) % 100 = 0 | 0 | **Yes** |
| 0 | L | 1 | (0 - 1) % 100 = -1 → 99 | 99 | No |
| 99 | L | 99 | (99 - 99) % 100 = 0 | 0 | **Yes** |
| 0 | R | 14 | (0 + 14) % 100 = 14 | 14 | No |
| 14 | L | 82 | (14 - 82) % 100 = -68 → 32 | 32 | No |

## Behaviors & Test Cases

### Single Rotation Tests

```typescript
describe('DialSimulator - Single Rotations', () => {
  test('rotates left correctly', () => {
    const sim = new DialSimulator();
    sim.applyRotation({ direction: 'L', distance: 68 });
    expect(sim.getCurrentPosition()).toBe(82);
    expect(sim.getZeroCount()).toBe(0);
  });

  test('rotates right correctly', () => {
    const sim = new DialSimulator();
    sim.applyRotation({ direction: 'R', distance: 48 });
    expect(sim.getCurrentPosition()).toBe(98);  // 50 + 48 = 98
    expect(sim.getZeroCount()).toBe(0);
  });

  test('detects landing on zero', () => {
    const sim = new DialSimulator();
    sim.applyRotation({ direction: 'R', distance: 50 });
    expect(sim.getCurrentPosition()).toBe(0);
    expect(sim.getZeroCount()).toBe(1);
  });

  test('handles wrap-around from 0 left', () => {
    const sim = new DialSimulator();
    sim.applyRotation({ direction: 'R', distance: 50 });  // 50 → 0
    sim.applyRotation({ direction: 'L', distance: 1 });   // 0 → 99
    expect(sim.getCurrentPosition()).toBe(99);
    expect(sim.getZeroCount()).toBe(1);  // Not incremented
  });

  test('handles wrap-around from 99 right', () => {
    const sim = new DialSimulator();
    sim.applyRotation({ direction: 'L', distance: 1 });   // 50 → 49
    sim.applyRotation({ direction: 'L', distance: 50 });  // 49 → -1 → 99
    sim.applyRotation({ direction: 'R', distance: 1 });   // 99 → 0
    expect(sim.getCurrentPosition()).toBe(0);
    expect(sim.getZeroCount()).toBe(1);
  });

  test('handles zero distance', () => {
    const sim = new DialSimulator();
    const before = sim.getCurrentPosition();
    sim.applyRotation({ direction: 'L', distance: 0 });
    expect(sim.getCurrentPosition()).toBe(before);
  });

  test('handles large distances', () => {
    const sim = new DialSimulator();
    sim.applyRotation({ direction: 'R', distance: 250 });  // (50 + 250) % 100 = 300 % 100 = 0
    expect(sim.getCurrentPosition()).toBe(0);
    expect(sim.getZeroCount()).toBe(1);
  });
});
```

### Sequence Tests

```typescript
describe('DialSimulator - Rotation Sequences', () => {
  test('processes example sequence correctly', () => {
    const sim = new DialSimulator();
    const rotations = [
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

    const result = sim.applyRotations(rotations);
    expect(result.password).toBe(3);
    expect(result.totalRotations).toBe(10);
    expect(result.dialHistory).toHaveLength(11);  // Initial + 10 rotations
  });

  test('tracks history correctly', () => {
    const sim = new DialSimulator();
    const rotations = [
      { direction: 'R', distance: 50 },   // 50 → 0
      { direction: 'L', distance: 5 }     // 0 → 95
    ];

    const result = sim.applyRotations(rotations);
    expect(result.dialHistory).toEqual([50, 0, 95]);  // Initial, after R50, after L5
  });

  test('counts multiple zero landings', () => {
    const sim = new DialSimulator();
    const rotations = [
      { direction: 'R', distance: 50 },   // 50 → 0
      { direction: 'L', distance: 0 },    // 0 → 0
      { direction: 'L', distance: 100 }   // 0 → 0
    ];

    const result = sim.applyRotations(rotations);
    expect(result.password).toBe(3);  // Lands on 0 three times
  });

  test('handles empty rotation sequence', () => {
    const sim = new DialSimulator();
    const result = sim.applyRotations([]);
    expect(result.password).toBe(0);
    expect(result.totalRotations).toBe(0);
    expect(result.dialHistory).toEqual([50]);  // Only initial position
  });
});
```

### State Management Tests

```typescript
describe('DialSimulator - State Management', () => {
  test('reset restores initial state', () => {
    const sim = new DialSimulator();
    sim.applyRotation({ direction: 'R', distance: 50 });
    expect(sim.getCurrentPosition()).toBe(0);

    sim.reset();
    expect(sim.getCurrentPosition()).toBe(50);
    expect(sim.getZeroCount()).toBe(0);
    expect(sim.getHistory()).toEqual([50]);
  });

  test('maintains position invariant (0-99)', () => {
    const sim = new DialSimulator();
    for (let i = 0; i < 100; i++) {
      sim.applyRotation({ direction: 'L', distance: 1 });
      const pos = sim.getCurrentPosition();
      expect(pos).toBeGreaterThanOrEqual(0);
      expect(pos).toBeLessThanOrEqual(99);
    }
  });
});
```

## Performance Guarantees

- Process up to 100,000 rotations in <1 second
- Memory: O(n) for history storage (linear with rotation count)
- Per-rotation cost: O(1) - constant time modulo arithmetic

## Contracts with Caller

1. Caller MUST initialize with no arguments (uses default state)
2. Caller MUST provide valid `Rotation` objects
3. Simulator MUST track position in [0, 99] range
4. Simulator MUST count zero landings accurately
5. Simulator MUST preserve history in order
6. Caller MAY reset between problem variations

## Error Handling

- Invalid rotation objects: Throw `Error`
- Null/undefined rotations: Throw `Error`
- Out-of-range positions (internal bug): Throw assertion error

## Implementation Notes

- Use modulo arithmetic for wrap-around
- Handle JavaScript's signed % operator with normalization
- Consider optimization: Can strip history if not needed (future)
