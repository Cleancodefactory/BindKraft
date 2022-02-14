# Terminology


## Tree state path explained

Let's assume we have URL like serialization/deserialization and we have at this moment this state path (the path part of URL):

```
/hrm:58/profile/personalinfo
```

So, the raw state data may look something like this (only illustrative):

```Javascript
[
    { name: "hrm", id: 58, $meta: /* something */ },
    { name: "profile", $meta: /* something */ },
    { name: "personalinfo", $meta: /* something */ }

]

```

In our definition this will be represented by 3 object containing certain values and each object will correspond to `Node` definition.

```
Node1 definition/Node2 definition/Node3 definition.
```

`Node` is also called `TSE`. Its possible content consists of:

 - one `Unit` per property

 - optional metadata

Each `Unit` defines how to recognize a value of a `Node` property. Which for example will be something like this for the `name` property of the first node:

```Javascript
Unit("name", "string", [Condition("text", "hrm")])
```

and if we have to define the whole node (the first one) it will be something like this:

```Javascript
    Node( 
        Unit("name", "string", [Condition("text", "hrm")]),
        Unit("id", "num", [Condition("range", 1)]),
        { 
            // Metadata
        }
    )
```

And the definition for the whole current state will be part of the `Map` of the full state tree of the app. And this may look like this:

```Javascript
    Map(
        Node( 
            Unit("name", "string", [Condition("text", "hrm")]),
            Unit("id", "num", [Condition("range", 1)]),
            { 
                // Metadata
            }
        ),
        Map(
            Node( 
                Unit("name", "string", [Condition("text", "profile")]),
                { /* metadata */ }
            ),
            Map(
                Unit("name", "string", [Condition("text", "personalinfo")]),
                { /* metadata */ }
            ),
            Map(
                Unit("name", "string", [Condition("text", "contacts")]),
                { /* metadata */ }
            ),
            Map(
                Unit("name", "string", [Condition("text", "contract")]),
                { /* metadata */ }
            )

            // Optionally maps for further branches
        )
        // Optionally maps for further branches
    )
```