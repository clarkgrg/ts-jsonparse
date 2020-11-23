# ts-jsonparse

I decided one afternoon to write a json parser to improve my Typescript skills and reinforce what I learned from Ruslan Spivak's excellent blog on [Let's Build a Simple Interpreter](https://ruslanspivak.com/lsbasi-part1/).

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
