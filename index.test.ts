import { Lexer } from './lib/lexer';
import { Parser } from './index';

test('Lexer', () => {
  const json =
    '{ "name": "greg", "age": 30, "married": true, "employer": null }';
  const lexer = new Lexer(json);
  expect(lexer.get_next_token()?.type).toBe('{');
  expect(lexer.get_next_token()?.value).toBe('name');
  expect(lexer.get_next_token()?.value).toBe(':');
  expect(lexer.get_next_token()?.value).toBe('greg');
  expect(lexer.get_next_token()?.type).toBe(',');
  expect(lexer.get_next_token()?.value).toBe('age');
  expect(lexer.get_next_token()?.value).toBe(':');
  expect(lexer.get_next_token()?.value).toBe(30);
  expect(lexer.get_next_token()?.type).toBe(',');
  expect(lexer.get_next_token()?.value).toBe('married');
  expect(lexer.get_next_token()?.value).toBe(':');
  expect(lexer.get_next_token()?.type).toBe('TRUE');
  expect(lexer.get_next_token()?.type).toBe(',');
  expect(lexer.get_next_token()?.value).toBe('employer');
  expect(lexer.get_next_token()?.value).toBe(':');
  expect(lexer.get_next_token()?.type).toBe('NULL');
});

test('Parser - array of objects', () => {
  const text = `[
    { "name": "greg", "age": 30, "married": true, "employer": null },
    { "name": "amy", "age": 33, "married": false, "employer": "Gaggle" }
  ]`;
  const parser = new Parser(text);
  const obj = parser.parse();
  expect(obj[1].name).toEqual('amy');
  expect(obj[0].age).toEqual(30);
});

test('Parser - simple object', () => {
  const text = `{ "name": "greg", "age": 30, "married": true, "employer": null }`;
  const parser = new Parser(text);
  const obj = parser.parse();
  expect(obj.name).toEqual('greg');
  expect(obj.employer).toEqual(null);
});

test('Parser - string', () => {
  const text = '"dog"';
  const parser = new Parser(text);
  const obj = parser.parse();
  expect(obj).toEqual('dog');
});

test('Parser - nested arrays', () => {
  const text = `{
    "1": [
      [
        [1.11, 2.22],
        [3.33, 4.44]
      ]
    ]
  }`;
  const parser = new Parser(text);
  const obj = parser.parse();
  expect(obj['1'][0][0]).toEqual([1.11, 2.22]);
});
