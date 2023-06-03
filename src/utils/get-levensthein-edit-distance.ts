export function getLevenstheinEditDistance(from: string, to: string): number {
  if (!from.length || !to.length) {
    return Math.max(from.length, to.length);
  }

  // 1. Build up ixj matrix -> to.length x from.length
  const matrixWidth = from.length + 1;
  const matrixHeight = to.length + 1;

  const matrix: number[][] = Array(matrixHeight)
    .fill(null)
    .map(() => Array(matrixWidth).fill(0));

  // 2. Fill first column and first row

  // Column
  for (let i = 0; i < matrix.length; i++) {
    matrix[i]![0] = i;
  }

  // Row
  for (let j = 0; j < matrix[0]!.length; j++) {
    matrix[0]![j] = j;
  }

  // 3. Calculate edit distance for all substrings until the end
  for (let i = 1; i < matrix.length; i++) {
    const toChar = to[i - 1];
    for (let j = 1; j < matrix[i]!.length; j++) {
      const fromChar = from[j - 1];

      if (fromChar === toChar) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!;
      } else {
        const minEditDistance = getMinimalEditDistanceOfPrecedingOperations(
          matrix,
          { i, j }
        );
        matrix[i]![j] = minEditDistance + 1;
      }
    }
  }

  return matrix[to.length]![from.length]!;
}

const getMinimalEditDistanceOfPrecedingOperations = (
  matrix: (number | null)[][],
  { i, j }: { i: number; j: number }
): number => {
  const deletion = matrix[i]![j - 1]!;
  const replacement = matrix[i - 1]![j - 1]!;
  const insertion = matrix[i - 1]![j]!;

  return Math.min(deletion, replacement, insertion);
};
