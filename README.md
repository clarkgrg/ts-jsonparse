# ts-jsonparse

## Overview

I decided one afternoon to write a JSON parser to improve my Typescript skills and reinforce what I learned from Ruslan Spivak's excellent blog on [Let's Build a Simple Interpreter](https://ruslanspivak.com/lsbasi-part1/). This is a Typescript implementation of a simple JSON parser. It does not handle exponention numbers or backslashes '\' in strings.

I used the [JSON Interchange Standard - 2nd addition](https://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf) as a reference for the implementation

## Installation

```
npm i ts-jsonparse
```

## To Use

```Javascript
import { Parser } from 'ts-jsonparse';

const parser = new Parser(text);
const obj = parser.parse();
```

## Background

The JSON parser is divided into 3 parts:

- Lexer - tokenizes the JSON string
- Parser - Builds Abstract Syntax Tree
- JSONBuilder - Walks the AST and builds a Javascript representation of the JSON.

### Lexer

The job of the Lexer is to break the parts of the string into tokens. For JSON we look for the following tokens.

```Javascript
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
```

### Parser

The goal of the parser is to find structure in the stream of tokens. I choose to implement an Abstract Syntax Tree (AST) to represent the JSON string. I choose for the AST to include 4 Nodes:

jObject - to represent the object  
jArray - to represent the array  
jNameValue - to represent a name - value pair  
jPrimative - to represent a number, string, true, false, or null

The Parser implements the following JSON Grammer to build the AST.

```
value : object
| array
| NUMBER
| STRING
| TRUE
| FALSE
| NULL

object : BEGIN_OBJECT name_value_list END_OBJECT

array : BEGIN_ARRAY value_list END_ARRAY

name_value_list: name_value
| name_value COMMA name_value_list

name_value: string COLON value

value_list: value
| value COMMA value_list
```

### JSONBuilder

The JSONBuilder walks the AST and builds the Javascript represntation of the JSON string.
