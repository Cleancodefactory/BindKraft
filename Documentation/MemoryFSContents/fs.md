# Memory files systems - defined locations and purposes

This document is a starting point of the directory of all the currently defined in-memory FS locations, formats and their purposes.

The document and the related ones will be updated as new locations are defined and new options available. Check back here from time to time to see what is new.

## File systems

### bootfs

`bootfs:/boot`

> A script file (CLScript) which is the first script executed at system boot. It is most often called the `master boot` script.

`bootfs:/modulename/*scripts`

> Here `modulename` is a directory named the same as a BK module. In the modules the developers can define any number of script files and even subdirectories under this one. These scripts should perform boot time tasks, configuration or initialization. Modules containing flexible apps and libraries can provide this way pre-defined optional sets of actions/initializations that can be called from the master boot script in order to configure the apps and libraries supplied by the module in certain ways in the constructed workspace.

> The rationale is that configuration and initialization of flexible and powerful apps and libraries can get complex and obscure. The developers who want to use them may need considerable time to learn what needs configuring and how to do so. This way the original programmers of a module can supply a number of pre-configured profiles and enable the consumers of their work to choose one, call it at boot time and be done with the initialization without the need to dig into the documentation for details.

### shellfs



### infofs

### appfs