# BindKraft guide

This set of articles is work in progress and will be linked when it progresses enough.

## Introduction

### [About the setup: **BindKraft** + **CoreKraft**](Intro-About.md)

A few words about the setup we will be using in this guide. Alternatives exist, but they are not discussed in this guide.

### [Creating a `workspace` in a git repository.](Intro-CreateWorkspace.md)

Describes the structure and steps needed to create a `workspace`. Describes the actions one will need to take when new stuff has to be added or removed to/from the workspace.

### [Modules of CoreKraft based workspace and their configurations.](Intro-ModulesAndConfigurations.md)

Describes the `configuration files` and their locations, the structure of a `module`. We will be mentioning these configurations whenever needed later in the guide.

## Creating a new Module and implementing a basic App in it

### [Create repository for the module and link it as git submodule](Basic-ModuleRepo.md)

Preparing a place for your work, create the necessary files. The most important parts of the module.

### [Start creating a basic app and create something to show in it.](Basic-CreateTheApp.md)

Start with minimal structure for an App without anything fancy. Create a very simple view and display it in a single simple window. We will dig much deeper in both directions - the development of views and the App development.

### [Add some UI structure to the App](Basic-MoreStructureApp.md)

To make our App a bit more realistic, we add more window based structure and see some things that can be done with windows. We keep the views simplistic for the moment - nex part of the guide will deal with them almost exclusively.

## Views and components

### [Use various base components in a view](Views-BaseComponents.md)

Get more involved with a view: Use repeaters, template switchers, fields, drive the data back and forth through bindings, intercept some events and use flags with data bindings.

### [Handling events with vengeance](Views-HandlingEvents.md)

Handling DOM and custom events, adding referenced data, bindings and links to places in data context. Using references with simple ad hoc custom formatters/convertors.

### [Advanced data binding](Views-AdvDataBind.md)

Formatting, converting, filtering and otherwise modifying the data while it passes through the binding. Field validation with validators using validation rules. Moving the inline validation configuration outside of the view - into the code.

### [Data binding target operations](Views-Targetops.md)

A pass through the available `target operations` - what the bindings can do directly to the DOM. Program visibility, styling and other aspects of DOM elements with bindings.

### [Creating components](Views-Components.md)

Creating components to place in views. What is a component and what makes it a control. Using custom templates in your components. Using templates provided in the HTML or through properties (with ot without bindings).

### [Components and services](Views-Services.md)

Crossing the boundaries of the view from components safely. Using services to get hold on other parts of the app no matter where exactly are they. Services as way to define ambient context for your components.

### [Binding options and data techniques](Views-BindOptions.md)

A few simple options combined with other features provide easy ways to manage your working data with very little effort. Some communication with the server is introduced to make the material more realistic.

## Working with data the BindKraft way - a short digression

### [CoreKraft NodeSets as an implementation of the principle](Data1-NodeSets.md)

What kind of data services are best for BindKraft and how CoreKraft implements them. Using states to push back changed and new data to the server. Organizing the data manipulation in a view and a little overdoing it just to show that this can go really far.

### [Preserving references](Data1-PreserveReferences.md)

References preservation - the basic principle to which everything in BindKraft adheres. How this saves work and lets you apply any techniques you like, but doesn't require you to follow a specific pattern.