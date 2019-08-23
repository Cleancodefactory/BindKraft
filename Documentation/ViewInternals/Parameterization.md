# Parameterization details

## Parsed/prepared parameters 

This is the form currently obtained by calling JBUtil.pareParameters and then used to apply them to instances in JBUtil.parameterize.

While the general form will be kept without serious changes, decoupling these a little seems likely in near future.

## JBUtil.parseParameters

`parseParameters` deals with both - string form and object forms. The string form comes from various cases in the markup, e.g.

- Parameters after the class name in data-class attribute.
- Parameters in data-parameters attribute.
- Parameters for slave/inner objects maintained by Base classes (a good example are rules of a Validator)

The object form is usually provided programmatically...

