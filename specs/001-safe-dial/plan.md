# Implementation Plan: Safe Dial Password Cracker

**Branch**: `001-safe-dial` | **Date**: 2025-12-05 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-safe-dial/spec.md`

**Note**: This plan uses the `/speckit.plan` command workflow.

## Summary

Parse and simulate a sequence of dial rotations (L/R with distances) on a circular 0-99 dial starting at position 50. Count how many times the dial lands on position 0. This is Advent of Code Day 1: Secret Entrance.

The example sequence (L68, L30, R48, L5, R60, L55, L1, L99, R14, L82) produces a password of 3.

## Technical Context

**Language/Version**: Node.js 20+ with TypeScript 5.x  
**Primary Dependencies**: TypeScript compiler (dev), Jest for testing (dev)  
**Storage**: File I/O (reading puzzle input file)  
**Testing**: Jest with TypeScript support  
**Target Platform**: Node.js CLI application  
**Project Type**: Single CLI application  
**Performance Goals**: Complete in <1 second for any input  
**Constraints**: <100MB memory, handle inputs up to 10k lines  
**Scale/Scope**: Single puzzle solver, extensible for future days

## Constitution Check

✅ **PASS**: Constitution alignment verified:

- ✅ **Solve-First Development**: Algorithm focuses on correctness of dial simulation logic
- ✅ **Language Flexibility**: Node.js + TypeScript chosen for this puzzle
- ✅ **Test-Driven Verification**: Test cases written with provided examples before implementation
- ✅ **Clear Documentation**: Solution will include complexity analysis and approach explanation
- ✅ **Reusable Utilities**: Rotation parser and dial simulator can be extracted for future use

## Project Structure

### Documentation (this feature)

```text
specs/001-safe-dial/
├── spec.md              # Feature specification (this file describes it)
├── plan.md              # This file (implementation plan)
├── data-model.md        # Data structures and domain model
├── quickstart.md        # Quick start guide for running solution
└── contracts/           # API contracts and interfaces
    └── rotation.contract.md
    └── dial-simulator.contract.md
```

### Source Code (repository root)

```text
src/
├── 2025/
│   └── day-01/
│       ├── solution.ts          # Main solution entry point
│       ├── parser.ts            # Rotation input parser
│       ├── dial-simulator.ts     # Dial rotation logic
│       └── types.ts             # TypeScript interfaces
├── lib/
│   └── common/
│       ├── file-reader.ts       # Shared file I/O utilities
│       └── math-utils.ts        # Modulo and wrapping utilities
└── index.ts                     # CLI entry point

tests/
├── unit/
│   ├── parser.test.ts           # Parser unit tests
│   ├── dial-simulator.test.ts   # Simulator unit tests
│   └── math-utils.test.ts       # Utility function tests
└── fixtures/
    ├── example.txt              # Example input from puzzle
    └── sample.txt               # Sample puzzle input (if provided)

package.json                      # Node.js dependencies
tsconfig.json                     # TypeScript configuration
jest.config.js                    # Jest test configuration
```

**Structure Decision**: Single Node.js project with src/ organized by year/day. Utilities extracted to lib/common/ for reuse in future days.

## Complexity Tracking

No constitution violations. Implementation follows straightforward, modular design.

| Consideration | Status | Rationale |
|---|---|---|
| Modulo arithmetic | Simple | Standard % operator handles wrapping |
| Circular dial logic | Straightforward | Position = (position + distance) % 100 with left/right direction handling |
| File I/O | Standard | Node.js fs module sufficient |

## Data Model

### Rotation Entity

```typescript
interface Rotation {
  direction: 'L' | 'R';
  distance: number;
}
```

### DialSimulator State

```typescript
interface DialState {
  currentPosition: number;
  zeroCount: number;
  history: number[];
}
```

## Algorithm Overview

### Core Logic

1. **Parse**: Read file line-by-line, extract L/R and numeric distance for each rotation
2. **Simulate**: For each rotation:
   - Calculate new position: `position = (position + (direction === 'L' ? -distance : distance)) % 100`
   - Handle negative modulo (wrap to 0-99)
   - If new position === 0, increment counter
3. **Output**: Return zero count as password

### Example Trace

```
Start: position = 50, zeroCount = 0
L68:  position = (50 - 68) % 100 = -18 % 100 = 82
L30:  position = (82 - 30) % 100 = 52
R48:  position = (52 + 48) % 100 = 0  → zeroCount = 1
L5:   position = (0 - 5) % 100 = -5 % 100 = 95
R60:  position = (95 + 60) % 100 = 55
L55:  position = (55 - 55) % 100 = 0  → zeroCount = 2
L1:   position = (0 - 1) % 100 = -1 % 100 = 99
L99:  position = (99 - 99) % 100 = 0  → zeroCount = 3
R14:  position = (0 + 14) % 100 = 14
L82:  position = (14 - 82) % 100 = -68 % 100 = 32

Final password = 3 ✓
```

## Technology Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.x
- **Testing**: Jest with @types/jest
- **Build**: TypeScript compiler (tsc)
- **File I/O**: Node.js fs module

## Development Phases

### Phase 1: Setup (Initialization)

- Create project directory structure
- Initialize package.json with dependencies (typescript, jest, ts-node)
- Configure tsconfig.json and jest.config.js
- Create src/2025/day-01/ directory

### Phase 2: Core Implementation

- Implement Rotation parser (parser.ts)
- Implement DialSimulator (dial-simulator.ts)
- Implement file reader utility (lib/common/file-reader.ts)
- Create main solution entry point (src/2025/day-01/solution.ts)

### Phase 3: Testing

- Write unit tests for parser with valid/invalid inputs
- Write unit tests for dial simulator with example rotations
- Write integration test with full example input
- Verify example produces password = 3

### Phase 4: Documentation & Polish

- Create data-model.md documenting domain entities
- Create quickstart.md with usage instructions
- Create contract files for each module
- Verify code compiles without warnings
- Ensure test coverage >90%

## Success Metrics

- ✅ Solution produces correct answer (3) for example input
- ✅ All test cases pass
- ✅ Code compiles with zero TypeScript errors/warnings
- ✅ Test coverage ≥90% of core logic
- ✅ Solution completes in <1 second
- ✅ Modular design allows easy reuse for Day 2+

## Next Steps

1. Create specification (→ spec.md created)
2. Create this plan (→ plan.md created)
3. Create data model documentation (→ data-model.md)
4. Create contracts (→ contracts/)
5. Run `/speckit.tasks` to generate implementation tasks
6. Execute tasks to implement solution
7. Run `/speckit.analyze` for consistency check
