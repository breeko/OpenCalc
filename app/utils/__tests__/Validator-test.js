import Validator from '../Validator';
import {newOperation} from '../../core/Operations';

function createQueue(ops) { 
    return ops.map((op) => newOperation(op));
}

describe('Validator', () => {
  it('must reject single binary operators', () => {
      const queue = createQueue([]);
      const valid = Validator.validOperator(newOperation('+'), queue);
      expect(valid).toBeFalsy();
  });

  it('must reject single backward-unary operators', () => {
    const queue = createQueue([]);
    const valid = Validator.validOperator(newOperation('!'), queue);
    expect(valid).toBeFalsy();
});

it('must allow single unary operators', () => {
    const queue = createQueue([]);
    const valid = Validator.validOperator(newOperation('log'), queue);
    expect(valid).toBeTruthy();
});

it('must allow single constants', () => {
    const queue = createQueue([]);
    const valid = Validator.validDigit(newOperation('1'), queue);
    expect(valid).toBeTruthy();
});

it('must allow consecutive binary operators', () => {
    const queue = createQueue(['+']);
    const valid = Validator.validOperator(newOperation('×'), queue);
    expect(valid).toBeTruthy();
});

it('must allow consecutive unary operators', () => {
    const queue = createQueue(['sin']);
    const valid = Validator.validOperator(newOperation('cos'), queue);
    expect(valid).toBeTruthy();
});

it('must allow parenthesis after unary operators', () => {
    const queue = createQueue(['sin']);
    const valid = Validator.validParenthesis(newOperation('('), queue);
    expect(valid).toBeTruthy();
});

it('must now allow a digit after a parenthesis close', () => {
    const queue = createQueue([')']);
    const valid = Validator.validDigit(newOperation('1'), queue);
    expect(valid).toBeFalsy();
});

it('must allow a digit after a parenthesis open', () => {
    const queue = createQueue(['(']);
    const valid = Validator.validDigit(newOperation('1'), queue);
    expect(valid).toBeTruthy();
});

});
