# System Formatters, Converters etc.

## Miscellaneous

### CalcConverter

Enables usage of simple expressions that can compose a result from the passing value, the references specified in the binding and the binding parameter.

Example:
```HTML
<div data-key="form">
    Field 1: <input type="text" data-class="TextBox" data-key="field1"><br/>
    Field 2: <input type="text" data-class="TextBox" data-key="field2"><br/>
    <span data-bind-display[inline]="{read source=static ref[a]=form/field1@val ref[b]=form/field2@val format=CalcConverter(a-b)}">I am visible when field 2 contains the different number than the one in field 1</span>
</div>
```

The expression syntax:

```EBNF

expression = variable , {operator , variable};
operator = "|" | "&" | "+" | "-" | "*" | "/";
variable = [unary,] literal;
unary = "#" | "!" | "@" | "$";
literal = integer | string | reference | "value" | "parameter";
integer = digit {, digit};
digit = "0" | "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9";
string = "'", {char}, "'";
; char can be anything except "}"
reference = char {, char};
```

The `reference` above is searched among the `ref` specified on the binding and null is returned if not found. "@" kind of references are recommended because the expressions cannot deal with non-scalar values.

`operator`s are:

- `|` - Logical OR
- `&` - Logical AND
- `+` - Arithmetic summation of both sides or concatenation of strings if any of hte sides is a string.
- `-` - Subtraction
- `*` - Multiplication
- `/` - division

The unary operators must be specified without a space between them and the following literal and are:

- `#` - attempts to convert the argument to integer
- `!` - logical negation
- `@` - returns 1 or 0 depending on the existence of the argument (0 if it is null).
- `$` - converts the argument to string.