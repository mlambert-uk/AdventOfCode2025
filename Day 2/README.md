# Day 2 — Gift Shop

This directory contains the Day 2 puzzles (Gift Shop) and input fixtures.

Summary
-------
Day 2 asks you to scan ranges of product IDs and identify "invalid" IDs that are formed by repeating a digit sequence.

- Part 1: An ID is invalid if it is formed by a sequence repeated exactly twice (e.g. `11`, `6464`, `123123`).
- Part 2: An ID is invalid if it is formed by any sequence repeated at least twice (e.g. `12341234`, `1111111`, `1212121212`).

Files
-----
- `Part1.md` — Problem statement for Part 1.
- `Part2.md` — Problem statement for Part 2.
- `input.txt` — Your puzzle input (comma-separated ranges on one line).

Running the solver
------------------
The repository includes a CLI routed via `npm run solve`. Use the `day-02` command and the `--part` flag to select Part 1 or Part 2.

Examples:
```bash
# Part 1 (default):
npm run solve -- day-02 'Day 2/input.txt'

# Part 2:
npm run solve -- day-02 'Day 2/input.txt' --part 2
```

Programmatic API
-----------------
You can call the solver from code:

```ts
import { solveDay2FromFile } from './src/2025/day-02/solution';

const res1 = await solveDay2FromFile('Day 2/input.txt');       // Part 1 (default)
const res2 = await solveDay2FromFile('Day 2/input.txt', { part: 2 }); // Part 2

console.log(res1.totalInvalidSum, res2.totalInvalidSum);
```

Notes
-----
- The implementation uses JavaScript `Number` types; if you need arbitrary-precision integers for extremely large inputs, we can switch to `BigInt`.
- Tests are provided under `tests/unit/` and can be run with `npm test`.
