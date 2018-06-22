//@flow

import {Operation, newOperation} from './Operations';
import {OperationType, OperationSubType, OperationArgs} from './OperationTypes';

import {zipWithIndexTwice, lastOrNull, isInArray, numberWithCommas, isNumeric} from '../utils/Utils';
import CalcUtils from '../utils/CalculatorUtils';
import Validator from '../utils/Validator';

export default class CalculatorBrain {
	queue: Array<Operation> = [];
	cleared: boolean = true;

	clear() {
		this.queue = [];
	}

	setItem(item: string) {
		let op: Operation = newOperation(item, this.queue);
		let opToAdd: ?Operation;
		let cleared = false;
		if (op.operationType == OperationType.Equals) {
			opToAdd = this.setEquals(op);
			cleared = true;
		} else if (op.operationType === OperationType.Constant) {
			opToAdd = this.setOperand(op);
		} else if (op.operationType === OperationType.Operation) {
			opToAdd = this.setOperator(op);
		} else if (op.operationType === OperationType.Parenthesis) {
			opToAdd = this.setParenthesis(op);
		}

		if (opToAdd) {
			this.queue.push(opToAdd);
			this.cleared = cleared;
		}
	}

	setEquals(op: Operation): ?Operation {
		if (Validator.validEquals(op, this.queue)) {
			const strResult: string = this.getResult();
			const result: string = strResult.replace(/,/g, '');
			const opArgs: Array<number> = new Array(OperationArgs.Cleared);
			const opToAdd = newOperation(result, this.queue, opArgs);
			this.clear();
			return opToAdd;
		}
	}

	setOperator(op: Operation): ?Operation {
		if (Validator.replaceOperator(op, this.queue)) {
			this.queue.pop();
		}

		if (Validator.validOperator(op, this.queue)) {
			return op;
		}
	}

	setOperand(op: Operation): ?Operation {
		let newNumber: ?string;
		if (!Validator.validDigit(op.stringVal, this.queue)) {
			return null;
		}

		let lastOp: ?Operation = lastOrNull(this.queue);

		if (lastOp && (
				this.cleared ||
				lastOp.operationArgs.has(OperationArgs.NotParseable) ||
				op.operationArgs.has(OperationArgs.NotParseable) && lastOp.operationType === OperationType.Constant)
		) {
			this.queue.pop();
		} else if (lastOp && lastOp.operationType === OperationType.Constant) {
			const lastNumber = this.queue.pop();
			newNumber = lastNumber.stringVal + op.stringVal;
		}

		if (newNumber) {
			return newOperation(newNumber, this.queue);
		} else {
			return op;
		}
	}

	setParenthesis(op: Operation) {
		if (Validator.validParenthesis(op, this.queue)) {
			return op;
		}
		return null;
	}

	deleteLast() {
		if (this.queue.length === 0){
			return;
		}

		const lastOpType: ?number = this.queue[this.queue.length - 1].operationType;
		if (lastOpType === OperationType.Constant) {
			const lastNum = this.queue.pop().stringVal;
			if (lastNum.length > 1) {
				const newNum = lastNum.substring(0, lastNum.length - 1);
				this.queue.push(newOperation(newNum, this.queue));
			}
		} else {
			this.queue.pop(); // 32332608 / 9 => NaN
		}
	}

	getResult(): string {
		const numbers: Array<Operation> = this.queue.filter(op => op.operationType === OperationType.Constant);
		const operatorsWithParenthesis = CalcUtils.getOperatorsWithParenthesis(this.queue);
		const evaluatedOps = this.evaluateParenthesis(operatorsWithParenthesis);
		try { 
			const out = this.evaluate(numbers, evaluatedOps, null);
			if (out !== null && out !== undefined) {
				return numberWithCommas(out.toString());
			} else {
				const first: ?Operation = numbers[0];
				if (first && first.operationArgs.has(OperationArgs.PrintAlone)) {
					return numberWithCommas(first.val);
				}
				return ' ';
			}
		} catch (e) {
			return e.message;
		}
	}


