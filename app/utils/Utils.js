import Configs from '../configs/Configs';
import {Dimensions} from 'react-native';

const zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]));

export function zipWithIndex(arr) {
	const index = [...Array(arr.length).keys()];
	return zip(index, arr);
}

export function zipWithIndexTwice(arr) {
	const index = [...Array(arr.length).keys()];
	return zip(index, index, arr);
}

export function lastOrNull(arr) {
	if (arr.length === 0) {
		return null;
	}
	return arr[arr.length - 1];
}

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function isInArray(value, array) {
	return array.map(x => x.toString()).indexOf(value.toString()) > -1;
}  

export function numberWithCommas(x) {
	const rounded = Math.round(x * Math.pow(10.0, Configs.MaxPrecision)) / Math.pow(10.0, Configs.MaxPrecision);
	var parts = rounded.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}

export function swapArrayElements(arr, indexA, indexB) {
  const temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
}

