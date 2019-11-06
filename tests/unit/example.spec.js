import { calcDepth } from '@/loader';

describe('calcDepth', () => {
  it('calculates 1', () => {
    expect(calcDepth([{}])).toBe(1);
  });
  it('calculates 2', () => {
    expect(calcDepth([[{}]])).toBe(2);
  });
  it('calculates 2 mixed', () => {
    expect(calcDepth([[{}], []])).toBe(2);
  });
  it('calculates 3 mixed', () => {
    expect(calcDepth([[{}], [[{}]]])).toBe(3);
  });
});
