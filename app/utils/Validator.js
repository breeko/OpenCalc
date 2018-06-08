import CalcUtils from "./CalculatorUtils";
import {lastOrNull, isInArray} from './Utils';

import {OperationType, OperationSubType, DECIMAL, OperationArgs} from "../core/Operations";

export default class Validator {

    static getLastEffectiveOperator(queue) {
        // filters out only operators relevant for validation
        const filterOut = Array(OperationSubType.BackwardUnaryOp, OperationSubType.ParenthesisClose, OperationSubType.ParenthesisOpen)
        const ops = queue.filter(x => !isInArray(x.operationSubType,filterOut));
        return ops[ops.length - 1];
    }

    static validOperator(op, queue) {
        const lastActualOp = queue[queue.length - 1];
        const lastOp = this.getLastEffectiveOperator(queue);
        if (op.operationSubType === OperationSubType.UnaryOp) {
            return !lastOp || lastOp.operationSubType === OperationSubType.BinaryOp || lastOp.operationSubType === OperationSubType.UnaryOp 
        } else if (op.operationSubType === OperationSubType.BackwardUnaryOp) {
            return lastOp && lastOp.operationType === OperationType.Constant;
        } else if (op.operationSubType === OperationSubType.BinaryOp) {
            return lastOp && (
                lastOp.operationType === OperationType.Constant || lastOp.operationSubType === OperationSubType.BinaryOp);
        }
    }

    static validDigit(digit, queue) {
        const lastOp = this.getLastEffectiveOperator(queue);
        
        if (lastOp && digit === DECIMAL && lastOp.lastOperationType === OperationType.Constant) {
            return lastOp.val % 1 === 0;
        } else {
            return true;
        }
    }

    static validEquals(op, queue)  {
        if (queue.length < 2) {
            return false;
        }
        return true;
    }

    static validParenthesis(op, queue) {
        const lastOp = this.getLastEffectiveOperator(queue);
        
        if (op.operationSubType === OperationSubType.ParenthesisOpen) {
            return !lastOp || lastOp.operationSubType === OperationSubType.BinaryOp
        } else if (op.operationSubType === OperationSubType.ParenthesisClose) {
            if (lastOp && lastOp.operationType === OperationType.Constant) {
                const oParen = queue.filter(op => op.operationType == OperationType.Parenthesis);
                const oParenPriority = (oParen.length > 0) ? oParen.reduce(function(a,b){return a + b.priority;}, 0) : 0;
                return (oParenPriority + op.priority) >= 0;
            }
            return false;
        }
    }

    static replaceOperator(op, queue) {
        const lastOp = queue[queue.length - 1];
        return (
            (lastOp && (
                lastOp.operationSubType === op.operationSubType && op.operationSubType === OperationSubType.BinaryOp
            ))  
        )
    }
}
