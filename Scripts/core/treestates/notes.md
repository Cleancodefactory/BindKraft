# Notes

## Terminology

TST - TreeState Tree

TSEU - Treestate Element Unit

```
    TSEU :=
		[ 
			name, 			// the name of the element (the value)
			types, 			// the types the element can have
			conditions		// conditions for the types
		]
```

TSE - TreeState Element

```
    TSE := [ TSEU1, TSEU2, ... TSEUn, $meta]
```

In more human understandable terms this gives an object

```Javascript
    {
        tseu1: <val1>,             
        tseu2: <val2>
    }

// example
    [
        { branch: "hrm", id: 23534},
        { area: "timesheets" },
        { user: 1452, weeknumber: 40 }
    ]
```

TSM - TreeState map

```
    TSE_OPEN := [TSEU1]
    TSEU1 := ["rootbranch", string, /open_new/]    
    TSE_HRM := [TSEU2]
    TSEU2 := ["rootbranch", string, /hrm/]    
    
    open_new/
    hrm/123

    TSE_XHRM := TSEU3
    TSEU3 := ["id", number, > 0 ]

    http://..../route/HRM/hrm/123/profile/contract
    state: [{branch: "hrm", $meta: {...}}, {"id": 123}, {section: "profile"}, {section: "contract"}]

    hrm/123/profile/personal_info


    [
        [TSE_OPEN],
        [TSE_HRM 
            [
                TSE_XHRM
                    [
                        [TSE_profile
                            [
                                [TSE_personalinfo]
                                [TSE_contacts]
                                [TSE_contract]
                            ]
                        ]
                    ]
            ]
        ]
    ]



```
