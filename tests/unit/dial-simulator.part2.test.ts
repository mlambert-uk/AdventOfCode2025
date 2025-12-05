import { DialSimulator } from '../../src/2025/day-01/dial-simulator';
import { Rotation } from '../../src/2025/day-01/types';

describe('DialSimulator - Part Two (count all clicks during rotations)', () => {
  test('README example counts intermediate zeros (expected 6)', () => {
    const rotations: Rotation[] = [
      { direction: 'L', distance: 68 },
      { direction: 'L', distance: 30 },
      { direction: 'R', distance: 48 },
      { direction: 'L', distance: 5 },
      { direction: 'R', distance: 60 },
      { direction: 'L', distance: 55 },
      { direction: 'L', distance: 1 },
      { direction: 'L', distance: 99 },
      { direction: 'R', distance: 14 },
      { direction: 'L', distance: 82 },
    ];

    const sim = new DialSimulator();
    // new API: pass method option to count all clicks during rotations
    const result = (sim as any).applyRotations(rotations, { method: 'all' });

    expect(result).toBeDefined();
    expect(result.password).toBe(6);
  });

  test('R1000 from 50 hits zero 10 times and returns to 50', () => {
    const rotations: Rotation[] = [{ direction: 'R', distance: 1000 }];
    const sim = new DialSimulator();
    const result = (sim as any).applyRotations(rotations, { method: 'all' });

    expect(result).toBeDefined();
    expect(result.password).toBe(10);
    const history = result.dialHistory || [];
    const finalPos = history.length ? history[history.length - 1] : undefined;
    expect(finalPos).toBe(50);
  });
});
