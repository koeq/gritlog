export {};

// DEFINITIONS

//  lexeme: are the smallest sequence of substrings of the source which still represent something.
// tokens: a token is made out of a lexeme and additional data to that lexeme (e.g. token type)

interface TokenType {
  // Single-character Tokens
  readonly asperand: "@";
  readonly forwardSlash: "/";
  readonly star: "*";
  readonly hashtag: "#";

  // Literals
  readonly number: number;
  readonly string: string;

  // Keywords
  readonly kilograms: "kg";
  readonly pounds: "lbs";
}

interface Token {
  readonly tokenType: TokenType;
  readonly lexeme: string;
  readonly literal: string;
  readonly line: number;
}

// ERROR HANDLING:
function parse(source: string | undefined) {
  let hadError: boolean = false;

  if (source === undefined) {
    return;
  }

  function scanTokens(source: string): Token[] {
    return [];
  }

  const tokens: Token[] = scanTokens(source);

  for (const token of tokens) {
    console.log(tokens);
  }

  function error(line: number, message: string) {
    report(line, "", message);
  }

  function report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error ${where}: ${message}`);
    hadError = true;
  }

  if (hadError) {
    return;
  }
}
