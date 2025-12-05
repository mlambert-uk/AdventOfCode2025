# Feature Specification: Safe Dial Password Cracker

**Feature Branch**: `001-safe-dial`  
**Created**: 2025-12-05  
**Status**: Draft  
**Input**: Advent of Code Day 1: Secret Entrance puzzle

## User Scenarios & Testing

### User Story 1 - Parse Rotations from Input (Priority: P1)

Read a sequence of rotation instructions from a text file where each line contains a direction (L/R) and a distance value (number of clicks).

**Why this priority**: Core capability required before any puzzle solving can occur. Without parsing, we cannot process the input.

**Independent Test**: Can read a file with rotation instructions and parse each line into direction + distance components.

**Acceptance Scenarios**:

1. **Given** a file with rotation "L68", **When** parsed, **Then** extract direction='L' and distance=68
2. **Given** a file with rotation "R48", **When** parsed, **Then** extract direction='R' and distance=48
3. **Given** a file with multiple rotations, **When** parsed, **Then** all lines are correctly extracted as rotation objects
4. **Given** a file with trailing whitespace, **When** parsed, **Then** whitespace is trimmed correctly

---

### User Story 2 - Simulate Dial Rotation (Priority: P1)

Apply rotation instructions to a circular dial (0-99) starting at position 50. Track each position after each rotation.

**Why this priority**: P1 because it's the core algorithm that solves the puzzle. Cannot determine password without this.

**Independent Test**: Can simulate rotations and produce position values matching the example (start at 50, L68 → 82, L30 → 52, R48 → 0, etc.).

**Acceptance Scenarios**:

1. **Given** dial at position 50, **When** rotated L68, **Then** position becomes 82
2. **Given** dial at position 82, **When** rotated L30, **Then** position becomes 52
3. **Given** dial at position 52, **When** rotated R48, **Then** position becomes 0
4. **Given** dial at position 0, **When** rotated left, **Then** wraps to 99 correctly
5. **Given** dial at position 99, **When** rotated right, **Then** wraps to 0 correctly

---

### User Story 3 - Count Password (Priority: P1)

Count the total number of times the dial points at position 0 throughout the entire rotation sequence.

**Why this priority**: P1 - this is the final step that produces the answer to the puzzle.

**Independent Test**: Can process the example sequence and count exactly 3 occurrences of position 0.

**Acceptance Scenarios**:

1. **Given** the example rotation sequence, **When** counted, **Then** position 0 is reached exactly 3 times
2. **Given** a sequence with no zeros, **When** counted, **Then** result is 0
3. **Given** a sequence where dial stays at position 0, **When** counted, **Then** each rotation is counted

---

### Edge Cases

- What happens when the input file is empty? (Should return 0)
- What if a rotation distance is 0? (Should return to same position)
- What if a rotation distance is greater than 100? (Should wrap correctly using modulo)
- Can the dial handle negative positions after subtraction? (Should wrap using modulo arithmetic)

## Requirements

### Functional Requirements

- **FR-001**: System MUST read rotation instructions from a file (one per line)
- **FR-002**: System MUST parse each line as direction (L or R) followed by numeric distance
- **FR-003**: System MUST simulate dial rotation on a circular dial with positions 0-99
- **FR-004**: System MUST start dial at position 50
- **FR-005**: System MUST track dial position after each rotation
- **FR-006**: System MUST count occurrences of position 0 throughout the sequence
- **FR-007**: System MUST handle circular wrapping (left from 0 → 99, right from 99 → 0)
- **FR-008**: System MUST output the final count as the password

### Key Entities

- **Rotation**: Represents a single rotation instruction with direction (L/R) and distance (number)
- **DialSimulator**: Manages dial state (current position, history, count of zeros)
- **RotationParser**: Parses input file into Rotation objects

## Success Criteria

### Measurable Outcomes

- **SC-001**: Solution correctly solves the provided example (password = 3)
- **SC-002**: Solution runs in under 1 second on any valid input
- **SC-003**: Code has 100% test coverage of core simulation logic
- **SC-004**: Solution correctly handles edge cases (empty input, zero distances, large distances)
- **SC-005**: Code follows TypeScript best practices and compiles without warnings
