class Operation {
  constructor(operationType, val, priority=-1){
    this.operationType = operationType;
    this.val = val;
	this.priority = priority;
	this.numParenthesis = 0;
  }
}

const OperationType = Object.freeze({
  'Constant': 1,
  'UnaryOp': 2,
  'BinaryOp': 3,
  'Equals': 4,
  'Clear': 5,
  'Digit': 6
});

const Operations = {
  'π': new Operation(OperationType.Constant, Math.PI),
  'e': new Operation(OperationType.Constant, Math.E),
  '√': new Operation(OperationType.UnaryOp, Math.sqrt),
  'cos': new Operation(OperationType.UnaryOp, Math.cos),
  'sin': new Operation(OperationType.UnaryOp, Math.sin),
  'tan': new Operation(OperationType.UnaryOp, Math.tan),
  'log10': new Operation(OperationType.UnaryOp, Math.log10),
  '−': new Operation(OperationType.BinaryOp, function(x, y) { return x - y; }, 1.0),
  '+': new Operation(OperationType.BinaryOp, function(x, y) { return x + y; }, 2.0),
  '÷': new Operation(OperationType.BinaryOp, function(x, y) { return x / y; }, 3.0),
  '×': new Operation(OperationType.BinaryOp, function(x, y) { return x * y; }, 4.0),
  '=': new Operation(OperationType.Equals),
  'c': new Operation(OperationType.Clear)
};

const parenthesisPriority = Math.max(...Object.values(Operations).map(x => x.priority));

function newOperation(opString, numParenthesis = 0) {
	const op = Operations[opString];
	op.numParenthesis = numParenthesis;
	return op;
}

function zipWithIndex(arr, arr2) {
	let out = [];
	for (let idx = 0; idx < arr.length && idx < arr2.length; idx++) {
		out.push([idx, arr[idx], arr2[idx]]);
	}
	return out;
}

function getPriority(op) {

	const parenthesisPriorityBonus = op.numParenthesis * parenthesisPriority;
	return op.priority + parenthesisPriority;
}

function evaluate(numbers, ops, acc = 0.0) {
	if (ops.length === 0 || numbers.length < 2) {
		return acc;
	}

	let pendingOps = ops.slice(0, numbers.length - 1);
	let pendingPriorities = pendingOps.map(x => getPriority(x));
	let zippedPending = zipWithIndex(pendingOps, pendingPriorities);
	let maxPriority = zippedPending.reduce(function(a, b) { return a[1].priority > b[1].priority ? a : b;});

	const numIdx = maxPriority[0];
	const op = maxPriority[1];
	const num1 = numbers[numIdx];
	const num2 = numbers[numIdx + 1];

	acc = op.val(num1, num2);
	console.log(num1);
	console.log(op.val);
	console.log(num2);
	console.log(acc);
	console.log('');

	const newNumbers = numbers.slice(0, numIdx).concat([acc]).concat(numbers.slice(numIdx + 2, numbers.length));
	const newOps = ops.slice(0, numIdx).concat(ops.slice(numIdx + 1, ops.length));


	return evaluate(newNumbers, newOps, acc);

}

let numbers = [1,2,4,2];
// let ops = ['(+)', '*' , '(+)'];
let ops = [newOperation('+'), newOperation('×'), newOperation('+')];

let x = evaluate(numbers, ops);


console.log(x);
