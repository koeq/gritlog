import { Exercise, Headline } from "../lambdas/db-handler/types";

// DEFINITIONS
//  lexeme: are the smallest sequence of substrings of the source which still represent something.
// tokens: a token is made out of a lexeme and additional data to that lexeme (e.g. token type)

type TokenType =
  // Single sign
  | "NEWLINE"
  | "ASPERAND"
  | "FORWARD_SLASH"
  | "STAR"
  | "HASHTAG"
  // Literals
  | "NUMBER"
  // The token type "STRING" represents one or multiple letters in this context
  | "STRING"
  // Keywords
  | "WEIGHT_UNIT"
  // End of file
  | "EOF";

type Literal = string | number;

interface Token {
  readonly type: TokenType;
  readonly lexeme: string;
  // TODO: what is the correct type of literal here
  readonly literal: Literal | null;
  readonly line: number;
}

interface Keywords {
  [k: string]: TokenType;
}
const keywords: Keywords = {
  kg: "WEIGHT_UNIT",
  lbs: "WEIGHT_UNIT",
} as const;

//-----------------------------------------------PARSER--------------------------------------------------

export function parse(
  source: string | undefined
): { headline: Headline; exercises: Exercise[] } | undefined {
  if (source === undefined) {
    return;
  }

  const Scanner = (source: string) => {
    const tokens: Token[] = [];
    let start = 0;
    let current = 0;
    let line = 1;
    let hadError = false;

    function isAtEnd(): boolean {
      return current >= source.length;
    }

    function advance(): string {
      const next = source[current];
      current = current + 1;

      return next;
    }

    function match(expected: string): boolean {
      if (isAtEnd()) return false;
      if (source[current] != expected) return false;
      current = current + 1;

      return true;
    }

    function peek() {
      if (isAtEnd()) return "\0";
      return source[current];
    }

    function peekNext() {
      if (current + 1 >= source.length) return "\0";

      return source[current + 1];
    }

    function string(): void {
      while (isString(peek())) advance();
      const string = source.substring(start, current);

      // String is a keyword
      // This makes sure hasOwnProperty is called from the prototype and is not shadowed
      if (Object.prototype.hasOwnProperty.call(keywords, string)) {
        addToken(keywords[string], string);
      } else {
        addToken("STRING", string);
      }
    }

    function number(): void {
      while (isDigit(peek())) advance();

      // Look for fractional part
      if ((peek() === "." || peek() === ",") && isDigit(peekNext())) {
        // consume separator
        advance();
        while (isDigit(peek())) advance();
      }

      // only '.' is a valid decimal separator
      const number = parseFloat(
        source.substring(start, current).replace(",", ".")
      );

      addToken("NUMBER", number);
    }

    function addToken(type: TokenType, literal: Literal | null = null): void {
      const text = source.substring(start, current);
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

        case "#":
          addToken("HASHTAG");
          break;

        case " ":
        case "\r":
        case "\t":
          // Ignore whitespace.
          break;

        case "\n":
          addToken("NEWLINE");
          line++;
          break;

        default:
          if (isString(char)) {
            string();
          } else if (isDigit(char)) {
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
      scanTokens(source: string): Token[] {
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
  };

  const scanner = Scanner(source);
  const tokens: Token[] = scanner.scanTokens(source);

  const interpreter = Interpreter(tokens);

  return interpreter.interpret();
}

//-----------------------------------------------INTERPRETER------------------------------------------------
// GRAMMAR RULES
// ---------------------------------------------------------------------------------------------------------
// headline --------> # ANYTHING
// -----------------> A headline is everything from the start of the hashtag to a newline character.
// exercise name ---> STRING
// -----------------> Every 'normal' string.
// weight ----------> "@" NUMBER WEIGHT_UNIT+
// -----------------> A number preceded by a '@' and an optional weight unit.
// repetitions   ---> NUMBER "/" (NUMBER? | (NUMBER "/" NUMBER)*) | NUMBER*NUMBER
// -----------------> A number potentially followed by a forward slash or a star followed by another number.
// ---------------------------------------------------------------------------------------------------------

const Interpreter = (tokens: Token[]) => {
  const exercises: Exercise[] = [];
  // Constructs
  let headline = "";
  let exerciseName: string | undefined;
  let weight: string | undefined;
  let repetitions: string | undefined;

  let start = 0;
  let current = 0;

  const isAtEnd = () => {
    return current >= tokens.length;
  };

  const advance = () => {
    const next = tokens[current];
    current = current + 1;

    return next;
  };

  const buildHeadline = () => {
    let nextToken = advance();

    while (nextToken.type !== "NEWLINE" && nextToken.type !== "EOF") {
      headline = headline + " " + nextToken.lexeme;
      nextToken = advance();
    }
  };

  const buildExerciseName = () => {};
  const buildWeight = () => {};
  const buildRepetitions = () => {};

  const interpreteConstruct = () => {
    start = current;
    const token = advance();

    switch (token.type) {
      case "HASHTAG":
        buildHeadline();
        break;

      case "STRING":
        buildExerciseName();
        break;

      case "ASPERAND":
        buildWeight();
        break;

      case "NUMBER":
        buildRepetitions();
        break;
      default:
      // TODO: Add error handling.
    }
  };

  return {
    interpret() {
      while (!isAtEnd()) {
        interpreteConstruct();
      }

      return { headline, exercises };
    },
  };
};

//----------------------------------------HELPERS------------------------------------------------
const isString = (char: string): boolean => {
  const letters = new RegExp(/[a-zA-Z]/);

  return letters.test(char);
};

const isDigit = (char: string): boolean => {
  const numbers = new RegExp(/\d/);

  return numbers.test(char);
};

const isWeight = (token: Token): boolean =>
  token.type === "ASPERAND" ||
  token.type === "NUMBER" ||
  token.type === "WEIGHT_UNIT";

const isRepetition = (token: Token): boolean =>
  token.type === "NUMBER" ||
  token.type === "FORWARD_SLASH" ||
  token.type === "STAR";
