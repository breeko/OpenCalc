//@flow
import {isInArray} from '../utils/Utils';
import {OperationType, OperationSubType, OperationArgs} from './OperationTypes';

const OperationsOverloaded = Object.freeze({
  '−': Object.freeze({
    UnaryOp: 'neg',
    BinaryOp: '−'
  })
});

function factorial(num)
{
    var rval=1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

export class Operation {
  stringVal: string;
  operationType: number;
  operationSubType: number;
  val: any;
  priority: number;
  operationArgs: Set<number>;

  constructor(
    stringVal: string, 
    operationType: number, 
    operationSubType: number, 
    val: any, 
    priority: ?number, 
    operationArgs: ?Set<number>) {
      this.stringVal = stringVal;
      this.operationType = operationType;
      this.operationSubType = operationSubType;
      this.val = val;
      this.priority = priority || -1;
      this.operationArgs = operationArgs || new Set();
  }
}

const showAsStringOptionArgs = new Set([OperationArgs.PrintAlone, OperationArgs.PrintAsString, OperationArgs.NotParseable]);
export const DECIMAL = '.';

const Operations = {
  '.': new Operation(DECIMAL, OperationType.Constant, OperationSubType.Constant, 0, -1),
  'π': new Operation('π', OperationType.Constant, OperationSubType.Constant, Math.PI, -1, showAsStringOptionArgs),
  'e': new Operation('e', OperationType.Constant, OperationSubType.Constant, Math.E, -1, showAsStringOptionArgs),
  '√': new Operation('√', OperationType.Operation, OperationSubType.UnaryOp, Math.sqrt, 6.0),
  'cos': new Operation('cos', OperationType.Operation, OperationSubType.UnaryOp, Math.cos, 6.0),
  'sin': new Operation('sin', OperationType.Operation, OperationSubType.UnaryOp, Math.sin, 6.0),
  'tan': new Operation('tan', OperationType.Operation, OperationSubType.UnaryOp, Math.tan, 6.0),
  'cosh': new Operation('cosh', OperationType.Operation, OperationSubType.UnaryOp, Math.cosh, 6.0),
  'sinh': new Operation('sinh', OperationType.Operation, OperationSubType.UnaryOp, Math.sinh, 6.0),
  'tanh': new Operation('tanh', OperationType.Operation, OperationSubType.UnaryOp, Math.tanh, 6.0),
  'log': new Operation('log', OperationType.Operation, OperationSubType.UnaryOp, Math.log, 6.0),
  'log10': new Operation('log10', OperationType.Operation, OperationSubType.UnaryOp, Math.log10, 6.0),
  '%': new Operation('%', OperationType.Operation, OperationSubType.BackwardUnaryOp, function(x) {return x / 100.0}, 6.0),
  '!': new Operation('!', OperationType.Operation, OperationSubType.BackwardUnaryOp, function(x) {return factorial(x)}, 6.0),
  'neg': new Operation('⁻', OperationType.Operation, OperationSubType.UnaryOp, function(x) {return -x;}, 6.0),
  '−': new Operation('−', OperationType.Operation, OperationSubType.BinaryOp, function(x, y) { return x - y; }, 2.0),
  '+': new Operation('+', OperationType.Operation, OperationSubType.BinaryOp, function(x, y) { return x + y; }, 2.0),
  '÷': new Operation('÷', OperationType.Operation, OperationSubType.BinaryOp, function(x, y) { return x / y; }, 4.0),
  '×': new Operation('×', OperationType.Operation, OperationSubType.BinaryOp, function(x, y) { return x * y; }, 4.0),
  'xⁿ': new Operation('^', OperationType.Operation, OperationSubType.BinaryOp, function(x, y) { return Math.pow(x, y); }, 5.0),
  '=': new Operation('=', OperationType.Equals, OperationSubType.Equals, null),
  'c': new Operation('c', OperationType.Clear, OperationSubType.Clear, null),
  '(': new Operation('(', OperationType.Parenthesis, OperationSubType.ParenthesisOpen, null, 7.0),
  ')': new Operation(')', OperationType.Parenthesis, OperationSubType.ParenthesisClose, null, -7.0)
};

function getOverloadedOperation(opString: string, queue: ?Array<Operation>) {
  const opOverload = OperationsOverloaded[opString];
  if (opOverload && queue) {
    const lastOp = queue[queue.length - 1];
    if (lastOp && isInArray(lastOp.operationSubType, Array(
      OperationSubType.Constant, OperationSubType.ParenthesisClose, OperationSubType.BackwardUnaryOp))) {
      return opOverload.BinaryOp;
    } else {
      return opOverload.UnaryOp;
    }
  }
  return opString;
};

export function newOperation(opString: string, queue: ?Array<Operation>, operationArgs: ?Array<number>) {
  const finalOpString = getOverloadedOperation(opString, queue);
  const newOp = Operations[finalOpString] || new Operation(finalOpString, OperationType.Constant, OperationSubType.Constant, Number(finalOpString));
  if (operationArgs) {
    newOp.operationArgs = new Set([...newOp.operationArgs, ...operationArgs]);
  }
  return newOp;
};
