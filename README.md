# BindKraft Javascript platform

This repository contains the source code and the documentation of the BindKraft Javascript platform (`BindKraftJS`) for use in WEB browser environment. Other variants, supporting different environments may borrow code originating in this repository, but are otherwise separate.

## Documentation and other information

The documentation is maintained in the Documentation directory.

[Open the documentation](Documentation/start.md)

>_Links to interesting starting points will be added here in the following months_

### Links

[Changelog](Documentation/CHANGELOG.md) - Changes log, started in April 2019 (see more details in the document)

[BindKraft.io](http://bindkraft.io) - Demo site

[Roadmap](Documentation/ROADMAP.md) - Future plans

## BindKraftJS at a glance

BindKraft as a whole is a philosophy and a combination of several pieces in its full form - server software, client side WEB browser platform (this one - BindKraftJS), protocols and other elements. This repository, however, is the Javascript part - the one designed for WEB browsers. It can be used separately, but together with the rest of BindKraft pieces it has additional advantages thanks to the shared concept and the "by design" integration.

### It is a different platform and not a framework


**BindKraftJS is the path most other Javascript creations did not take**. In the beginning it happened by accident, but the benefits it brought were many - much more than even the initial creators expected. This resulted in intentional further development of the platform, first for internal use and then publicly as open source.

**What is so different?**

Even before 2010 the majority of the Javascript libraries/frameworks converged in a sense. They all tended to follow and often imitate programming techniques and features born in languages and environments very different from the original Javascript and its natural habitats. At the time Javascript already had a long history, but there was very little in common between the ways programmers used it. The trends that brought the critical mass, that is responsible for its popularity today, were actually the once already mentioned - emulation of techniques considered foreign for Javascript before.

As a result a lot of the inherent power of the Javascript concepts was left unharnessed by most of the new adopters. We did it differently - we combined imitation of other programming environments and natural classic Javascript techniques. The resulting environment is very much object oriented, both similar to more traditional OOP languages and also implemented in a very Javascripty fashion. 

> BindKraftJS uses prototype to define OOP constructs

> BindKraftJS does not run away from the non-strict typing - it embraces the thing.

> BindKraftJS marries the `class` and `interface` concepts with the `non-typed` nature of the classic Javascript

> BindKraftJS expects the UI code to blend in the DOM and act as an extended layer and not stay aside forcibly acting in one predetermined role only (take MVC for example)

> BindKraftJS recognizes the fact that the HTML DOM is a base, but not an ultimate solution by itself and defines higher level UI constructs for all cases when "blending with DOM" is not enough.

**And what is the result of all that?**

BindKraftJS sees the WEB page as a `workspace` - a desktop-like environment where multiple applications (apps) can be opened and closed, work at the same time, occupy part of the screen or the whole page in different moments in time. Each app (that has UI) maintains sets of `logical windows`, some dealing with general layout (controlling the placement of their sub-windows), others containing the actual UI content (forms or call them views if you prefer). The applications can run in multiple instances in the same desktop (WEB page) if this makes sense (depending on what they do), they are fairly isolated from each other, but can interact - provide services, create content for further use in other apps and generally present the end user with a range of tools (applications) for a complex and diversified work - all on the same page/desktop. `Basically BindKraftJS adapts the desktop paradigm to the WEB page`.

This goes better with a server or servers that are designed for such use (like CoreKraft for instance), but it also works with very simple server-side applications or/and WEB services provided by various servers. The communication layers in BindKraftJS use abstractions that enable easy migration to specialized servers (or building one yourself gradually), but also allow packing of complex communication scenarios on the client if there is no server to do it (or the case does not allow for server-side solution).

> BindKraftJS assumes a `response to a request may contain multiple pieces` of data with different purposes. With specialized server this will greatly reduce the number of requests and the effort to collect the needed data and resources together.

> BindKraftJS defines `2+ levels of communication abstraction` to enable transparency of the data retrieval. This makes possible flexible components that need complex control over the process, but still need to be independent of the actual mechanisms involved.

On a granular level - when a form/view/component is developed BindKraftJS defines concepts like `data contexts`, `view borders`, `special locations` and employs mark-up syntax (mostly in attributes) to let the programmer wire `data`, `view` (HTML DOM) and `code components` together quickly reducing the development effort mostly to programming reactions, properties (sources of data), filters/formatters etc.

The advanced data-binding is actually non-automatic, but provides the programmer with a rich set of techniques to control how and when it happens both en masse and at a very granular level - as needed. The optimizations that can be achieved are simply impossible with any automatic data-binding and also this eliminates any unwanted loops in a very natural fashion.

BindKraftJS is not only for business projects! Obviously this is the strongest area for it, but having a desktop with applications in windows does not cut you from the option to present this more or less like a WEB page - it is a matter of design, behavior of the windows and a few features an app needs to support. It might be a bit more work for a small WEB site, but it actually saves huge amounts of effort for big ones.

_Want to see how it goes? Check the gallery, the example environments, some of the projects we built (some are demos, others are production instances)._


