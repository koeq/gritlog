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
// Literals
let NUMBER: number;
let STRING: string;
// Keywords
const KILOGRAMS = "kg";
const POUNDS = "lbs";
// End of file
const EOF = "EOF";

interface T {
  // Single-character Tokens
  readonly ASPERAND: "@";
  readonly STAR: "*";
  readonly HASHTAG: "#";
  readonly FORWARD_SLASH: "/";
  // Keywords
  readonly KILOGRAMS: "kg";
  readonly POUNDS: "lbs";
  // Literals
  readonly STRING: string;
  readonly NUMBER: number;
  // End of file
  readonly EOF: "EOF";
}

interface TokenLiterals {
  NUMBER: number;
  STRING: string;
}

type TokenTypes = T[keyof T];

interface Token {
  readonly tokenType: TokenTypes;
  readonly lexeme: string;
  // TODO: what is the correct type of literal here
  readonly literal: {};
  readonly line: number;
}

export function parse(source: string | undefined) {
  if (source === undefined) {
    return;
  }

  const Scanner = (source: string) => {
    const tokens: Token[] = [];
    let start = 0;
    let current = 0;
    const line = 1;

    function isAtEnd() {
      return current >= source.length;
    }

    function advance(): string {
      // this passes the value of current into charAt and then increments current by one
      // this behaviour is very implicit and might lead to bugs
      return source.charAt(current++);
    }

    function addToken(type: TokenTypes) {
      const text = source.substring(start, current);
      tokens.push({ tokenType: type, lexeme: text, literal: {}, line });
    }

    function scanToken() {
      const char = advance();
      switch (char) {
        case "@":
          addToken(ASPERAND);
          break;
        case "*":
          addToken(STAR);
          break;
        case "#":
          addToken(HASHTAG);
          break;
      }
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
          literal: {},
          line,
        });

        return tokens;
      },
    };
  };

  const scanner = Scanner(source);

  const tokens: Token[] = scanner.scanTokens(source);

  for (const token of tokens) {
    console.log(token);
  }
}

// EORROR HANDLING
// let hadError: boolean = false;
// function error(line: number, message: string) {
//   report(line, "", message);
// }

// function report(line: number, where: string, message: string) {
//   console.log(`[line ${line}] Error ${where}: ${message}`);
//   hadError = true;
// }

// if (hadError) {
//   return;
// }
