# System.Default().settings

A number of system settings reside under `System.Default().settings`. It is recommended to access them through the getter and setter respectively:

```Javascript
// Read a setting
var setting = System.Default().get_settings("path.to.setting", "fallback_value");
// Write a setting
System.Default().set_settings("path.to.setting","value to set");
```

Most setting SHOULD not be directly set by the applications.There are commands for the settings that can be changed in useful manner and the rest are determined by the system, usually following a convention that can be broken otherwise.

## List of the currently supported settings

The object described below starts from the root (i.e. `System.Default().settings`)

```Javascript
{
    /** Current system language, e.g. en, en-US etc.
     */
    CurrentLang: "<string>",
    /** The default Date encoding used in JSON requests and responses.
     * Date/time converters would use this, but it may also be needed by applications sometimes.
     * Currently supported values are: ISO,MS,TICKS
     */
    DefaultTransferDateEncoding: "<string>",
    /**
     * Ultimate fallback for non-existent locales (translations etc.). By default this is "en"
     */
    UltimateFallBackLocale: "<string>"
    
}
```