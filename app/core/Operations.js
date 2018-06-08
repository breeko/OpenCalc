import {zipWithIndex, isInArray} from '../utils/Utils';

export const DECIMAL = '.';

export const OperationArgs = Object.freeze({
  'Cleared': 1,
  'PrintAlone': 2,
  'PrintAsString': 3,
  'NotParseable': 4,
});

function factorial(num)
{
    var rval=1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

class Operation {
  constructor(stringVal, operationType, operationSubType, val, priority, operationArgs) {
    this.stringVal = stringVal.toString();
    this.operationType = operationType;
    this.operationSubType = operationSubType;
    this.val = val;
    this.priority = priority;
    this.operationArgs = operationArgs || new Set();
  }
}

export const OperationType = Object.freeze({
  'Constant': 1,
  'Operation': 2,
  'Equals': 3,
  'Clear': 4,
  'Parenthesis': 5,
});

export const OperationSubType = Object.freeze({
  'Constant': 1,
  'UnaryOp': 2,
  'BackwardUnaryOp': 3,
  'BinaryOp': 4,
  'Equals': 5,
  'Clear': 6,
  'ParenthesisClose': 7,
  'ParenthesisOpen': 8,
});


const OperationsOverloaded = {
  '−': Object.freeze({
    UnaryOp: 'neg',
    BinaryOp: '−'
  })
};

const showAsStringOptionArgs = new Set([OperationArgs.PrintAlone, OperationArgs.PrintAsString, OperationArgs.NotParseable]);

const Operations = {
  '.': new Operation(DECIMAL, OperationType.Constant, OperationSubType.Constant, 0.0),
  'π': new Operation('π', OperationType.Constant, OperationSubType.Constant, Math.PI, -1, operationArgs=showAsStringOptionArgs),
  'e': new Operation('e', OperationType.Constant, OperationSubType.Constant, Math.E, -1, operationArgs=showAsStringOptionArgs),
  '√': new Operation('√', OperationType.Operation, OperationSubType.UnaryOp, Math.sqrt, 6.0),
  'cos': new Operation('cos', OperationType.Operation, OperationSubType.UnaryOp, Math.cos, 6.0),
  'sin': new Operation('sin', OperationType.Operation, OperationSubType.UnaryOp, Math.sin, 6.0),
  'tan': new Operation('tan', OperationType.Operation, OperationSubType.UnaryOp, Math.tan, 6.0),
  'cosh': new Operation('cosh', OperationType.Operation, OperationSubType.UnaryOp, Math.cosh, 6.0),
  'sinh': new Operation('sinh', OperationType.Operation, OperationSubType.UnaryOp, Math.sinh, 6.0),
  'tanh': new Operation('tanh', OperationType.Operation, OperationSubType.UnaryOp, Math.tanh, 6.0),
  'ln': new Operation('ln', OperationType.Operation, OperationSubType.UnaryOp, Math.ln, 6.0),
  'log2': new Operation('log2', OperationType.Operation, OperationSubType.UnaryOp, Math.log2, 6.0),
  'log10': new Operation('log10', OperationType.Operation, OperationSubType.UnaryOp, Math.log10, 6.0),
  '%': new Operation('%', OperationType.Operation, OperationSubType.BackwardUnaryOp, function(x) {return x / 100.0}, 6.0),
  '!': new Operation('!', OperationType.Operation, OperationSubType.BackwardUnaryOp, function(x) {return factorial(x)}, 6.0),
  'neg': new Operation('-', OperationType.Operation, OperationSubType.UnaryOp, function(x) {return -x;}, 6.0),
  'pos': new Operation('+', OperationType.Operation, OperationSubType.UnaryOp, function(x) {return x;}, 6.0),
  '−': new Operation('−', OperationType.Operation, OperationSubType.BinaryOp, function(x, y) { return x - y; }, 1.0),
  '+': new Operation('+', OperationType.Operation, OperationSubType.BinaryOp, function(x, y) { return x + y; }, 2.0),
  '÷': new Operation('÷', OperationType.Operation, OperationSubType.BinaryOp, function(x, y) { return x / y; }, 3.0),
  '×': new Operation('×', OperationType.Operation, OperationSubType.BinaryOp, function(x, y) { return x * y; }, 4.0),
  '^': new Operation('^', OperationType.Operation, OperationSubType.BinaryOp, function(x, y) { return Math.pow(x, y); }, 5.0),
  '=': new Operation('=', OperationType.Equals, OperationSubType.Equals),
  'c': new Operation('c', OperationType.Clear, OperationSubType.Clear),
  '(': new Operation('(', OperationType.Parenthesis, OperationSubType.ParenthesisOpen, null, 7.0),
  ')': new Operation(')', OperationType.Parenthesis, OperationSubType.ParenthesisClose, null, -7.0)
};

function getOverloadedOperation(opString, queue) {
  const opOverload = OperationsOverloaded[opString];
  if (opOverload) {
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

export function newOperation(opString, queue, operationArgs) {
  const finalOpString = getOverloadedOperation(opString, queue);
  const newOp = Operations[finalOpString] || new Operation(finalOpString, OperationType.Constant, OperationSubType.Constant, Number(finalOpString));
  if (operationArgs) {
    newOp.operationArgs = new Set([...newOp.operationArgs, ...operationArgs]);
  }
  return newOp;
};
