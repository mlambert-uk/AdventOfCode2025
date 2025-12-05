---
description: "Task list for Safe Dial Password Cracker implementation"
---

# Tasks: Safe Dial Password Cracker

**Input**: Design documents from `/specs/001-safe-dial/`
**Prerequisites**: plan.md ✓, spec.md ✓, data-model.md ✓, contracts/ ✓

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths: `src/2025/day-01/` for Day 1 logic, `src/lib/common/` for shared utilities
- Tests: `tests/unit/` for unit tests, `tests/fixtures/` for test data

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project directory structure (`src/`, `tests/`, `src/2025/day-01/`, `src/lib/common/`, `tests/unit/`, `tests/fixtures/`)
- [ ] T002 [P] Initialize `package.json` with Node.js 20+, TypeScript 5.x, Jest, ts-node dependencies
- [ ] T003 [P] Create `tsconfig.json` with TypeScript compiler configuration (ES2020 target, module: commonjs)
- [ ] T004 [P] Create `jest.config.js` with TypeScript test configuration (preset: ts-jest)
- [ ] T005 Create `.gitignore` for Node.js project (node_modules/, dist/, coverage/)
- [ ] T006 [P] Create `.npmrc` or configure npm for consistent dependency versions
- [ ] T007 Create `src/index.ts` CLI entry point skeleton (ready for main solution integration)

