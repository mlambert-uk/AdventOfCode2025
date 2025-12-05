# Advent of Code Constitution

## Core Principles

### I. Solve-First Development
Every solution prioritizes correctness and clarity of algorithm logic. We solve the puzzle efficiently, then refactor for code quality. Optimizations must not obscure the core logic.

### II. Language Flexibility
Each puzzle may be solved in the language most suited to the problem domain. Mixed languages across years are encouraged. No single tech stack is mandated; choose the best tool for each challenge.

### III. Test-Driven Verification
Solutions MUST include test cases with provided examples and custom edge cases. Tests validate both correctness and edge-case handling before submission. Failing tests block completion.

### IV. Clear Documentation
Each solution includes a brief explanation of the approach, key insights, and complexity analysis. README or docstrings clarify algorithmic intent without over-commenting obvious code.

### V. Reusable Utilities
Common parsing, grid operations, and algorithmic helpers are extracted into shared utility modules once they appear in multiple puzzles. These utilities MUST be independently testable and documented.

## Project Organization

**Structure**: Solutions organized by year → day. Each day contains solution code, test cases, and example input files. Utility modules live in a shared `lib/` or similar structure.

**Performance**: Solutions should complete in <5 seconds for provided input. Optimizations for large inputs are encouraged if they maintain code clarity.

**Dependencies**: Minimize external dependencies. Standard library solutions are preferred; third-party libraries must be justified and documented in a requirements/lock file.

## Development Workflow

- **Solution submission**: Code must pass all test cases before marking as complete.
- **Code review**: Peer review of novel or complex algorithms is encouraged.
- **Version control**: Each year/day is committed atomically with solution, tests, and notes.

## Governance

This constitution is the authority for solution quality and project organization. All PRs and solutions must align with the five core principles. Amendments require explicit documentation and community consensus.

**Version**: 1.0.0 | **Ratified**: 2025-12-05 | **Last Amended**: 2025-12-05
