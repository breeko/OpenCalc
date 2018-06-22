//@flow
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

export const OperationArgs = Object.freeze({
  'Cleared': 1,
  'PrintAlone': 2,
  'PrintAsString': 3,
  'NotParseable': 4,
});