	evaluateParenthesis(operators: Array<Operation>, parenthesisPriority:number = 0): Array<Operation> {
		// Updates operators priorities with parenthesis
		if (operators.length == 0) {
			return operators;
		}

		const op: Operation = operators[0];
		const remainingOps: Array<Operation> = operators.slice(1, operators.length);
		let evaluatedOps: Array<Operation> = [];

		if (op.operationType === OperationType.Parenthesis) {
			parenthesisPriority += op.priority;
			parenthesisPriority = Math.max(0, parenthesisPriority);
		} else {
			op.priority += parenthesisPriority;
			evaluatedOps.push(op);
		}
		
		const remaining: Array<Operation> = this.evaluateParenthesis(remainingOps, parenthesisPriority);
		return evaluatedOps.concat(remaining);
	}

	getDisplay(): string {
		if (this.queue.length === 0) {
			return ' '
		}
		return this.queue.map(x => (
			x.operationType == OperationType.Constant && 
			!x.operationArgs.has(OperationArgs.PrintAsString)) ? 
				numberWithCommas(x.stringVal, false) : 
				x.stringVal).join(' ')
	}

	evaluate(numbers: Array<Operation>, ops: Array<Operation>, acc: ?number): ?number {
		if (ops.length === 0) {
			return acc;
		}

		let zippedOps: Array<[number,number,Operation]> = zipWithIndexTwice(ops); // e.g. 1 + 2 + 3 => returns (0, 0, +) (0, 0, -)
		let numUnary: number = 0;
		console.log('zipped: ');
		console.log(zippedOps);
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

		let maxPriority: [number,number,Operation] = zippedOps.reduce(function(a, b) { 
			if (a[2].operationSubType === OperationSubType.UnaryOp) {
				// right to left on unary ops
				// e.g. sin cos 1, evaluate cos(1) first
				return a[2].priority > b[2].priority ? a : b;	
			}
			return a[2].priority >= b[2].priority ? a : b;});

		const opIdx: number = maxPriority[0];
		const numIdx: number = maxPriority[1];
		const op: Operation = maxPriority[2];

		const num1: ?Operation = numbers[numIdx];
		const num2: ?Operation = numbers[numIdx + 1];
		let head: Array<Operation> = numbers.slice(0, numIdx);
		let tail: Array<Operation> = numbers.slice(numIdx, numbers.length);

		let evaluatedNumber: boolean = false;

		if (num1) {
			if (op.operationSubType === OperationSubType.BackwardUnaryOp) {
				if (isNaN(num1.val)) { 
					throw 'Number too long';
				}
				acc += op.val(num1.val);
				tail = numbers.slice(numIdx + 1, numbers.length);
				evaluatedNumber = true;
			} else if (isInArray(op.operationSubType, Array(OperationSubType.UnaryOp, OperationSubType.BackwardUnaryOp))) {
					acc = op.val(num1.val);
					tail = numbers.slice(numIdx + 1, numbers.length);
					evaluatedNumber = true;
			} else if (op.operationSubType === OperationSubType.BinaryOp) {
				if (num2) {
					if (isNaN(num2.val)) { 
						throw 'Number too long';
					}
					acc = op.val(num1.val, num2.val);
					tail = numbers.slice(numIdx + 2, numbers.length);
					evaluatedNumber = true;
				}
			}
		}

		let newNumbers: Array<Operation>;
		if (evaluatedNumber && acc !== null && acc !== undefined) {
			const newNumber = newOperation(acc.toString(), this.queue);
			newNumbers = head.concat([newNumber]).concat(tail);
		} else {
			newNumbers= head.concat(tail);
		}

		const newOps: Array<Operation> = (opIdx > 0) ? 
			ops.slice(0, opIdx).concat(ops.slice(opIdx + 1, ops.length)) : 
			ops.slice(1, ops.length);
		
		return this.evaluate(newNumbers, newOps, acc);

	}
}
