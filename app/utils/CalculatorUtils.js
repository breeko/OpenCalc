import {isInArray} from "./Utils";
import {OperationType, OperationSubType} from "../core/OperationTypes";

export default class CalculatorUtils {

	static getOperators(queue) {
		return queue.filter(op => isInArray(op.operationType, Array(OperationType.Operation)));
	}

	static getOperatorsWithParenthesis(queue) {
		return queue.filter(op => isInArray(op.operationType, Array(OperationType.Operation, OperationType.Parenthesis)));
	}

	static getLastOperationType(queue) {
		const lastOp = queue[queue.length - 1];
		if (lastOp) {
			return lastOp.operationType;
		}
		return OperationType.Clear;
	}

	static getLastOperationSubType(queue) {
		const lastOp = queue[queue.length - 1];
		if (lastOp) {
			return lastOp.operationSubType;
		}
		return OperationSubType.Clear;
	}

	static getLastNumber(queue) {
		return queue.filter(op => op.operationType == OperationType.Constant)[0] || 0;
	}
}

