# Options

Options in the binding syntax enable or disable certain features and behaviors. The reasons to need an option to do so will vary - from mutually exclusive behaviors to potentially damaging ones (if not used where appropriate), to performance related.

## Syntax:

`options=option1,option2,option3,...,optionN`

The options are listed as keywords (see the list below), separated by commas, without any spaces between the keywords and the commas or the "=" sign.

example:
```
    options=async,freezesite,operation
```

## Supported options:

`disabled` - disables the binding's `updateTarget`/`updateSource` functionality. Direct usage of the `set_targetValue`/`set_targetValue` will continue to work - i.e. direct usage of the binding is not disabled, but its participation in mass updates is.

`async`, `asyncread`, `asyncwrite` - asynchronous processing of the updateTargets/Sources. The `async` will perform both asynchronously, while `asyncread` is only for `updateTargets` and `asyncwrite` only for `updateSources`. Internally this is done with this.async (see `BaseObject`) which creates a task and registers it with the global task scheduler for execution (_For beginners_: _this is advanced technique that "replaces" the setTimeout._). Using asyncwrite or async on read/write bindings (of type [`bind`](bindingtype.md)) is not recommended, because the source updates are typically expected to be synchronous. These work witn `data-on-event` bindings too. In that case they will invoke the handler asynchronously - in a scheduled async task. This can be used when the handler performs heavy processing you want to delay in order to keep the browser responsive.

`freezesite` - If the target supports `IFreezable` will freeze it while setting the target value. This is especially useful when the property being the target of the binding invokes complex processing when set.

`persistable` - enables the binding to change the data entity state when performing update sources. For example if the binding path is `a.b.c` the state of the object at `a.b` will be updated. (TODO: Document the data state API after rearranging it more logically)

`operation` - works only for `updateTarget`/`set_targetValue`. If the binding receives an `Operation` as a value to be set on the target, it will await the Operation and set its result to the target. If the flag is not specified the Operation itself will be assigned. Both behaviors can be desired - you may have an object dealing with an `Operation` (or more than one of them) on its own internally or an object that does not deal with Operations and should receive the result when available.

`nodefault`, `preventdefault` - works only on `data-on-domevent` bindings and only for DOM events. Prevents the default processing (see preventDefault of the DOM event)

**Old options**

`nonpersistable` - For backwards compatibility this is still supported. In older versions (much older) the functionality now enabled with the `persistable` option (see below) was "on" by default and the `nonpersistable` option excluded bindings from it. This mode can still be turned on and this option will make sense then. However, this mode is extremely inconvenient and will be fully deprecated soon (even the ability to turn it on).


