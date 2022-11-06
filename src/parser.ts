export {};

// Parsing:
//          1. lexical analysis -> creates tokens out of the strings
//             (e.g Benchpress 100kg 3*8 ---> "Benchpress", "100kg", "3*8")

interface TokenType {
  readonly asperand: "@";
  readonly forwardSlash: "/";
  readonly star: "*";
  readonly hashtag: "#";
  readonly number: number;
  readonly string: string;
}

interface Token {
  readonly tokenType: TokenType;
  readonly lexeme: string;
  readonly literal: string;
  readonly line: number;
}

//          2. syntactic analysis -> gives the logical meaning to that token
//             (e.g. 3*8 ---> 8/8/8)
