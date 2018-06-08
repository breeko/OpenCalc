import {OperationArgs, OperationType, newOperation, OperationSubType} from './Operations';

import {zipWithIndexTwice, lastOrNull, isInArray, numberWithCommas, isNumeric, swapArrayElements} from '../utils/Utils';
import CalcUtils from '../utils/CalculatorUtils';
import Validator from "../utils/Validator";

export default class CalculatorBrain {
	constructor() {
		this.clear();
	}

	clear() {
		this.queue = [];
		this.cleared = true;
	}

	setItem(item) {
		let op = newOperation(item, this.queue);
		let opToAdd;
		if (op.operationType == OperationType.Equals) {
			opToAdd = this.setEquals(op);

		} else if (op.operationType === OperationType.Constant) {
			opToAdd = this.setOperand(op);
		} else if (op.operationType === OperationType.Operation) {
			opToAdd = this.setOperator(op);
		} else if (op.operationType === OperationType.Parenthesis) {
			opToAdd = this.setParenthesis(op);
		}

		if (opToAdd) {
			this.queue.push(opToAdd);
			this.cleared = false;
		}
	}

	setEquals(op) {
		if (Validator.validEquals(op, this.queue)) {
			let result = this.getResult();
			opToAdd = newOperation(result, this.queue, operationArgs = new Set([OperationArgs.Cleared]));
			this.clear();
			return opToAdd;
		}
	}

	setOperator(op) {
		if (Validator.replaceOperator(op, this.queue)) {
			this.queue.pop();
		}

		if (Validator.validOperator(op, this.queue)) {
			return op;
		}
	}

	setOperand(op) {
		let newNumber;
		// BUG: After equals, if a number is pressed it should override the input
		if (!Validator.validDigit(op.val, this.queue)) {
			return null;
		}

		let lastOp = lastOrNull(this.queue);

		if (lastOp && 
			(lastOp.operationArgs.has(OperationArgs.Cleared) ||
			(lastOp.operationArgs.has(OperationArgs.NotParseable))
		)) {
			this.queue.pop();
		} else if (lastOp && lastOp.operationType == OperationType.Constant) {
			lastNumber = this.queue.pop();
			newNumber = lastNumber.stringVal + op.stringVal;
		}

		if (newNumber) {
			return newOperation(newNumber, this.queue);
		} else {
			return op;
		}
	}

	setParenthesis(op) {
		if (Validator.validParenthesis(op, this.queue)) {
			return op;
		}
		return null;
	}

	deleteLast() {
		if (this.queue.length === 0){
			return;
		}

		const lastOp = this.queue[this.queue.length - 1].operationType;
		if (lastOp === OperationType.Constant) {
			const lastNum = this.queue.pop().stringVal;
			if (lastNum.length > 1) {
				const newNum = lastNum.substring(0, lastNum.length - 1);
				this.queue.push(newOperation(newNum, this.queue));
			}
		} else {
			this.queue.pop();
		}
	}

	getResult() {
		const operatorsBinary = this.queue.filter( op => op.operationSubType === OperationSubType.BinaryOp);
		const operatorsUnary = this.queue.filter( op => isInArray(op.operationSubType, Array(OperationSubType.UnaryOp, OperationSubType.BackwardUnaryOp)));
		const numbers = this.queue.filter(op => op.operationType === OperationType.Constant);
		
		if (numbers.length === 0 || (numbers.length < 2 && operatorsUnary.length < 2)) {
			return ' '; // just one number, e.g. 123 or 1%
		} else if (numbers.length === 1) {
			return numberWithCommas(numbers[0].stringVal); // one number and one operator e.g. 1+ => 1
		}

		const operatorsWithParenthesis = CalcUtils.getOperatorsWithParenthesis(this.queue);
		const evaluatedOps = this.evaluateParenthesis(operatorsWithParenthesis);
		return this.evaluate(numbers, evaluatedOps, 0.0);
	}


