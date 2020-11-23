import './lib/string.ext';
import { eTokens, Token } from './lib/tokens';
import { Lexer } from './lib/lexer';
import { ParsingError } from './lib/error';

/**
 * Parent class for Abstract Syntax Tree
 */
abstract class AST {
  public getName(): string {
    return this.constructor.name;
  }
}

/**
 * jObject - class for Objects;
 */
class jObject extends AST {
  public children: jNameValue[] = [];
  constructor() {
    super();
  }
}

/**
 * jArray - class for Arrays
 */
class jArray extends AST {
  public children: AST[] = [];
  constructor() {
    super();
  }
}

/**
 * jPrimative - class for number, string, booleans, and null
 */
class jPrimative extends AST {
  private token: Token;
  public value: number | string | boolean | null;
  constructor(token: Token) {
    super();
    this.token = token;
    if (token.isTrue()) this.value = true;
    else if (token.isFalse()) this.value = false;
    else if (token.isNull()) this.value = null;
    else this.value = token.value;
  }
}

/**
 * jNameValue - class for name-value pairs
 */
class jNameValue extends AST {
  public name: string;
  public value: jPrimative | jObject | jArray;
  constructor(name: string, value: jPrimative | jObject | jArray) {
    super();
    this.name = name;
    this.value = value;
  }
}

abstract class Node_Visitor {
  public visit(node: AST): any {
    if (node.getName() === 'jPrimative') {
      return this.visit_jPrimative(node);
    } else if (node.getName() === 'jNameValue') {
      return this.visit_jNameValue(node);
    } else if (node.getName() === 'jObject') {
      return this.visit_jObject(node);
    } else if (node.getName() === 'jArray') {
      return this.visit_jArray(node);
    }

    this.error('No visit_method()');
  }

  protected error(msg: string): void {
    throw new ParsingError(msg);
  }

  protected abstract visit_jObject(node: AST): void;
  protected abstract visit_jArray(node: AST): void;
  protected abstract visit_jNameValue(node: AST): void;
  protected abstract visit_jPrimative(
    node: AST
  ): number | string | boolean | null;
}

/**
 * Create object from AST
 */
export class JSONBuilder extends Node_Visitor {
  private tree: AST;

  constructor(tree: AST) {
    super();
    this.tree = tree;
  }

  protected visit_jObject(node: jObject): {} {
    const obj: Record<string, any> = {};
    for (const child of node.children) {
      obj[child.name] = this.visit(child.value);
    }
    return obj;
  }

  protected visit_jArray(node: jArray): any[] {
    const arr = [];
    for (const child of node.children) {
      arr.push(this.visit(child));
    }
    return arr;
  }

  protected visit_jNameValue(node: jNameValue): void {}

  protected visit_jPrimative(
    node: jPrimative
  ): number | string | boolean | null {
    return node.value;
  }

  public getJSON() {
    return this.visit(this.tree);
  }
}

/**
 * Parser class
 */
export class Parser {
  public current_token: Token | null = null;
  private lexer: Lexer;

  constructor(text: string) {
    this.lexer = new Lexer(text);
    this.current_token = this.lexer.get_next_token();
    return this;
  }

  /**
   * Handle errors
   * @param msg
   */
  private error(msg: string): void {
    throw new ParsingError(msg);
  }

  /**
   * compare the current token type with the passed token thype and if they match
   * then 'eat' the current token and assign the next token to the current_token
   * otherwise raist and excpetion
   * @param token_type
   */
  private eat(token_type: eTokens): void {
    if (this.current_token?.type === token_type) {
      this.current_token = this.lexer.get_next_token();
    } else {
      this.error('Parser invalid syntax');
    }
  }

  private value(): jObject | jArray | jPrimative {
    const token = this.current_token;
    if (token?.isBeginObject()) {
      return this.object();
    }

    if (token?.isBeginArray()) {
      return this.array();
    }

    if (token?.isNumber()) {
      this.eat(eTokens.NUMBER);
      return new jPrimative(token);
    }

    if (token?.isString()) {
      this.eat(eTokens.STRING);
      return new jPrimative(token);
    }

    if (token?.isTrue()) {
      this.eat(eTokens.TRUE);
      return new jPrimative(token);
    }

    if (token?.isFalse()) {
      this.eat(eTokens.FALSE);
      return new jPrimative(token);
    }

    if (token?.isNull()) {
      this.eat(eTokens.NULL);
      return new jPrimative(token);
    }

    this.error('Parse unknown value');
    // We won't get here
    return new jPrimative(new Token(eTokens.NULL, 'NULL'));
  }

  private object(): jObject {
    this.eat(eTokens.BEGIN_OBJECT);
    const nodes = this.name_value_list();
    this.eat(eTokens.END_OBJECT);

    const obj = new jObject();
    for (const node of nodes) {
      obj.children.push(node);
    }

    return obj;
  }

  private array(): jArray {
    this.eat(eTokens.BEGIN_ARRAY);
    const nodes = this.value_list();
    this.eat(eTokens.END_ARRAY);

    const arr = new jArray();
    for (const node of nodes) {
      arr.children.push(node);
    }

    return arr;
  }

  private name_value_list(): jNameValue[] {
    const node = this.name_value();

    const results: jNameValue[] = [node];

    while (this.current_token?.isComma()) {
      this.eat(eTokens.COMMA);
      results.push(this.name_value());
    }

    return results;
  }

  private name_value(): jNameValue {
    const name = <string>this.current_token?.value;
    this.eat(eTokens.STRING);
    this.eat(eTokens.COLON);
    const value = this.value();

    return new jNameValue(name, value);
  }

  private value_list(): AST[] {
    const node = this.value();

    const results: AST[] = [node];
    while (this.current_token?.isComma()) {
      this.eat(eTokens.COMMA);
      results.push(this.value());
    }

    return results;
  }

  public parse(): any {
    const node = this.value();
    if (!this.current_token?.isEOF()) {
      this.error('Parser returned before end');
    }

    const jsonBuilder = new JSONBuilder(node);
    return jsonBuilder.getJSON();
  }
}
