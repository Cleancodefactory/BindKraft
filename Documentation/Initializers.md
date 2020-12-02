# Initializer classes

These classes are simple solution that enables initialization of member fields of an instance of a class when it is created. They also provide a description and some type information usable for BindKraft tooling apps. For this reason aside of the initializers that are obviously needed, there are some which provide just better described code and ability to use `Defaults` for their initialization.

The first and foremost gain from using initializers is that they enable the programmer to write initialization code in the body of the class instead of the constructor. This keeps the constructor cleaner and also helps to avoid some common mistakes we all do from time to time.

**Example:** If you want an array in a field of your class this code will most likely produce the wrong result:

```Javascript

function MyClass() {
    MyBaseClass.apply(this, arguments);
    ... more code ...
}
MyClass.Inherit(MyBaseClass, "MyClass");

MyClass.prototype.myArray = [];
```

The `myArray` field will contain a reference to the same array in all the instances produced from this class and this is not what we typically need. In everyday coding in such a scenario one usually wants a new array to be instantiated for each instance. This can be achieved by adding `this.myArray = []` line in the constructor and this is Ok, but when such fields become too many and there is stillsome important code to include in the constructor (code that likely works with these member fields) it easily becomes too crowded and hard to read. Having such members initialized in the body and initialized more automatically like in many compiled languages is obviously desirable. So, with an initializer this can become:

```Javascript
function MyClass() {
    MyBaseClass.apply(this, arguments);
    ... code that can use myArray safely ...
}
MyClass.Inherit(MyBaseClass, "MyClass");

MyClass.prototype.myArray = new InitializeArray("Array storing important stuff");
```

The initialization happens in the `BaseObject`'s constructor which gets called down the chain of constructors that in the example code above starts with calling the MyBaseClass over the instance of MyClass in the first line of the constructor.

**Exceptions** exist - for instance sometimes the constructor of the base class has to be called later in the constructor and the initialization will be guaranteed after this is done. However, these are very rare occasions and they usually cover very deep functionality in the framework or in a library, unlikely to happen in the everyday work.

## Available Initializers in BindKraft

### InitializeArray

Usages:
```Javascript
MyClass.prototype.mymember = new InitializeArray("description");
MyClass.prototype.mymember = new InitializeArray("description",[ 1,2,3]);
```

### InitializeBindingParameter

### InitializeBooleanParameter

### InitializeCloneObject

Usages:
```Javascript
MyClass.prototype.mymember = new InitializeCloneObject("description");
MyClass.prototype.mymember = new InitializeCloneObject("description",{ 
    x: "text", b: 123
});
```

DeepClone is performed on the passed object when new instance is produced. Keep in mind that only plain Javascript objects can be safely cloned.

### InitializeCustomFormatter

### InitializeDelegatedProperty

### InitializeEvent

Usages:
```Javascript
MyClass.prototype.myevent = new InitializeEvent("description");
```

Creates and EventDispatcher bound to the instance of the class. Later it can be used for firing the event:

```Javascript
MyClass.prototype.somemethod = function() {
    ....
    this.myevent.invoke(this, { ... some data ...});
    ....
}
```

### InitializeMethodCallback

### InitializeMethodDelegate

### InitializeMethodTrigger

### InitializeNumericParameter

### InitializeObject

### InitializeParameter

### InitializeReadOnlyParameter


### InitializeStringParameter
