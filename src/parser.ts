import { Exercise } from "./types";

type TokenType =
  // Single sign
  | "ASPERAND"
  | "FORWARD_SLASH"
  | "STAR"
  // Literals
  | "NUMBER"
  // The token type "STRING" represents one or multiple letters in this context
  | "STRING"
  | "HYPHEN"
  // Keywords
  | "WEIGHT_UNIT"
  // Whitespace & Newline
  | "WHITESPACE"
  | "NEWLINE"
  // End of file
  | "EOF";

type Literal = string | number;

interface Token {
  readonly type: TokenType;
  readonly lexeme: string;
  readonly literal: Literal | null;
  readonly line: number;
}

interface Keywords {
  kg: "WEIGHT_UNIT";
  lbs: "WEIGHT_UNIT";
  // TODO: this is a bad workaround - fix it!
  [k: string]: TokenType;
}
const keywords: Keywords = {
  kg: "WEIGHT_UNIT",
  lbs: "WEIGHT_UNIT",
} as const;

interface Scanner {
  scanTokens(source: string): Token[];
}

interface Interpreter {
  interpret(): Exercise[];
}

//-------------------------------------------------Scanner--------------------------------------------------
// DEFINITIONS
// ---------------------------------------------------------------------------------------------------------
// Lexemes are the smallest sequence of substrings of the source which still represent something with sematic meaning.
// A token is made out of a lexeme and additional data to that lexeme (e.g. token type)
// ---------------------------------------------------------------------------------------------------------

