# CL (command line)

This feature has its history and previous incarnations. This documents the permanent implementation that will be kept functional and developed further starting from May 2022.

## What is what in CL

_The name CL comes from "command line", but terminal-like implementations are not the reason for its existence and are not integral part of BindKraft._

CL is:

 - a system of `contexts` provided by the system and or apps. Other context providers may also be implemented for specific purposes. 

 - language processor(s) capable to run script bound to these contexts

 - supply of commands (functions) provided to the running scripts through the context - API the scripts can use.

Languages are lightweight and designed to do their job by calling the available commands with a little added logic. Each command is executed asynchronously and must complete before the next step is performed. Thus from the point of view of the scripts they are linear and synchronous, but seen from outside they run sequences of asynchronous tasks and when they are expected to complete in order to continue the executor should wait the returned `Operation` for the entire script.

The commands provided to the scripts are compound tasks. For example:

    - opening an app, entering its context setting some variables, putting the app in certain state and performing some operation there. 

    - Configuring a system feature

    - just launching an app and making sure it is put in a desired mode.

    - creation of the initial running state of the system - init features, run daemons, start initial apps etc.

This can be compared to the role of the BAT files or shell scripts in operating systems, but CL is more tightly integrated with the apps they command and can cover conveniently niches like automated testing and tutorial automation for example. They are often used instead of "open app" calls to the Shell API, because through a script launching an app can be infinitely more refined and flexible process, not to mention - very simple. While not initially intended this practice is proliferating in all kinds of scenarios where apps communicate with other apps/daemons - making sure the other apps are up and running and ready to respond. It is much easier with a few script commands than using the more precise, but detailed API underneath.

The BindKraft workspaces depend on at least one boot script to startup and initialize - so CL is important part of the usage of the framework and helps to maintain the OS-like abstraction BindKraft targets for its runtime lifecycle.