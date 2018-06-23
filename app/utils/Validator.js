//@flow
import CalcUtils from "./CalculatorUtils";
import {lastOrNull, isInArray} from './Utils';

import {DECIMAL, Operation} from "../core/Operations";
import {OperationType, OperationSubType, OperationArgs} from '../core/OperationTypes';

export default class Validator {

    static getLastEffectiveOperator(queue: Array<Operation>): Operation {
        // filters out only operators relevant for validation
        const filterOut = Array(OperationSubType.BackwardUnaryOp, OperationSubType.ParenthesisClose, OperationSubType.ParenthesisOpen)
        const ops = queue.filter(x => !isInArray(x.operationSubType,filterOut));
        return ops[ops.length - 1];
    }

    static validOperator(op: Operation, queue: Array<Operation>): boolean {
        const lastOp = this.getLastEffectiveOperator(queue);
        if (op.operationSubType === OperationSubType.UnaryOp) {
            return !lastOp || lastOp.operationSubType === OperationSubType.BinaryOp || lastOp.operationSubType === OperationSubType.UnaryOp 
        } else if (op.operationSubType === OperationSubType.BackwardUnaryOp) {
            return lastOp && lastOp.operationType === OperationType.Constant;
        } else if (op.operationSubType === OperationSubType.BinaryOp) {
            return lastOp && (
                lastOp.operationType === OperationType.Constant || lastOp.operationSubType === OperationSubType.BinaryOp);
        } else {
            return false;
        }
    }

    static validDigit(digit: string, queue: Array<Operation>): boolean {
        const lastEffectiveOp: ?Operation = this.getLastEffectiveOperator(queue);
        const lastOp: ?Operation = lastOrNull(queue);
        if (lastEffectiveOp && digit === DECIMAL && lastEffectiveOp.operationType === OperationType.Constant) {
            return lastEffectiveOp.stringVal.indexOf(DECIMAL) === -1;
        } else if (lastOp && lastOp.operationSubType === OperationSubType.BackwardUnaryOp) {
            return false;
        } else if (lastOp && lastOp.operationSubType === OperationSubType.ParenthesisClose) {
            return false;
        } else {
            return true;
        }
    }

    static validEquals(op: Operation, queue: Array<Operation>)  {
        if (queue.length < 2) {
            return false;
        }
        return true;
    }

    static validParenthesis(op: Operation, queue: Array<Operation>) {
        const lastOp: ?Operation = this.getLastEffectiveOperator(queue);
        
        if (op.operationSubType === OperationSubType.ParenthesisOpen) {
            return !lastOp || 
                    isInArray(lastOp.operationSubType, Array(OperationSubType.BinaryOp,OperationSubType.UnaryOp));
        } else if (op.operationSubType === OperationSubType.ParenthesisClose) {
            if (lastOp && lastOp.operationType === OperationType.Constant) {
                const oParen: Array<Operation> = queue.filter(op => op.operationType == OperationType.Parenthesis);
                const oParenPriority: number = (oParen.length > 0) ? oParen.reduce(function(a,b){return a + b.priority;}, 0) : 0;
                return (oParenPriority + op.priority) >= 0;
            }
            return false;
        }
    }

    static replaceOperator(op: Operation, queue: Array<Operation>) {
        const lastOp: ?Operation = queue[queue.length - 1];
        return (
            (lastOp && (
                lastOp.operationSubType === op.operationSubType && op.operationSubType === OperationSubType.BinaryOp
            ))  
        )
    }
}
