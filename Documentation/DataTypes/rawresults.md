# Raw results

The raw results is a structure used with data usually coming from/going to database or another table-like source.

## Structure

```Javascript
// Variant 1
{
    count: 123 // <number>
    records: [ // alternative names: list, data, entries, results
        // Records
        { field1: value1, field2: value2,...},
        { field1: value1, field2: value2,...}
    ]
}
// Variant 2 - preferred!
{
    count: { 
        count: 123 // <number>
    },
    records: [ // alternative names: list, data, entries, results
        // Records
        { field1: value1, field2: value2,...},
        { field1: value1, field2: value2,...}
    ]
}
```

The data format was introduced in practice and this unfortunately brought some variation. For future implementations **Variant 2 is strongly recommended**, because it can handle additional data if necessary.

Count is the total count of the records the source can provide under the current conditions (this may depend on parameters, for instance).

The name of the records array varies and again the preferred name for future implementations is **records**.

BindKraft library classes would be configurable or will support all the mentioned forms. Where possible they will pass the data transparently leaving the details for the code that has to deal with the format. E.g. DataArea is configurable and a connectors often do not need know the specific format of the data they fetch - this is used as much as possible, only connectors that need to understand the data in order to extract it will digest the format.


## Older alternative form

```Javascript
[ // alternative names: list, data, entries, results
        // Records
    { field1: value1, field2: value2,..., count: number},
    { field1: value1, field2: value2,..., count: number}
]
```

In this form the total count of the records is put in an additional field, included in every record. This is, of course, ineffective and should be avoided. There are no plans to support this on general basis. DataArea supports it, but only connectors that pass the data through themselves transparently will work with this.

## Remarks

When used for setting/writing data the count can be omitted with its entire section (in future some extended info can be included there and this may change a little, but in any case the section will remain optional.)