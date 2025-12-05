# Quickstart: Safe Dial Password Cracker

## Overview

This is a Node.js + TypeScript solution to Advent of Code 2025, Day 1: Secret Entrance.

**Problem**: Simulate dial rotations on a circular 0-99 dial and count how many times the dial lands on position 0.

**Example Answer**: For the provided example sequence, the password is **3**.

## Prerequisites

- Node.js 20+ (includes npm)
- TypeScript 5.x (installed as dev dependency)

## Setup

### 1. Install Dependencies

```bash
cd /home/mark/Code/AdventOfCode
npm install
```

This installs:
- `typescript` - TypeScript compiler
- `jest` - Test runner
- `ts-node` - Run TypeScript directly
- `@types/jest` - Jest type definitions
- `@types/node` - Node.js type definitions

### 2. Configure TypeScript

Verify `tsconfig.json` exists and is configured:

```bash
npx tsc --version
```

### 3. Verify Project Structure

```
src/
├── 2025/
│   └── day-01/
│       ├── solution.ts
│       ├── parser.ts
│       ├── dial-simulator.ts
│       └── types.ts
└── lib/
    └── common/
        └── file-reader.ts

tests/
├── unit/
│   ├── parser.test.ts
│   ├── dial-simulator.test.ts
│   └── math-utils.test.ts
└── fixtures/
    ├── example.txt
    └── sample.txt
```

## Building

### Compile TypeScript to JavaScript

```bash
npm run build
```

This runs:
```bash
tsc
```

Output goes to `dist/` directory.

### Watch Mode (Development)

```bash
npm run dev
```

TypeScript compiler automatically recompiles on file changes.

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Specific Test Suite

```bash
npm test -- parser.test.ts
npm test -- dial-simulator.test.ts
```

### Generate Coverage Report

```bash
npm test -- --coverage
```

Expected coverage: >90% for core logic.

## Running the Solution

### Method 1: Compiled JavaScript

```bash
npm run build
node dist/src/2025/day-01/solution.js <input-file>
```

### Method 2: Direct TypeScript (ts-node)

```bash
npx ts-node src/2025/day-01/solution.ts <input-file>
```

### Method 3: Via npm Script

```bash
npm run solve -- <input-file>
```

(Assuming `solve` script is defined in package.json)

## Example Usage

### Using the Provided Example

```bash
# Create example input file
cat > /tmp/example.txt << 'EOF'
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
EOF

# Run the solution
npx ts-node src/2025/day-01/solution.ts /tmp/example.txt
```

**Expected Output**:
```
Password: 3
Total rotations: 10
Final position: 32
```

### Using Puzzle Input

```bash
# Copy your puzzle input from Advent of Code
cp ~/Downloads/input.txt ./specs/001-safe-dial/input.txt

# Solve
npx ts-node src/2025/day-01/solution.ts ./specs/001-safe-dial/input.txt
```

## Understanding the Solution

### How It Works

1. **Parser** reads the input file and extracts rotations
2. **DialSimulator** applies each rotation to the dial (starting at position 50)
3. **Counter** tracks how many times the dial lands on position 0
4. **Output** displays the password (zero count)

### Key Algorithm

For each rotation:
```typescript
newPosition = ((currentPosition + (direction === 'L' ? -distance : distance)) % 100 + 100) % 100

if (newPosition === 0) {
  zeroCount++
}
```

### Example Trace

```
Start: position = 50, zeroCount = 0

L68:  position = (50 - 68) % 100 = 82
L30:  position = (82 - 30) % 100 = 52
R48:  position = (52 + 48) % 100 = 0  → zeroCount = 1 ✓
L5:   position = (0 - 5) % 100 = 95
R60:  position = (95 + 60) % 100 = 55
L55:  position = (55 - 55) % 100 = 0  → zeroCount = 2 ✓
L1:   position = (0 - 1) % 100 = 99
L99:  position = (99 - 99) % 100 = 0  → zeroCount = 3 ✓
R14:  position = (0 + 14) % 100 = 14
L82:  position = (14 - 82) % 100 = 32

Final password = 3 ✓
```

## Development Workflow

### 1. Write Tests First (TDD)

```bash
# Create test file
touch tests/unit/my-feature.test.ts

# Edit test file with failing tests
# Run tests (they fail as expected)
npm test -- my-feature.test.ts
```

### 2. Implement Feature

```bash
# Create source file
touch src/2025/day-01/my-feature.ts

# Implement code to make tests pass
npm test -- my-feature.test.ts
```

### 3. Verify Code Quality

```bash
# Compile without warnings
npm run build

# Check test coverage
npm test -- --coverage
```

## Troubleshooting

### "Cannot find module 'typescript'"

```bash
npm install
```

### "Module not found: src/2025/day-01/solution"

```bash
npm run build
# Then use compiled version from dist/
```

### Tests Failing with "Unexpected token"

Ensure `jest.config.js` is configured for TypeScript:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```

### Modulo Arithmetic Errors

Verify the normalization formula for JavaScript's signed % operator:

```typescript
// JavaScript % is signed: -18 % 100 = -18
// Normalize to [0, 99] range:
const normalize = (n: number): number => ((n % 100) + 100) % 100;

console.log(normalize(-18));  // 82 ✓
console.log(normalize(100));  // 0 ✓
```

## Extending for Future Days

This project structure supports solving additional Advent of Code days:

```
src/2025/
├── day-01/
│   ├── solution.ts
│   ├── parser.ts
│   ├── dial-simulator.ts
│   └── types.ts
├── day-02/
│   ├── solution.ts
│   ├── parser.ts
│   └── [domain-specific modules]
└── day-03/
    └── [...]
```

Common utilities are in `src/lib/common/`:

```
src/lib/common/
├── file-reader.ts      # Reuse for all days
├── math-utils.ts       # Modulo, gcd, lcm, etc.
└── parsing-utils.ts    # Common parsing patterns
```

## Resources

- [Advent of Code](https://adventofcode.com/2025/day/1)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/)
- [Node.js Documentation](https://nodejs.org/docs/)

## Success Criteria ✓

- [x] Parse example input correctly
- [x] Simulate dial rotations accurately
- [x] Count zero landings: example = 3
- [x] Handle edge cases (wrap-around, zero distance)
- [x] All tests pass
- [x] Code compiles without warnings
- [x] Solve actual puzzle input in <1 second