function createScanner(source: string): Scanner {
  const tokens: Token[] = [];
  let start = 0;
  let current = 0;
  let line = 1;

  let hadError = false;
  hadError;

  function isAtEnd(): boolean {
    return current >= source.length;
  }

  function advance(): string {
    const next = source[current];

    if (next === undefined) {
      throw new Error("Can't advance: next char undefined.");
    }

    current = current + 1;

    return next;
  }

  function peek() {
    if (isAtEnd()) {
      return "\0";
    }

    const nextSource = source[current];

    if (nextSource === undefined) {
      throw new Error("Can't peek: next char is undefined");
    }

    return nextSource;
  }

  function peekNext() {
    const next = source[current + 1];

    if (next === undefined) {
      return "\0";
    }

    return next;
  }

  function string(): void {
    while (isString(peek())) {
      advance();
    }

    const string = source.substring(start, current);
    const keyword = keywords[string.toLowerCase()];

    // String is a keyword
    // Makes sure hasOwnProperty is called from the prototype and is not shadowed
    if (
      Object.prototype.hasOwnProperty.call(keywords, string.toLowerCase()) &&
      keyword
    ) {
      addToken(keyword, string, true);
    } else {
      addToken("STRING", string);
    }
  }

  function number(): void {
    while (isNumber(peek())) advance();

    // Look for fractional part
    if ((peek() === "." || peek() === ",") && isNumber(peekNext())) {
      // consume separator
      advance();
      while (isNumber(peek())) advance();
    }

    // only '.' is a valid decimal separator
    const number = parseFloat(
      source.substring(start, current).replace(",", ".")
    );

    addToken("NUMBER", number);
  }

  function addToken(
    type: TokenType,
    literal: Literal | null = null,
    isKeyword?: boolean
  ): void {
    // Lowercase keywords for loose matching
    const text = isKeyword
      ? source.substring(start, current).toLowerCase()
      : source.substring(start, current);

    tokens.push({ type: type, lexeme: text, literal, line });
  }

  function scanToken(): void {
    const char = advance();

    switch (char) {
      case "@":
        addToken("ASPERAND");
        break;

      case "/":
        addToken("FORWARD_SLASH");
        break;

      case "*":
        addToken("STAR");
        break;

      case "-":
        addToken("HYPHEN");
        break;

      case " ":
      case "\r":
      case "\t":
        addToken("WHITESPACE");
        break;

      case "\n":
        addToken("NEWLINE");
        line++;
        break;

      default:
        if (isString(char)) {
          string();
        } else if (isNumber(char)) {
          number();
        } else {
          error(line, "Unexpected character.");
          break;
        }
    }
  }

  // ERROR HANDLING
  function error(line: number, message: string) {
    report(line, "", message);
  }

  function report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error ${where}: ${message}`);
    hadError = true;
  }

  return {
    scanTokens(): Token[] {
      while (!isAtEnd()) {
        // we start at the beginnign of the lexeme
        start = current;
        scanToken();
      }

      tokens.push({
        type: "EOF",
        lexeme: "",
        literal: null,
        line,
      });

      return tokens;
    },
  };
}

//-----------------------------------------------Interpreter------------------------------------------------
// GRAMMAR RULES
// ---------------------------------------------------------------------------------------------------------
// Headline --------> # ANYTHING
// -----------------> A headline is everything from the start of the hashtag to a newline character.
// Exercise name ---> STRING
// -----------------> Every 'normal' string.
// Weight ----------> "@" NUMBER WEIGHT_UNIT+
// -----------------> A number preceded by a '@' and an optional weight unit.
// Repetitions   ---> NUMBER "/" (NUMBER? | (NUMBER "/" NUMBER)*) | NUMBER*NUMBER
// -----------------> A number potentially followed by a forward slash or a star followed by another number.
// ---------------------------------------------------------------------------------------------------------

function createInterpreter(tokens: Token[]): Interpreter {
  const exercises: Exercise[] = [];
  let exerciseNumber = -1;
  // Constructs
  let exerciseName: string | null = null;
  let weight: string | null = null;
  let repetitions: string | null = null;

  let start = 0;
  let current = 0;

  const isAtEnd = () => {
    return tokens[current]?.type === "EOF";
  };

  const advance = () => {
    const token = tokens[current];
    current = current + 1;

    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (token === undefined) {
      throw new Error("Cannot parse: Next token is undefined.");
    }

    return token;
  };

  const peek = () => {
    if (isAtEnd()) {
      return;
    }

    return tokens[current];
  };

  const build = () =>
    tokens
      .slice(start, current)
      .map((token) => token.lexeme)
      .join("")
      .trim();

  const buildExerciseName = (token: Token) => {
    while (isExerciseName(token)) {
      const next = peek();

      if (next && isExerciseName(next)) {
        token = advance();
      } else {
        break;
      }
    }

    // Reset on new exercise
    weight = null;
    repetitions = null;
    exerciseNumber++;
    exerciseName = build();
    exercises[exerciseNumber] = { exerciseName, weight, repetitions };
  };

  const buildWeight = () => {
    let next = peek();

    if (next && isNumber(next.lexeme)) {
      advance();
    }

    next = peek();

    if (next && isWeightUnit(next.lexeme)) {
      advance();
    }

    // If theres already a weight we want to add the existing exerciseName as a second exercise
    // e.g. Benchpress @100 8/8 @95 8/8 ---> Benchpress 100 8/8
    //                                  ---> Benchpress 95 8/8
    if (weight) {
      // Reset
      repetitions = null;
      exerciseNumber++;
    }
    // Ignore Asperand
    start = start + 1;
    weight = build();
    const hasNumber = /\d/.test(weight);
    const hasWeightUnit = /kg|lbs/.test(weight);

    // Provide default weight unit
    if (hasNumber && !hasWeightUnit) {
      weight = weight + "kg";
    }

    exercises[exerciseNumber] = { exerciseName, weight, repetitions };
  };

  const buildRepetitions = (token: Token) => {
    while (isRepetition(token)) {
      const next = peek();

      if (next && isRepetition(next)) {
        token = advance();
      } else {
        break;
      }
    }

    repetitions = build();
    const repChars = repetitions.split("*");

    // Multiplier format ---> Number*Number
    const isValidMultiplier =
      repChars[0] !== undefined &&
      isNumber(repChars[0]) &&
      parseInt(repChars[0]) >= 1 &&
      parseInt(repChars[0]) <= 100;

    const isValidAmount = repChars[1] !== undefined && isNumber(repChars[1]);
    const isMultiplierFormat = isValidMultiplier && isValidAmount;

    if (isMultiplierFormat && repChars[0] !== undefined) {
      repetitions =
        `${repChars[1]}/`.repeat(parseInt(repChars[0]) - 1) + repChars[1];
    }

    exercises[exerciseNumber] = { exerciseName, weight, repetitions };
  };

  const interpreteConstruct = () => {
    start = current;
    const token = advance();

    switch (token.type) {
      case "HYPHEN":
      case "STRING":
        buildExerciseName(token);
        break;

      case "ASPERAND":
        buildWeight();
        break;

      case "NUMBER":
        buildRepetitions(token);
        break;
    }
  };

  return {
    interpret() {
      while (!isAtEnd()) {
        interpreteConstruct();
      }

      return exercises;
    },
  };
}

//--------------------------------------------------PARSER--------------------------------------------------

export function parse(source: string | undefined): Exercise[] | null {
  if (source === undefined) {
    return null;
  }

  const scanner = createScanner(source);
  const tokens = scanner.scanTokens(source);
  const interpreter = createInterpreter(tokens);

  return interpreter.interpret();
}

//-------------------------------------------------HELPERS--------------------------------------------------
const isString = (char: string | undefined): boolean => {
  if (char === undefined) {
    return false;
  }

  // regex letters + special letters like umlaute
  // see https://dev.to/tillsanders/let-s-stop-using-a-za-z-4a0m for details
  const letters = new RegExp(/[\p{Letter}\p{Mark}]+/gu);

  return letters.test(char);
};

const isNumber = (char: string): boolean => {
  const numbers = new RegExp(/\d/);

  return numbers.test(char);
};

const isWeightUnit = (str: string): boolean => str === "kg" || str === "lbs";

const isExerciseName = (token: Token) =>
  token.type === "STRING" ||
  token.type === "HYPHEN" ||
  token.type === "WHITESPACE";

// TODO: clarify, why whitespace?
const isRepetition = (token: Token): boolean =>
  token.type === "NUMBER" ||
  token.type === "FORWARD_SLASH" ||
  token.type === "STAR" ||
  token.type === "WHITESPACE";
