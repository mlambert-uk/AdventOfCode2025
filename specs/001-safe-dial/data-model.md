# Data Model: Safe Dial Password Cracker

## Domain Entities

### Rotation

Represents a single dial rotation instruction from the puzzle input.

**Definition**:
```typescript
interface Rotation {
  direction: 'L' | 'R';
  distance: number;
}
```

**Properties**:
- `direction`: 'L' for left (toward lower numbers), 'R' for right (toward higher numbers)
- `distance`: Number of clicks to rotate in the specified direction (0-999 range expected)

**Constraints**:
- Direction MUST be exactly 'L' or 'R' (case-sensitive)
- Distance MUST be a non-negative integer
- Distance MUST be less than 1000 (reasonable upper bound)

**Example**:
```typescript
const rotation1: Rotation = { direction: 'L', distance: 68 };
const rotation2: Rotation = { direction: 'R', distance: 48 };
```

---

### DialState

Internal state of the dial simulator tracking position, zero count, and history.

**Definition**:
```typescript
interface DialState {
  currentPosition: number;    // Current position on dial (0-99)
  zeroCount: number;          // Total times dial has pointed at 0
  history: number[];          // Position after each rotation
}
```

**Properties**:
- `currentPosition`: Current position on the dial (0-99 inclusive)
- `zeroCount`: Running count of how many times position 0 has been reached
- `history`: Array of positions after each rotation (for debugging/validation)

**Invariants**:
- `currentPosition` is always in range [0, 99]
- `zeroCount` is always ≥ 0
- `history.length` equals the number of rotations applied
- `history[i]` equals dial position after rotation i

**Initial State**:
```typescript
{
  currentPosition: 50,
  zeroCount: 0,
  history: [50]  // Include initial position
}
```

---

### ParsedInput

Result of parsing the puzzle input file.

**Definition**:
```typescript
interface ParsedInput {
  rotations: Rotation[];
  lineCount: number;
  errorLines?: { lineNumber: number; error: string }[];
}
```

**Properties**:
- `rotations`: Array of successfully parsed Rotation objects
- `lineCount`: Total number of lines in input file
- `errorLines`: Optional array of parse errors (line number and error message)

**Invariants**:
- `rotations.length <= lineCount`
- If all lines parsed successfully, `errorLines` is undefined or empty

---

## Relationships

```
Input File
    ↓
RotationParser (parses)
    ↓
ParsedInput { rotations: Rotation[] }
    ↓
DialSimulator (processes)
    ↓
DialState (updated per rotation)
    ↓
Output: zeroCount (the password)
```

## Behavioral Contracts

### Dial Rotation Mathematics

For a circular dial with positions 0-99:

**Left Rotation** (toward lower numbers):
```
newPosition = (currentPosition - distance) % 100
```

**Right Rotation** (toward higher numbers):
```
newPosition = (currentPosition + distance) % 100
```

**Modulo Handling** (JavaScript %):
JavaScript's modulo operator preserves sign of dividend:
- `-18 % 100 = -18` in JavaScript
- Must normalize to 0-99 range: `((n % 100) + 100) % 100`

**Wrap-Around Examples**:
- Position 0, L1 → (0 - 1) % 100 = -1 → normalized = 99 ✓
- Position 99, R1 → (99 + 1) % 100 = 0 ✓
- Position 50, L68 → (50 - 68) % 100 = -18 → normalized = 82 ✓
- Position 82, L30 → (82 - 30) % 100 = 52 ✓

---

## Type Definitions

```typescript
// src/2025/day-01/types.ts

export interface Rotation {
  direction: 'L' | 'R';
  distance: number;
}

export interface DialState {
  currentPosition: number;
  zeroCount: number;
  history: number[];
}

export interface ParsedInput {
  rotations: Rotation[];
  lineCount: number;
  errorLines?: { lineNumber: number; error: string }[];
}

export interface SolutionResult {
  password: number;
  dialHistory: number[];
  totalRotations: number;
}
```

---

## Parsing Rules

### Input Format

Each line contains:
- Direction: Single character 'L' or 'R'
- Distance: One or more digits (0-999)
- Whitespace: Allowed before/after, should be trimmed

**Valid Examples**:
```
L68
R48
  L30  (with leading spaces)
R5    (with trailing spaces)
```

**Invalid Examples**:
```
l68       (lowercase l)
Left 68   (spelled out)
68L       (wrong order)
L-68      (negative distance)
L 68      (space in middle)
```

### Parsing Algorithm

```
For each line in input:
  1. Trim whitespace
  2. Extract first character as direction (must be L or R)
  3. Parse remaining as integer distance
  4. Validate distance is non-negative
  5. Create Rotation object or add to errorLines
```

---

## State Transitions

```
Initial State
  ↓ Rotation 1 (L68)
Position: 50 → 82, zeroCount: 0
  ↓ Rotation 2 (L30)
Position: 82 → 52, zeroCount: 0
  ↓ Rotation 3 (R48)
Position: 52 → 0, zeroCount: 1 ← ZERO HIT
  ↓ Rotation 4 (L5)
Position: 0 → 95, zeroCount: 1
  ↓ ...
  ↓ Final State
Position: 32, zeroCount: 3 ← ANSWER
```

---

## Example Execution

**Input**:
```
L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
```

**Trace**:
| Step | Direction | Distance | Old Pos | New Pos | Zero Hit? | Count |
|------|-----------|----------|---------|---------|-----------|-------|
| 0    | -         | -        | -       | 50      | -         | 0     |
| 1    | L         | 68       | 50      | 82      | No        | 0     |
| 2    | L         | 30       | 82      | 52      | No        | 0     |
| 3    | R         | 48       | 52      | 0       | **Yes**   | **1** |
| 4    | L         | 5        | 0       | 95      | No        | 1     |
| 5    | R         | 60       | 95      | 55      | No        | 1     |
| 6    | L         | 55       | 55      | 0       | **Yes**   | **2** |
| 7    | L         | 1        | 0       | 99      | No        | 2     |
| 8    | L         | 99       | 99      | 0       | **Yes**   | **3** |
| 9    | R         | 14       | 0       | 14      | No        | 3     |
| 10   | L         | 82       | 14      | 32      | No        | 3     |

**Result**: Password = 3 ✓
