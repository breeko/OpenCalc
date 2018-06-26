
// 'use strict';

import CalculatorBrain from '../CalculatorBrain';

function process(stringOps) {
  const ops = stringOps.split(' ');
  const brain = new CalculatorBrain();
  for (let idx=0; idx < ops.length; idx++) {
    brain.setItem(ops[idx]);
  }
  return brain;
}

function checkDisplayAndResult(stringOps) {
  const brain = process(stringOps);
  const display = brain.getDisplay();
  const result = brain.getResult();
  return (display, result);
}

describe('CalculatorBrain', () => {
  it('adds 1 + 1 and displays correctly', () => {
    const out = checkDisplayAndResult('1 + 1');
    expect(out).toBe(('1 + 1', '2'));
  });

  it('adds 1000 + 1000 and displays correctly', () => {
    const out = checkDisplayAndResult('1000 + 1000');
    expect(out).toBe(('1,000 + 1,000', '2,000'));
  });

  it('respects order of operations', () => {
    const out = checkDisplayAndResult('( 1 + 2 ) × 3 ÷ 4');
    expect(out).toBe(('(1 + 2) × 3 ÷ 4', '2.25'));
  });

  it('displays zeros after decimals', () => {
    const out = checkDisplayAndResult('1.000');
    expect(out).toBe(('1.000', ' '));
  });

  it('overrides operators correctly', () => {
    const out = checkDisplayAndResult('1 + × 4');
    expect(out).toBe(('1 × 4', '4'));
  });

  it('does not override negative operator', () => {
    const out = checkDisplayAndResult('1 × - 4');
    expect(out).toBe(('1 × - 4', '-4'));
  });

  it('handles unary ops correctly', () => {
    const out = checkDisplayAndResult('10 ! %');
    expect(out).toBe(('10!%', '36,288'));
  });

});
