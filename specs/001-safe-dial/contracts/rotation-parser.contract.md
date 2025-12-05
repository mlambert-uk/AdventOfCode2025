# Contract: RotationParser

## Interface

```typescript
interface IRotationParser {
  parseFile(filePath: string): Promise<ParsedInput>;
  parseLine(line: string): Rotation | null;
}
```

## Responsibility

Parse rotation instructions from a text file or individual lines into strongly-typed `Rotation` objects.

## Input Specification

### File Input (`parseFile`)

- **Parameter**: `filePath: string` - Absolute or relative path to input file
- **File Format**: Text file, one rotation per line
- **Line Format**: Direction (L or R) followed by decimal digits
  - Example: `L68`, `R48`, `L30`
  - Whitespace trimmed automatically
- **Encoding**: UTF-8
- **Maximum Size**: 10 MB (reasonable limit)

### Line Input (`parseLine`)

- **Parameter**: `line: string` - Single rotation instruction
- **Format**: Direction + distance with optional whitespace
- **Returns**: `Rotation` object or `null` if invalid

## Output Specification

### ParsedInput Return Type

```typescript
interface ParsedInput {
  rotations: Rotation[];
  lineCount: number;
  errorLines?: { lineNumber: number; error: string }[];
}
```

### Rotation Type

```typescript
interface Rotation {
  direction: 'L' | 'R';
  distance: number;
}
```

## Behaviors & Test Cases

### Valid Input Parsing

| Input Line | Expected Output | Notes |
|---|---|---|
| `L68` | `{ direction: 'L', distance: 68 }` | Basic left rotation |
| `R48` | `{ direction: 'R', distance: 48 }` | Basic right rotation |
| `  L30  ` | `{ direction: 'L', distance: 30 }` | Whitespace trimmed |
| `R0` | `{ direction: 'R', distance: 0 }` | Zero distance valid |
| `L999` | `{ direction: 'L', distance: 999 }` | Large distance |

### Invalid Input Handling

| Input Line | Expected Behavior | Notes |
|---|---|---|
| `l68` | Return `null` or error | Lowercase direction rejected |
| `Left 68` | Return `null` or error | Spelled-out direction rejected |
| `68L` | Return `null` or error | Wrong order rejected |
| `L-68` | Return `null` or error | Negative distance rejected |
| `L` | Return `null` or error | Missing distance rejected |
| `L 68` | Return `null` or error | Space between direction and distance rejected |
| `` (empty) | Return `null` or error | Empty line rejected |
| `# Comment` | Return `null` or error | Comments not supported |

### File Parsing Behavior

**Complete Valid File**:
```
Input:
  L68
  L30
  R48

Output:
  {
    rotations: [
      { direction: 'L', distance: 68 },
      { direction: 'L', distance: 30 },
      { direction: 'R', distance: 48 }
    ],
    lineCount: 3
  }
```

**Partial Valid File (with errors)**:
```
Input:
  L68
  invalid line
  R48

Output:
  {
    rotations: [
      { direction: 'L', distance: 68 },
      { direction: 'R', distance: 48 }
    ],
    lineCount: 3,
    errorLines: [
      { lineNumber: 2, error: "Invalid format" }
    ]
  }
```

**Empty File**:
```
Input: (empty)

Output:
  {
    rotations: [],
    lineCount: 0
  }
```

## Error Handling

- **File Not Found**: Throw `Error` with message "File not found: {path}"
- **Parse Error**: Skip invalid lines, collect in `errorLines` array
- **Encoding Error**: Treat as file read error

## Performance Guarantees

- Parse up to 10,000 rotations in <500ms
- Memory: <10MB for parsing 10,000 rotations
- Streaming: Can handle files larger than available memory via streaming parser (future optimization)

## Contracts with Caller

1. Caller MUST provide valid file path
2. Parser MUST return all valid rotations in order
3. Parser MUST not throw on malformed lines (collect errors instead)
4. Parser MUST preserve rotation order from file
5. Caller MUST handle `errorLines` if present

## Testing Strategy

### Unit Tests

```typescript
describe('RotationParser', () => {
  describe('parseLine', () => {
    test('parses valid L rotation', () => {
      const result = parser.parseLine('L68');
      expect(result).toEqual({ direction: 'L', distance: 68 });
    });

    test('parses valid R rotation', () => {
      const result = parser.parseLine('R48');
      expect(result).toEqual({ direction: 'R', distance: 48 });
    });

    test('handles whitespace', () => {
      const result = parser.parseLine('  L30  ');
      expect(result).toEqual({ direction: 'L', distance: 30 });
    });

    test('returns null for invalid format', () => {
      expect(parser.parseLine('l68')).toBeNull();
      expect(parser.parseLine('Left 68')).toBeNull();
      expect(parser.parseLine('68L')).toBeNull();
    });
  });

  describe('parseFile', () => {
    test('parses valid file completely', async () => {
      const result = await parser.parseFile('./fixtures/example.txt');
      expect(result.rotations).toHaveLength(10);
      expect(result.lineCount).toBe(10);
      expect(result.errorLines).toBeUndefined();
    });

    test('handles file with parsing errors', async () => {
      const result = await parser.parseFile('./fixtures/with-errors.txt');
      expect(result.errorLines).toBeDefined();
      expect(result.errorLines!.length).toBeGreaterThan(0);
    });
  });
});
```

## Dependencies

- Node.js `fs` module (file reading)
- `readline` module (line-by-line parsing)