**Checkpoint**: Project structure ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and shared utilities that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 [P] Create `src/2025/day-01/types.ts` with TypeScript interfaces (`Rotation`, `DialState`, `ParsedInput`, `SolutionResult`)
- [ ] T009 [P] Create `src/lib/common/math-utils.ts` with `normalize()` function for modulo arithmetic (handles JavaScript's signed % operator)
- [ ] T010 [P] Create `src/lib/common/file-reader.ts` with `readLinesFromFile()` function for reading input files asynchronously
- [ ] T011 Create `tests/fixtures/example.txt` with the example input from spec (L68, L30, R48, L5, R60, L55, L1, L99, R14, L82)
- [ ] T012 [P] Create `tests/unit/math-utils.test.ts` skeleton with test structure for validation

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Parse Rotations from Input (Priority: P1)

**Goal**: Read rotation instructions from file and parse each line into strongly-typed Rotation objects

**Independent Test**: Can parse example.txt and produce 10 valid Rotation objects with correct direction and distance values

### Tests for User Story 1 (Test-First Approach)

> **CRITICAL**: Write these tests FIRST, ensure they FAIL before implementation

- [ ] T013 [P] [US1] Create contract test `tests/unit/parser.test.ts` with test suite for `RotationParser.parseLine()`
  - Test: Parse valid "L68" → `{ direction: 'L', distance: 68 }`
  - Test: Parse valid "R48" → `{ direction: 'R', distance: 48 }`
  - Test: Parse with whitespace "  L30  " → `{ direction: 'L', distance: 30 }`
  - Test: Reject invalid "l68" (lowercase) → return null
  - Test: Reject invalid "Left 68" → return null
  - Test: Reject invalid "68L" (wrong order) → return null
  - Test: Reject empty line → return null
  - Tests for zero distance, large distances, etc.
- [ ] T014 [P] [US1] Create integration test `tests/unit/parser.test.ts` for `RotationParser.parseFile()`
  - Test: Parse example.txt → `ParsedInput` with 10 rotations, lineCount=10, no errors
  - Test: Handle file with parse errors → collect in errorLines array
  - Test: Empty file → rotations=[], lineCount=0

### Implementation for User Story 1

- [ ] T015 [US1] Implement `src/2025/day-01/parser.ts` with `RotationParser` class
  - Implement `parseLine(line: string): Rotation | null`
    - Trim whitespace
    - Extract first character as direction (L or R)
    - Parse remaining as integer distance
    - Validate format, return null if invalid
  - Implement `parseFile(filePath: string): Promise<ParsedInput>`
    - Read file line-by-line asynchronously
    - Call `parseLine()` for each line
    - Collect valid rotations and error lines
    - Return `ParsedInput` object with rotations, lineCount, errorLines

**Checkpoint**: User Story 1 complete - file parsing works independently

---

## Phase 4: User Story 2 - Simulate Dial Rotation (Priority: P1)

**Goal**: Apply rotation instructions to a circular dial (0-99) starting at position 50, tracking positions

**Independent Test**: Can apply example rotations and produce correct positions (50→82→52→0→95→55→0→99→0→14→32)

### Tests for User Story 2 (Test-First Approach)

> **CRITICAL**: Write these tests FIRST, ensure they FAIL before implementation

- [ ] T016 [P] [US2] Create unit test `tests/unit/dial-simulator.test.ts` for single rotations
  - Test: Rotate left from 50 by 68 → position = 82
  - Test: Rotate left from 82 by 30 → position = 52
  - Test: Rotate right from 52 by 48 → position = 0
  - Test: Rotate left from 0 by 5 → position = 95 (wrap-around)
  - Test: Rotate right from 99 by 1 → position = 0 (wrap-around)
  - Test: Zero distance rotation → position unchanged
  - Test: Large distance (>100) rotates correctly via modulo
- [ ] T017 [P] [US2] Create unit test `tests/unit/dial-simulator.test.ts` for rotation sequences
  - Test: Apply example sequence (10 rotations) → final position = 32
  - Test: Position history tracked correctly → [50, 82, 52, 0, 95, 55, 0, 99, 0, 14, 32]
  - Test: Empty rotation sequence → position = 50, history = [50]
- [ ] T018 [P] [US2] Create unit test `tests/unit/dial-simulator.test.ts` for state management
  - Test: Reset restores initial state (position=50, zeroCount=0, history=[50])
  - Test: Position invariant maintained (always in [0, 99])

### Implementation for User Story 2

- [ ] T019 [US2] Implement `src/2025/day-01/dial-simulator.ts` with `DialSimulator` class
  - Constructor: Initialize with position=50, zeroCount=0, history=[50]
  - Implement `applyRotation(rotation: Rotation): void`
    - Calculate newPosition using modulo: `((position + (direction === 'L' ? -distance : distance)) % 100 + 100) % 100`
    - Track position in history array
    - If newPosition === 0, increment zeroCount
  - Implement `applyRotations(rotations: Rotation[]): SolutionResult`
    - Apply each rotation sequentially
    - Return `{ password: zeroCount, dialHistory: history, totalRotations: rotations.length }`
  - Implement `reset(): void` - restore initial state
  - Implement getters: `getCurrentPosition()`, `getZeroCount()`, `getHistory()`

**Checkpoint**: User Story 2 complete - dial rotation simulation works independently

---

## Phase 5: User Story 3 - Count Password (Priority: P1)

**Goal**: Count total occurrences of position 0 and output as password

**Independent Test**: Process example sequence → password = 3

### Tests for User Story 3 (Test-First Approach)

> **CRITICAL**: Write these tests FIRST, ensure they FAIL before implementation

- [ ] T020 [P] [US3] Create integration test `tests/unit/dial-simulator.test.ts` for zero counting
  - Test: Example sequence lands on 0 exactly 3 times → password = 3
  - Test: Sequence with no zeros → password = 0
  - Test: Sequence where dial lands on 0 multiple times → each landing counted
  - Test: Starting position 50 → zero landing only from rotation, not initial
- [ ] T021 [P] [US3] Create end-to-end test `tests/unit/solution.test.ts`
  - Test: Parse example.txt, simulate rotations, get password = 3
  - Test: Verify all user stories work together

### Implementation for User Story 3

- [ ] T022 [US3] Implement `src/2025/day-01/solution.ts` main solution orchestration
  - Implement `solvePuzzle(inputFilePath: string): Promise<SolutionResult>`
    - Use `RotationParser.parseFile()` to parse input
    - Use `DialSimulator.applyRotations()` to simulate
    - Return result with password
  - Implement `formatOutput(result: SolutionResult): string`
    - Return user-friendly output: "Password: {password}", "Rotations: {count}", "Final position: {pos}"
  - Implement error handling for file not found, parse errors
- [ ] T023 [US3] Implement CLI entry point in `src/index.ts`
  - Accept command-line argument: input file path
  - Call `solvePuzzle()` with provided path (or use default example.txt)
  - Output formatted result to console
  - Handle errors gracefully with exit codes

**Checkpoint**: All user stories complete - full solution works end-to-end

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories and project quality

- [ ] T024 [P] Run `npm run build` and verify zero TypeScript compilation errors/warnings
- [ ] T025 [P] Run `npm test` and verify all tests pass (T013, T014, T016, T017, T018, T020, T021)
- [ ] T026 [P] Run `npm test -- --coverage` and verify >90% test coverage of core logic
- [ ] T027 Create `tests/fixtures/edge-cases.txt` with edge case inputs (empty file, zero distances, large distances)
- [ ] T028 [P] Add additional edge case tests in `tests/unit/dial-simulator.test.ts` (boundary conditions)
- [ ] T029 Verify solution with actual puzzle input (substitute real input.txt and verify runs in <1 second)
- [ ] T030 Update `src/index.ts` to support both `ts-node` and compiled JavaScript execution
- [ ] T031 [P] Create npm scripts in `package.json`:
  - `npm run build` → `tsc`
  - `npm test` → `jest`
  - `npm run dev` → `tsc --watch`
  - `npm run solve -- <file>` → `ts-node src/index.ts`
- [ ] T032 Add comprehensive inline code documentation (JSDoc comments on public APIs)
- [ ] T033 Create `SOLUTION.md` in feature directory with:
  - Algorithm explanation
  - Complexity analysis (O(n) time, O(n) space)
  - How to run solution
  - Example output walkthrough
- [ ] T034 Verify `quickstart.md` is accurate and working
- [ ] T035 Run quickstart.md validation: `npm install`, `npm run build`, `npm test`, `npm run solve`
- [ ] T036 Final cleanup: Remove console.logs, ensure code style consistent

**Checkpoint**: Solution is polished, tested, documented, and production-ready

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion (needs parsed rotations)
- **User Story 3 (Phase 5)**: Depends on User Story 2 completion (needs simulator)
- **Polish (Phase 6)**: Depends on all user stories being complete

### Within User Stories: Test-First

For each user story phase:
1. Write all tests (FIRST)
2. Verify tests FAIL (RED)
3. Implement code (GREEN)
4. Run tests until PASS
5. Story complete

### Parallel Opportunities

- **Phase 1 Setup (T002, T003, T004, T006)**: Can run in parallel (different files, no cross-dependencies)
- **Phase 2 Foundational (T008, T009, T010, T012)**: Can run in parallel
- **Phase 3 Tests (T013, T014)**: Can write in parallel
- **Phase 6 Polish (T024, T025, T026, T028, T031)**: Can run in parallel

### Sequential Dependencies

- T001 (directory structure) must complete before T002-T007
- T008-T010 (types and utilities) must complete before T015, T019
- T013-T014 (tests) must fail before T015 (implementation)
- T015 (parser) must complete before T016 (simulator tests can use parser)
- T019 (simulator) must complete before T020 (end-to-end tests)
- T022-T023 (solution) must complete before T029 (real input testing)

---

## Parallel Example: Phase 1 Setup

```bash
# Launch all independent setup tasks together:
Task T002: npm init → package.json
Task T003: Create tsconfig.json
Task T004: Create jest.config.js
Task T006: Create .npmrc

# These can complete in parallel, then:
Task T001: Create directory structure (if not yet done)
Task T005: Create .gitignore
Task T007: Create src/index.ts
```

---

## Parallel Example: User Story 1 Test-First

```bash
# Write all parser tests in parallel:
Task T013: Unit tests for parseLine()
Task T014: Integration tests for parseFile()

# Verify both test suites FAIL:
npm test -- parser.test.ts
# Expected: tests fail (RED)

# Then implement parser:
Task T015: Implement RotationParser class

# Verify tests now PASS:
npm test -- parser.test.ts
# Expected: all tests pass (GREEN)
```

---

## Implementation Strategy

### MVP First (All 3 User Stories for Complete Solution)

Since all three user stories are P1 (critical), implement them in order:

1. **Complete Phase 1**: Setup ✓
2. **Complete Phase 2**: Foundational ✓
3. **Complete Phase 3**: User Story 1 (Parsing) ✓
4. Test independently: Can parse example.txt correctly
5. **Complete Phase 4**: User Story 2 (Simulation) ✓
6. Test independently: Can simulate rotations correctly
7. **Complete Phase 5**: User Story 3 (Counting) ✓
8. Test independently: Final answer = 3 for example
9. **Verify MVP**: Run `npm test` - all tests pass ✓
10. **Deploy/Submit**: Ready to submit solution

### Incremental Delivery (If Stopping Early)

- **After Phase 3**: Can parse and validate input files
- **After Phase 4**: Can simulate dial rotations (but can't count password yet)
- **After Phase 5**: Complete working solution with correct answer

### Code Organization Tips

- Keep `types.ts` pure - no dependencies on other modules
- Keep `math-utils.ts` pure - only modulo arithmetic
- `parser.ts` depends on `types.ts` only
- `dial-simulator.ts` depends on `types.ts` only
- `solution.ts` depends on `parser.ts` and `dial-simulator.ts`
- `src/index.ts` depends on `solution.ts`

---

## Success Checklist

- [ ] All tests pass: `npm test` returns exit code 0
- [ ] TypeScript compiles: `npm run build` returns zero errors/warnings
- [ ] Code coverage: `npm test -- --coverage` shows >90% for src/2025/day-01/
- [ ] Example works: `npm run solve -- ./tests/fixtures/example.txt` outputs "Password: 3"
- [ ] Performance: Solution completes in <1 second on any valid input
- [ ] Code style: ESLint (if configured) or manual review passes
- [ ] All user stories are independently testable
- [ ] Feature branch is clean and ready for PR
- [ ] Documentation is updated and accurate

---

## Notes

- [P] tasks = different files, no dependencies - can parallelize
- [Story] label maps task to specific user story (US1, US2, US3)
- Each user story is independently completable and testable
- Write tests FIRST (red), then implement (green), then refactor
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Use the example data to verify correctness as you go

---

## Task Statistics

- **Total Tasks**: 36
- **Setup Phase**: 7 tasks
- **Foundational Phase**: 5 tasks
- **User Story 1**: 3 test tasks + 1 implementation task = 4 tasks
- **User Story 2**: 3 test tasks + 1 implementation task = 4 tasks
- **User Story 3**: 2 test tasks + 2 implementation tasks = 4 tasks
- **Polish Phase**: 13 tasks
- **Parallelizable Tasks**: 16 (marked with [P])
- **Sequential Critical Path**: ~18 tasks
