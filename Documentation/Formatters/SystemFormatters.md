# System Formatters, Converters etc.

The formatters/converters/indicators listed here are provided by BindKraft on a system level and are always available. No additional effort is needed in order to make them available in your view or component.

## Number formatting

### FormatFloat

### FormatInteger



## Date and time formatting/conversion

Date/Time formatting typically involves usage of 2 formatters unless the value is bound to a property requiring Date value. The related formatters can be roughly considered in two categories - `ConvertDateTime` and all others.

### ConvertDateTime

Converts between string date/time representations and Date. Usually present between data loaded from services and UI components or with an formatter between data and text representations/fields.

**parameter** - The format expected in the data. Supported formats are 

* ISO - ISO8601 UTC date time e.g. 2016-01-02T10:25:34Z. The recommended format if the data is transferred through JSON at some point. The date/time in data is assumed UTC and converted to time zone corrected Date and reverse.

* ISOLocal - ISO like without time zone e.g. 2016-01-02T10:25:34 or 2016-01-02 10:25:34. The date/time in data is assumed local and converted to/from Date. This one should be used only when the transport layer and the receiving end (usually server) works that way.

* MS - Microsoft Date(###) format. A format which was widely used in .NET framework in the past. Contains milliseconds from January 1 1970 (Similar to unix epoch) in side escaped string expression e.g. `Date(0123456789)`. This format, while rarely used today is safe and sometimes preferred when developers can choose how to transfer date/time values.

* TICKS - Like MS but just number or number as text. Not recommended for typical JSON based services, but sometimes used by custom communications.

If the parameter is not specified the convertor will use the system setting from 
`System.Default().settings.DefaultTransferDateEncoding`, which is by default `ISO`.

## Miscellaneous

### BooleanConverter

Does the same in both directions. Returns `true` if the value is true-like and `false` if it is a falsy value. A parameter can be specified with a value `invert`, `inv` or `!` which causes the value to be also inverted.

Examples:
```
{read path=something format=BooleanConverter}
{read path=something format=BooleanConverter(!)}
```

Good to ensure a clean Boolean value will come out of the binding. Popular in bindings that control visibility, add css classes etc. For example, imagine you want to show special text when there are no data to display in some repeater:

```HTML
<span data-bind-display[inline]="{read source=__view/repeater1 path=$items.length format=BooleanConverter(!) readdata=$itemschangedevent}">there are no items here</span>
```

### IntegerConverter

Parses the value as integer. This may involve first converting the value to string (If it is some object the toString method's behavior will be important).

Accepts optional parameter that specifies the base, default is 10.

### IsValueEqualToParameter

This simple converter/indicator can help you to intercept certain string value. It returns `true` only if the binding's parameter is the same as the value (case sensitive). If no parameter is specified in the binging or if the parameter is an empty string true will be returned only if the value is `null` or an empty string.

Popular usages of this formatter includes showing icons/elements when certain property contains certain value.

### NullIfEmpty

This formatter returns null when the value passing is considered empty. null values pass without changes, of course. 

By default it works for strings only, but using one of the two possible optional parameters this can be applied to numbers and Booleans.

```
1
{read path=something format=NullIfEmpty}
2
{read path=something format=NullIfEmpty(number)}
3
{read path=something format=NullIfEmpty(bool)}
```

In the above example the formatter will return null in
case 1: if the passing string is null or empty
case 2: If the passing number is null, 0 or NaN
case 3: If the passing value is falsy.

This formatter does the same in both directions and is most often used in database applications that want to store nulls instead of empty values.

### CalcConverter

Enables usage of simple expressions that can compose a result from the passing value, the references specified in the binding and the binding parameter.

It does the same in both directions which makes it inappropriate for virtually any two-way usage (in `bind` bindings.). Use it with `read` and `probe` bindings to make simple calculations in one of the directions. The expression evaluation is much slower than executing Javascript, so be careful when it gets used in scenarios where it will get called too many times in performance demanding parts of the mark-up.

Example:
```HTML
<div data-key="form">
    Field 1: <input type="text" data-class="TextBox" data-key="field1"><br/>
    Field 2: <input type="text" data-class="TextBox" data-key="field2"><br/>
    <span data-bind-display[inline]="{read source=static ref[a]=form/field1@val ref[b]=form/field2@val format=CalcConverter(a-b)}">I am visible when field 2 contains a different number than the one in field 1</span>
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

The `unary operators` must be specified without a space between them and the following literal and are:

- `#` - attempts to convert the argument to integer
- `!` - logical negation
- `@` - returns 1 or 0 depending on the existence of the argument (0 if it is null).
- `$` - converts the argument to string.

The `special keywords are`:

- `value` - the value passing through the formatter
- `parameter` - the parameter specified in the binding

### AppendFormatter

```HTML
<div ... data-bind-text="{bind path=something format=AppendFormatter(kg)}">
```

Appends a suffix to a string value.

parameter - string, trimmed which is appended to the non-empty, non-null strings passing to target and removed when updated into sources.

### DataStateFilter

### DataStateIndicator

### DefaultDateTimeFormat aggregate

### DefaultDateFormat aggregate

### DefaultTimeFormat aggregate

### FormatDateTime

### FormatShortDate

### FormatLongDate

### FormatShortTime

### FormatLongTime

### FormatShortDateTime

### FormatLongDateTime

### IfNullOrEmpty

### NormalizeConverter

### TimeElapsedSince

### TranslateThrough

