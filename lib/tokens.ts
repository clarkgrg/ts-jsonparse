/**
 * eTokens - Valid JSON tokens
 */

export enum eTokens {
  BEGIN_ARRAY = '[', // left square bracket
  BEGIN_OBJECT = '{', // left curly bracket
  END_ARRAY = ']', // right square bracket
  END_OBJECT = '}', // right curly bracket
  COLON = ':',
  COMMA = ',',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  NULL = 'NULL',
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  EOF = 'EOF',
}

/**
 * Define JSON tokens
 */
export class Token {
  constructor(public type: eTokens, public value: number | string | null) {}

  public toString(): string {
    return `Token(${this.type}, ${this.value})`;
  }

  public isBeginArray(): boolean {
    return this.type === eTokens.BEGIN_ARRAY;
  }

  public isBeginObject(): boolean {
    return this.type === eTokens.BEGIN_OBJECT;
  }

  public isEndArray(): boolean {
    return this.type === eTokens.END_ARRAY;
  }

  public isEndObject(): boolean {
    return this.type === eTokens.END_OBJECT;
  }

  public isColon(): boolean {
    return this.type === eTokens.COLON;
  }

  public isComma(): boolean {
    return this.type === eTokens.COMMA;
  }

  public isTrue(): boolean {
    return this.type === eTokens.TRUE;
  }

  public isFalse(): boolean {
    return this.type === eTokens.FALSE;
  }

  public isNull(): boolean {
    return this.type === eTokens.NULL;
  }

  public isNumber(): boolean {
    return this.type === eTokens.NUMBER;
  }

  public isString(): boolean {
    return this.type === eTokens.STRING;
  }

  public isEOF(): boolean {
    return this.type === eTokens.EOF;
  }
}