	evaluateParenthesis(operators, parenthesisPriority=0) {
		// Updates operators priorities with parenthesis
		if (operators.length == 0) {
			return operators;
		}

		const op = operators[0];
		const remainingOps = operators.slice(1, operators.length);
		let evaluatedOps = [];

		if (op.operationType === OperationType.Parenthesis) {
			parenthesisPriority += op.priority;
			parenthesisPriority = Math.max(0, parenthesisPriority);
		} else {
			op.priority += parenthesisPriority;
			evaluatedOps.push(op);
		}
		
		return evaluatedOps.concat(this.evaluateParenthesis(remainingOps, parenthesisPriority));
	}

	getDisplay() {
		if (this.queue.length === 0) {
			return ' '
		}
		return this.queue.map(x => (x.operationType == OperationType.Constant && !x.operationArgs.has(OperationArgs.PrintAsString)) ? numberWithCommas(x.val) : x.stringVal).join(' ')
	}

	evaluate(numbers, ops, acc) {		
		if (ops.length === 0) {
			return isNumeric(acc) ? numberWithCommas(acc) : acc;
		}

		let zippedOps = zipWithIndexTwice(ops); // e.g. 1 + 2 + 3 => returns (0, 0, +) (0, 0, -)
		let numUnary = 0;
		for (let idx = 0; idx < zippedOps.length; idx++) {
			// adjust for unary ops
			// e.g. sin cos 1 => 
			// zippedOps = ((0, 0, sin), (1, 1, cos))  numbers = (1)
			// adjustedZippedOps = ((0, 0, sin), (1, 0 cos))
			zippedOps[idx][1] -= numUnary;
			if (zippedOps[idx][2].operationSubType === OperationSubType.UnaryOp) {
				numUnary += 1;
			}
		}

		let maxPriority = zippedOps.reduce(function(a, b) { 
			if (a[2].operationSubType === OperationSubType.UnaryOp) {
				// right to left on unary ops
				// e.g. sin cos 1, evaluate cos(1) first
				return a[2].priority > b[2].priority ? a : b;	
			}
			return a[2].priority >= b[2].priority ? a : b;});

		const opIdx = maxPriority[0];
		const numIdx = maxPriority[1];
		const op = maxPriority[2];

		const num1 = numbers[numIdx];
		const num2 = numbers[numIdx + 1];
		let head = numbers.slice(0, numIdx);
		let tail = numbers.slice(numIdx, numbers.length);

		let evaluatedNumber = false;

		if (op.operationSubType === OperationSubType.BackwardUnaryOp) {
			if (num1) {
				acc += op.val(num1.val);
				tail = numbers.slice(numIdx + 1, numbers.length);
				evaluatedNumber = true;
			}
		} else if (isInArray(op.operationSubType, Array(OperationSubType.UnaryOp, OperationSubType.BackwardUnaryOp))) {
			if (num1) {
				acc = op.val(num1.val);
				tail = numbers.slice(numIdx + 1, numbers.length);
				evaluatedNumber = true;
			}
		} else if (op.operationSubType === OperationSubType.BinaryOp) {
			if (num1 && num2) {
				acc = op.val(num1.val, num2.val);
				tail = numbers.slice(numIdx + 2, numbers.length);
				evaluatedNumber = true;
			}
		}

		let newNumbers;
		if (evaluatedNumber) {
			const newNumber = newOperation(acc, this.queue);
			newNumbers = head.concat([newNumber]).concat(tail);
		} else {
			newNumbers= head.concat(tail);
		}

		if (num1) {
			console.log(num1.val);
		}
		if (num2) {
			console.log(num2.val);
		}
		console.log(op.stringVal);
		console.log("END");

		const newOps = (opIdx > 0) ? ops.slice(0, opIdx).concat(ops.slice(opIdx + 1, ops.length)) : ops.slice(1, ops.length);
		return this.evaluate(newNumbers, newOps, acc);

	}
}
