# Translators

The `trasnlators` are another simple feature for deep in-code usage (usage not unlike the [IValueChecker](CoreClasses/IValueChecker.md)). 

The translators are just data converters of any kind and for any purpose. The ITranslator interface just starts the hierarchy of interfaces that can branch out to serve the needs of various kinds of components through more specialized interfaces extending it.

A trasnlator implements an interface that extends ITranslator directly or indirectly. Interfaces defining families of translators can exist this way. The resulting polymorphism would depend on their specific purpose, but having a specialized hierarchy for all of them makes possible wider usage than ad-hoc specifications for each case where something similar is needed.

**What is a translator**? The ITranslator interface is as simple as this:

```Javascript
function ITranslator() {}
ITranslator.Interface("ITranslator");
ITranslator.prototype.PerformTranslation(input);
```

The only method it has should translate the input into the desired output. Obviously this is quite non-specific. Yet it is an operation that can be performed by code that has the _input_ and the _translator_, but does not care what they are, which is already an usable feature.

To make translators really useful we have to define more specific interfaces which can add some configuration capabilities, but most importantly they will also imply more specific **input** data models and specific data **output** models.

## Illustration with one of the real cases

In BindKraft exist components that use `IParameters` as a way to support parameterization with linear collection of `key/value` pairs. This is typically easily convertible to plain Javascript objects and thus it is widespread practice. Yet the parameters usually have different meanings and a subset of them often needs to be extracted for usage different from the rest.

A translator can be built to extract these parameters (with some configuration) and their meaning in more appropriate form (for their purpose).

Take the `DataArea` component and `connectors` ([Connector](Connector.md)) it uses. The connectors are also often used by other components which often share the connectors with DataArea(s). The `connectors` are an abstract interface for resource/data requests which is also the reason to keep their abstraction not too specialized. As a result they use just a set of parameters (IParameters) without any explicit assumption what each parameters is for. DataArea on the other hand also uses IParameters as a base "language" of its parameterization, but in addition it has a number of other properties that are intended to specify which parameters (by key-name) serve certain purpose - for paging, ordering, count of data items etc.

So, what we have here is the need of specialization on one end and the need to keep things abstract and non-specific in the middle (where the connection and the transfer happen).

