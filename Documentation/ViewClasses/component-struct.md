# Component build guide


```javascript
function MyComponent() {
    Base.apply(this, arguments);
}
MyComponent.Inherit(Base,"MComponent")
.Implement(ICustomParameterization)
    .Implement(ICustomParameterizationStdImpl /*,paramname1,paramname2...*/)
.Implement(IUIControl)
.Implement(ITemplateSource)

```