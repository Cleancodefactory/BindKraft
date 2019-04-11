# Boot process

This document describes the current boot process - ordering, recognized elements and start/boot scripts

## Scripts

## Procedure

- Run bootfs:/boot

    Initializes the system ...

- Run all the `URL scripts` 


## Elements

### URL scripts

Current implementation expects them as query parameters

```
http://server.com/path1/path2?param=content&$run_appcls=<command_line>
```