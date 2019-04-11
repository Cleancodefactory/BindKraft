# OOP - the inconvenient questions

> The burning question - why BK is not split into importable modules?

**There is more behind this question than one wold expect.**

>First of all, starting with require.js Javascript has gone in a code-first direction, but BindKraft is trying to approach the client side WEB development differently - to combine code-first and view-first techniques - each used for different purposes.

In BindKraft **when you design a view** (form, template for a component etc.) **you think view-first** even when the view can be replaced by another template that works with the same backing code. 

**When you compose an application**, in BindKraft you think **construction-first**. In other words you consider what kind of windows you are going to need, how to nest them in each other, how to hide/show them, when to move them around and finally what to put in them.

Eventually this second task involves a lot of code-first thinking that results in constructing and controlling this system of containers (the windows) and their content (views - forms and components).

If you consider the consequences, you will quickly start to realize that using imports like most Javascript creations today will soon become a nightmare - each strip of code will easily become something that has to deal with imports more than with its purpose. For instance - each template will have to refer to the Javascript-s containing components used there, each application will have to list dozens of imports - especially in those parts that hub them together and this will be only the beginning.

Yes, we have plans how to change BindKraft in this direction, not sacrificing its nature. However, this wont be easy and will not be possible without breaking changes, and finally it will not be like the most Javascript frameworks anyway.