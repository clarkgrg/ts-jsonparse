import './string.ext';
import { eTokens, Token } from './tokens';
import { ParsingError } from './error';

/**
 * Tokenize JSON
 */
export class Lexer {
  private text: string;
  private pos: number = 0;
  private current_char: string | null = '';

  constructor(text: string) {
    this.text = text;
    this.current_char = text[this.pos];
  }

  /**
   * Throw an error message
   * @param msg
   */
  private error(msg: string): void {
    throw new ParsingError(msg);
  }

  /**
   * Advance the 'pos' pointer and set the 'current_char' variable
   */
  private advance(): void {
    this.pos += 1;
    if (this.pos > this.text.length - 1) {
      this.current_char = null; // indicates End of Input
    } else {
      this.current_char = this.text[this.pos];
    }
  }

  /**
   * Look at the next character
   */
  private peek(num: number): string | null {
    const peek_pos = this.pos + num;
    if (peek_pos > this.text.length) {
      return null;
    } else {
      return this.text[peek_pos];
    }
  }

  /**
   * skip whitespace
   */
  private skip_whitespace(): void {
    while (this.current_char?.isspace()) {
      this.advance();
    }
  }

  /**
   * Return a (multidigit) integer or float consumed from the input.
   */
  private number(): Token {
    let result: string = '';
    let token;
    while (this.current_char?.isdigit()) {
      result += this.current_char[0];
      this.advance();
    }

    if (this.current_char === '.') {
      result += this.current_char[0];
      this.advance();

      while (this.current_char?.isdigit()) {
        result += this.current_char[0];
        this.advance();
      }
      token = new Token(eTokens.NUMBER, parseFloat(result));
    } else {
      token = new Token(eTokens.NUMBER, parseInt(result));
    }
    return token;
  }

  /**
   * Return a string from the input
   */
  private string(): Token {
    let result: string = '';
    while (this.current_char !== '"') {
      result += this.current_char;
      this.advance();
    }

    this.advance(); // ending \"
    return new Token(eTokens.STRING, result);
  }

  /*
   * This method is responsible for breaking a sentence
   * apart into tokens. One token at a time.
   */
  public get_next_token(): Token | null {
    while (this.current_char) {
      if (this.current_char?.isspace()) {
        this.skip_whitespace();
        continue;
      }

      if (this.current_char === '[') {
        this.advance();
        return new Token(eTokens.BEGIN_ARRAY, '[');
      }

      if (this.current_char === ']') {
        this.advance();
        return new Token(eTokens.END_ARRAY, '[');
      }

      if (this.current_char === '{') {
        this.advance();
        return new Token(eTokens.BEGIN_OBJECT, '{');
      }

      if (this.current_char === '}') {
        this.advance();
        return new Token(eTokens.END_OBJECT, '}');
      }

      if (this.current_char.isdigit()) {
        return this.number();
      }

      if (this.current_char === ':') {
        this.advance();
        return new Token(eTokens.COLON, ':');
      }

      if (this.current_char === ',') {
        this.advance();
        return new Token(eTokens.COMMA, ',');
      }

      if (this.current_char === '"') {
        this.advance();
        return this.string();
      }

      if (
        this.current_char === 't' &&
        this.peek(1) === 'r' &&
        this.peek(2) === 'u' &&
        this.peek(3) === 'e'
      ) {
        this.advance();
        this.advance();
        this.advance();
        this.advance();
        return new Token(eTokens.TRUE, 'TRUE');
      }

      if (
        this.current_char === 'f' &&
        this.peek(1) === 'a' &&
        this.peek(2) === 'l' &&
        this.peek(3) === 's' &&
        this.peek(4) === 'e'
      ) {
        this.advance();
        this.advance();
        this.advance();
        this.advance();
        this.advance();
        return new Token(eTokens.FALSE, 'FALSE');
      }

      if (
        this.current_char === 'n' &&
        this.peek(1) === 'u' &&
        this.peek(2) === 'l' &&
        this.peek(3) === 'l'
      ) {
        this.advance();
        this.advance();
        this.advance();
        this.advance();
        return new Token(eTokens.NULL, 'NULL');
      }

      this.error(`Unknown input ${this.current_char} at position ${this.pos}`);
    }

    return new Token(eTokens.EOF, null);
  }
}
