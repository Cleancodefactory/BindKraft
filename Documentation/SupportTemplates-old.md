# Support templates in Base derived classes (except windows)

This article describes how to support template usage in classes designed for use in view with the data-class declarations.

The topic describes several helper constructs - implementers, template fetchers, specialized connector and goes further to describe the interfaces that allow their instances to exchange templates and pieces of templates.

The usage of templates is the heart of the UI part of BindKraft and this makes the topic quite large. Templates are used for various purposes, with varying degree of dynamism and every class needs different level of complexity and support for the template mechanisms in BindKraft. To help beginners understand the diversity of needs the classes have, let us try to illustrate some interesting concepts:

Imagine two diametrically different cases:
- A class that needs a template it is going to use always and load it as part of its instantiation. There will be no template changing at runtime, very little chance that a replacement template will be needed, the template is like an integral part of the component and not something intended to be redesigned by those who use it every time. If you need a more real-life examples, think for instance about some person selector control or location selector or something of a similar kind. If you want it to offer a lot of functionality, like detailed filtering, ordering, may be even in-place editing the template you need will be dedicated to create this experience - users will "feel" that as some kind of vastly reused subform that appears in any place where this kind of item needs to be selected - effectively playng the role of a standard field for that purpose. Changing such a template at runtime is obviously unneeded, in most cases it will be designed through themes/styles and may be from time to time a replacement template will make sense if some client wants something to be reordered in the UI and in the border cases this may include some small functionality additions that don't change the control's overal behaviour, but add small improvements in the behaviur of the control's UI, may be even just effects.

- Now thinkg of a completely different case, where the template(s) are needed to match different kinds of data and have to change at runtime to fit the data coming to the element at any given moment, these templates also have to change dynamically because of the state of something outside of the control's reach and so on. It is obvious that loading a template during instantiation will not be enough in many cases. An assistent components may be needed to compose the templates according to various conditions and pass them to the control leaving for it only the part of the problem - selection of the right template for the type of data being displayed. There are many ways to do something like that, but the important thing here is - it is a dynamic and very data dependent process.

## Available helpers for implementing template support in view level classes



