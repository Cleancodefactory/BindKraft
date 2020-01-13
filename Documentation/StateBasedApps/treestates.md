# Tree states - app state map

See [Treestates overview](overview.md) first.

This is the BK way to define a tree of state nodes. Starting from inside out a treestates definition consists of:

- TSEU: Tree State Element Unit - describes a single value (see TSE to put this into context). TSEU defines the name of the value, its possible types and conditions (if any).

- TSE: Tree State Element - describes a state node from the states tree. A node can be defined by one or more values, thus a TSE is defined by a set of one or more TSEU. Each TSEU in the TSE defines one of the values and the conditions under which it is considered as part of the TSE.

- TSM: Tree State Map - recursive definition that defines the tree of TSE under a TSE.

A simple example showing how this looks:

```Javascript

var cond1to20 = TreeStatesConvert.Condition("range",0,20);
var cond21to40 = TreeStatesConvert.Condition("range",21,40);
var condAlphaA = TreeStatesConvert.Condition("regex",/^A[a-zA-Z]+$/);
var condAlphaB = TreeStatesConvert.Condition("regex",/^B[a-zA-Z]+$/);

var ExampleTSE1 = [
    [ "alpha", "num,null", [cond1to20] ],
    [ "beta", "string",[condAlphaA]]
];
var ExampleTSE2 = [
    [ "alpha", "num,null", [cond21to40] ],
    [ "beta", "string"]
];
var ExampleTSE21 = [
    [ "gamma", "string,null", [condAlphaB] ]
];
// Map set - TSMS
var ExampleTSMS = [
    [ // Map - TSM
        [ExampleTSE1]
    ],
    [ 
        [ExampleTSE2],
        [ 
            [ExampleTSE21]
        ]
    ]
];

```

In the example, assume that all used symbols are variables that contain the corresponding definitions.

## Definitions - overview

**TSE** - Tree State Element

> TSE describes a state node - a node from the state tree. The TSE can contain one or more value slots (units).

TSE := [ TSEU1, TSEU2, ... TSEUN ]

**TSEU** - Tree State Unit

> TSEU describes a single value slot in a TSE. To belong to the unit and the element respectively a value (slot) can:

- be of one or more specified types
- for each type there can be certain constraints.

These define the conditions that the value has to meet in order to be considered unit of a certain TSE.

**TSM** - Tree State Map

> TSM describes all the states in which the app can be.

TSM := [ *([TSE] [TSM])]

**TSMS** - Tree State Map Set

> Set of alternative TSM. The top level API functions accept TSMS, so the definition of an app state tree should be structured that way even if there is only a single Tree State Map.

_The structures do not contain properties or array elements that can identify them as TSM, TSE or TSEU which makes the structure important._

## Definitions - syntax

Treestates are defined in arrays

### TSEU

> `[ name, typelist, [condition*] ]` - A tree state unit is the smallest definition unit of a tree states definition.

> **name** - string, the name of the unit

> **typelist** - string, comma separated list of the types this value can be. Currently supported types are: `num`, `string`, `bool`, `null`.

> **condition** - Array of zero or more conditions. A condition is currently created through the TreeStatesConvert.Condition method:

```Javascript

var cond1to20 = TreeStatesConvert.Condition("range",0,20);

```

The **Condition** method takes one or more arguments, the first being the registered name of the condition, then depending on the specific condition follow condition specific parameters.

Currently all the conditions are kept in a static object `TreeStatesConvert.Conditions`. A registration mechanism will be introduced with the matured version of the feature.

Each condition is an object:

```Javascript
{
    type: name,
    proc: function(value[, ... ]) {}
}

```
The `type` is the name of the name of the type to which this condition applies. When specified in TSEU, each condition is applied only if it is for the type of the current value. For example a TSEU can specify `[ "mytseu", "num,string", [myrange]]`. If we assume that myrange is a condition checking the range of a numeric value, then this TSEU will match all string values and those numeric values for which the condition is true.


At the moment of writing there are very few conditions defined in BindKraft:

- **range**, applicable to `num`, two optional parameters: `low` -lower border for the value, `high` - higher border for the value.

- **text**, applicable to `string`. Exact string case insensitive. One argument - the string the value has to match the match is case insensitive.

- **number**, applicable to `num`. Exact number. One argument - the number the value has to be.

- **regex**, applicable to `string`. Regular expression condition. One argument - the regular expression that has to be matched.

- **bool**, applicable to `bool`. Boolean value. One argument - the value that has to be matched (`true` | `false`).





