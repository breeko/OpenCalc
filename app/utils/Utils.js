//@flow
import Configs from '../configs/Configs';
import {DECIMAL} from '../core/Operations';

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

export function numberWithCommas(x: string, round: ?boolean = true) {
	const xNumber = Number(x);
	const parseRegex: RegExp = /\B(?=(\d{3})+(?!\d))/g
	if (round) { 
		if (xNumber >= Configs.MinScientificNotation) {
			return xNumber.toExponential(Configs.MaxPrecision);
		}
		return xNumber.toLocaleString('en', { maximumFractionDigits: Configs.MaxPrecision })
	} else {
		const xString = x.toString();
		const parts = xString.split(DECIMAL);
		const head = parts[0].replace(parseRegex, ",") || '0';
		const tail = (parts.length > 1) ? parts[1].toString() : '';
		const decimalJoin = (xString.indexOf(DECIMAL) < 0) ? '' : DECIMAL;
		return head + decimalJoin + tail;
	}
}


