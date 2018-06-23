//@flow
import {numberWithCommas, multiply} from '../Utils';
import Configs from '../../configs/Configs'

describe('numberWithCommas', () => {
  it('must properly display commas', () => {
      const actual = numberWithCommas('1000000');
      const expected = '1,000,000';
      expect(actual).toBe(expected);
  });

  it('must properly round down', () => {
    const actual = numberWithCommas('1.22222222222', true);
    const expected = '1.' + ('2'.repeat( Configs.MaxPrecision));
    expect(actual).toBe(expected);
  });
  
  it('must properly round up', () => {
    const actual = numberWithCommas('1.66666666666', true);
    const expected = '1.' + ('6'.repeat( Configs.MaxPrecision - 1)) + '7';
    expect(actual).toBe(expected);
  });

  it('must properly display 0s', () => {
    const actual = numberWithCommas('0.00', true);
    const expected = '0.00'
    expect(actual).toBe(expected);
  });

  it('must properly display decimals', () => {
    const actual = numberWithCommas('.', true);
    const expected = '0.'
    expect(actual).toBe(expected);
  });
});

describe('multiply', () => {
  it('must properly multiply decimals', () =>{
    const actual = multiply(0.1, 0.2);
    const expected = 0.02;
    expect(actual).toBe(expected);
  }) 

  it('must properly multiply two decimals with different numbers of decimal places', () =>{
    const actual = multiply(.38, .2);
    const expected = 0.076;
    expect(actual).toBe(expected);
  }) 

  it('must properly multiply a decimal and a whole number', () =>{
    const actual = multiply(0.38, 6);
    const expected = 2.28;
    expect(actual).toBe(expected);
  }) 

  it('must properly multiply two whole numbers', () =>{
    const actual = multiply(6, 6);
    const expected = 36;
    expect(actual).toBe(expected);
  })
  
  it('must properly multiply negative decimals', () =>{
    const actual = multiply(0.1, -0.2);
    const expected = -0.02;
    expect(actual).toBe(expected);
  })
});
