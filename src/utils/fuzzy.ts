interface Result {
  string: string;
  score: number;
  index: number;
  original: string;
}

export const fuzzyFilter = (
  pattern: string,
  arr: string[],
  caseSensitive: boolean = false
): Result[] => {
  if (!arr || arr.length === 0) {
    return [];
  }

  return (
    arr
      .reduce((prev: Result[], element, idx: number) => {
        const matched = match(pattern, element, caseSensitive);

        if (matched != null) {
          prev.push({
            string: matched.rendered,
            score: matched.score,
            index: idx,
            original: element,
          });
        }

        return prev;
      }, [])
      // Use index to guarantee stable order in case scores are equal
      .sort((a: Result, b: Result) => b.score - a.score || a.index - b.index)
  );
};

const match = (
  pattern: string,
  string: string,
  caseSensitive: boolean
): { rendered: string; score: number } | null => {
  string = caseSensitive ? string : string.toLowerCase();
  pattern = caseSensitive ? pattern : pattern.toLowerCase();

  const result = [];

  let patternIndex = 0,
    currentScore = 0,
    totalScore = 0;

  for (let index = 0; index < string.length; index++) {
    if (string[index] === pattern[patternIndex]) {
      patternIndex++;
      currentScore = currentScore * 2 + 1;
    } else {
      currentScore = 0;
    }
    totalScore += currentScore;
    result.push(string[index]);
  }

  if (patternIndex === pattern.length) {
    totalScore = string === pattern ? Infinity : totalScore;
    return { rendered: result.join(""), score: totalScore };
  }

  return null;
};
