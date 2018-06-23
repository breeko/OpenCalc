//@flow
import Configs from '../configs/Configs';
import {DECIMAL, COMMA} from '../core/Operations';

const zip = (...rows: Array<any>) => [...rows[0]].map((_,c) => rows.map(row => row[c]));

export function zipWithIndexTwice<A>(arr: Array<A>): Array<[number,number,A]> {
	const index: Array<number> = Array();
	for (let i=0; i<arr.length; i++) { index.push(i); }
	return zip(index, index, arr);
}

export function lastOrNull<A>(arr: Array<A>): ?A {
	if (arr.length === 0) {
		return null;
	}
	return arr[arr.length - 1];
}

export function isNumeric(n: string): boolean {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function isInArray<A>(value: A, array: Array<A>) {
	return array.indexOf(value) > -1;
}

function decimalPlaces(num: string): number {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0)
       // Adjust for scientific notation.
       - (match[2] ? +match[2] : 0));
}

export function multiply(a: number, b: number): number {
	const aDecimals = decimalPlaces(a.toString());
	const bDecimals = decimalPlaces(b.toString());
	const maxDecimals = Math.max(aDecimals, bDecimals);
	const multiplier = Math.pow(10, maxDecimals);
	const divisor = Math.pow(10, (maxDecimals * 2));
	const result = (a * multiplier * b * multiplier) / divisor;
	return result;
}

function useExponential(num: number): bool {
	const absNum = Math.abs(num);
	return (absNum >= Configs.MinScientificNotation || (absNum > 0 && absNum <= Configs.MaxScientificNotation))
}
export function numberWithCommas(x: string, round: ?boolean = true) {
	const xNumber = Number(x);
	const xString = (round && (decimalPlaces(x) > Configs.MaxPrecision)) ? xNumber.toFixed(Configs.MaxPrecision) : x;
	const parseRegex: RegExp = /\B(?=(\d{3})+(?!\d))/g
	if (useExponential(xNumber)) {
		return xNumber.toExponential(Configs.ExponentialDecimalPlaces);
	} else {
		// toLocaleString does not work in Android
		const parts = xString.split(DECIMAL);
		const head = parts[0].replace(parseRegex, COMMA) || '0';
		const tail = (parts.length > 1) ? parts[1].toString() : '';
		const decimalJoin = (xString.indexOf(DECIMAL) < 0) ? '' : DECIMAL;
		return head + decimalJoin + tail;
	}
}


