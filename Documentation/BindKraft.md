# BindKraftJS (for krafty programmers)

This document is a good starting point of the whole BindKraftJS documentation and describes the concept of the BindKraftJS

## Workspace

BindKraft considers a WEB page as a **workspace**. Colloquially this is often called (even in this documentation) - a _desktop_ or a _system_ and this is not by accident. Unlike most WEB oriented programming frameworks/environments, BindKraft is making the jump that the powerful WEB browsers of our time made possible - to not consider a WEB site (location) as a just page or SPA (single page application) anymore, but as a place for work - a workspace where the user can perform a number of complex tasks with tools available at hand. 

So, the site/page is a **workspace** filled with tools we call **apps** (or often applications) that the visitor may start and stop many times, feed them with different data, open with them different items, mix the products of these apps in any of the ways they allow and so on. All this is supposed to happen on a single WEB page, living in the visitor's browser.

This point of view is very similar to the way one sees the graphical workspace provided by the OS running on your personal computer, phone, tablet or other individual device of a similar kind. 

>If we consider this in comparison to the classic way we've seen the WEB for many years, it will look like BindKraft sees the user NOT as someone who uses the WEB browser to look at series of pages, but RATHER as someone who browses through various **workspaces** (desktops), each tailored for certain kinds of activities, pre-configured with access to relevant data and services.

The page-centric approach remained intact despite the huge advances in the WEB browser capabilities during the last decades and in one way or another limited the functionality of almost all the WEB development frameworks, no matter how much of the work they moved from the server to the browser. The very concept was the most limiting factor. It kept the separate functionalities living in separated pages with limited ways to cooperate or has gone to the other extreme - treated pieces of functionality that should be separate apps as components of a single bloated application. 

We simply recognized the fact that even as early as (let say) 2010 the browsers were already way beyond just page viewing contraptions, they were ready even then to offer the programmer a highly portable, zero-maintenance, installation-free desktop replacement for many kinds of work. The further development of the WEB browsers only makes this statement true for more and more tasks usually associated with the desktop workspace.

## Workspace/desktop in every page with a thin system behind it

With BindKraft we call each WEB page - a workspace. BindKraft boots the workspace - a thing usually associated with an OS that has to boot in order to present a workspace to the user.

While BindKraftJS is immeasurably simpler than an OS (operating system) it shares a common concept:

    A system of local services has to be prepared during the boot process, some apps started as daemons or as front UI.

    Then this system forms a workspace UI environment where the user can do some work.

What traditionally is seen as page is a context in which BK initializes that system of services. They are prepared to be provided to all the apps that will work there as various services and API and then the UI part is started to enable the user to control the apps and work with them. In a fashion similar to an operating system the UI can be a controlled by a shell app that lets the user to start apps and switch between them or the UI can follow the opposite approach - still use many apps, but present them in an integrated way that resembles a WEB site. Depending on the design approach these facts can be obvious to the end users - e.g. UI betting on draggable windows and task bar will be expected to act as a desktop environment, but UI with all the windows maximized with a few dialog boxes will exploit the user expectations based on experience with more typical WEB pages. Still, the functionality behind all this is the same and the design philosophy is a matter of choice made by the developers.

## The architecture

BindKraftJS is built in Javascript entirely. It is using two techniques internally - both opposite to one another. The UI parts are normally built with HTML templates bound to code controlling them in a template-first fashion, the non-UI parts use the opposite - code-first approach, where classes are written to form apps. 

