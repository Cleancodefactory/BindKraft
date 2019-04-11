# Templates

Lets remind the reader about the terms we use:

 **Template** is an HTML fragment in textual form or a fragment of a HTML document used the same way. A template can pass from one form to another, but it is template, becuase it is used as a template for a live "view" when it is materialized somewhere.

 **View** is a materialized template, thus the term is context dependent in most other respects - view of a control, a form's view, just view... When said out of context BindKraft view refers to the specific case of a view that is contained in windows and is managed as whole. In all other cases it must have a context - the view of a control, view of a window (the non-client part of a window) and so on. In these cases this is the materialized for of a template working in tandem with a code that implements the mentioned kind of element - a control, a window and so on.

 **Materialization** is the process of cloning the template in the desired place in the DOM, so that it produces (or links cloned) a new attached DOM subtree, then traversing the new DOM to create, parameterize and initialize all the BindKraft classes specified in data-class attributes on elements in this fragment. Colloquially the verb "matearilize" most often includes also the rebind procedure (parse and create all bindings), thus bringing a template into a working portion og the DOM ready to accept data, fire events and do everything else that makes it working part of the BindKraft infrastructure.

 **Rebind** is a procedure performed on a DOM region/subtree that creates/recreates all binding objects by parsing all the data-bind/data-on attributes. The operation is automatic without actual need to expose customization points and this is why it is often assumed to be part of the process of materialization of a template.

 ## What kind of template usage exists in BindKraft.

 First of all, the templates should be single-rooted unless otherwise noted. This means that all the content in a template must be enclosed in a single top-level (in the template) HTML element. Exceptions are supported, but not everywhere and this always imposes additional considerations and the support cannot be absolute. So assuming that the materialization of a template is producing a DOM subtree is fairly correct and the exceptions often use special mechanisms to hide the multiroot nature of a template when usage of one is possible and supported. This is probably expected by everyone with any experience with HTML DOM, because this impact is felt in virtually any framework, suer code and architecture designed to work in HTML pages.

 The usage of templates in BindKraft is everywhere and it all boils down to usage of the primitive materialization routines cloneTemplate, materializeIn and materialize - all doing the same in slightly different way to best match the needs of the typical kinds of scenarios. However, these methods are of concern only to programmers using low level BindKraft API, in real life there are a number of classes, implementers and other programming constructs that take care for a number of details, including the loading and materialization of the templates. The most important reason to use these is the fact that the templates are used for a reason and their purpose mandates the need to integrate them with code and other templates.


 ...


 