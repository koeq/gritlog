export {};

// DEFINITIONS

//  lexeme: are the smallest sequence of substrings of the source which still represent something.
// tokens: a token is made out of a lexeme and additional data to that lexeme (e.g. token type)

// CONSTANTS
// Single-character tokens
const ASPERAND = "@";
const FORWARD_SLASH = "/";
const STAR = "*";
const HASHTAG = "#";
// Keywords
const KILOGRAMS = "kg";
const POUNDS = "lbs";
// End of file
const EOF = "EOF";

type TokenType =
  // Single sign
  | "ASPERAND"
  | "FORWARD_SLASH"
  | "STAR"
  | "HASHTAG"
  // Literals
  | "NUMBER"
  // The token type "STRING" represents one or multiple letters in this context
  | "STRING"
  // Keywords
  | "KILOGRAMS"
  | "POUNDS"
  // End of file
  | "EOF";

type Literal = string | number;

interface Token {
  readonly tokenType: TokenType;
  readonly lexeme: string;
  // TODO: what is the correct type of literal here
  readonly literal: Literal | null;
  readonly line: number;
}

//------------------------------------------PARSER-----------------------------------------------
//-----------------------------------------------------------------------------------------------

export function parse(source: string | undefined) {
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
      const next = source.charAt(current);
      current = current + 1;

      return next;
    }

    function match(expected: string): boolean {
      if (isAtEnd()) return false;
      if (source.charAt(current) != expected) return false;
      current = current + 1;

      return true;
    }

    function peek() {
      if (isAtEnd()) return "\0";
      return source.charAt(current);
    }

    function peekNext() {
      if (current + 1 >= source.length) return "\0";

      return source.charAt(current + 1);
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
      tokens.push({ tokenType: type, lexeme: text, literal, line });
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
          line++;
          break;

        default:
          // if (isString(char)) {
          //   string();
          // }

          if (isDigit(char)) {
            number();
          }

          error(line, "Unexpected character.");
          break;
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
          tokenType: "EOF",
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
  console.log(tokens);
}

//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

//----------------------------------------HELPERS------------------------------------------------
function isString(char: string): boolean {
  const letters = new RegExp(/[a-zA-Z]/);

  return letters.test(char);
}

function isDigit(char: string): boolean {
  const numbers = new RegExp(/\d/);

  return numbers.test(char);
}
