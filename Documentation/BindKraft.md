# BindKraftJS (for krafty programmers) - architecture

This document is the starting point of the whole BindKraftJS documentation and describes the construction of the BindKraftJS

## Workspace

BindKraft considers a WEB page as a **workspace**. Colloquially this is often called (even in this documentation) - a _desktop_ or a _system_ and this is not by accident. Unlike most WEB oriented programming frameworks/environments, BindKraft is making the jump that the powerful WEB browsers of our time made possible - to not consider a WEB site (location) as a just page anymore, but as a place for work - a work place where the user can perform a number of complex tasks with tools available at this place. 

So, the site/page is a **workspace** filled with tools we call **apps** (or often applications) that the visitor may start and stop many times, feed them with different data, open with them different items, mix the products of these apps in any of the ways they allow and so on. All this is supposed to happen on a single WEB page, living in the visitor's browser.

This point of view is very similar to the way one sees the workspace provided by the OS running on your personal computer, phone, tablet or other individual device of a similar kind. 

>If we consider this in comparison to the classic way we've seen the WEB for many years, it will look like BindKraft sees the user NOT as someone who uses the WEB browser to look at series of pages, but RATHER as someone who browses through various **workspaces** (desktops), each tailored for certain kinds of activities, pre-configured with access to relevant data and services.

The page-centric approach remained intact despite the huge advances in the WEB browser capabilities during the last decades and in one way or another limited the functionality of almost all the WEB development frameworks and tools, no matter how much of the work they moved to the browser. The very concept was the most limiting factor. It kept the separate functionalities living in separated pages with limited ways to cooperate, because of this same separation and no matter how much tasks became possible in the WEB browser (instead of requiring native desktop implementation) they remained a bit out of place in a world still following the basic concept the WEB followed in its first years - page browsing environment.

We simply recognized the fact that even as early as (let say) 2010 the browsers were already way beyond just page viewing contraptions, they were ready even then to offer the programmer a highly portable, zero-maintenance, installation-free desktop replacement for many kinds of work. The further development of the WEB browsers only makes this statement true for more and more tasks usually associated with the desktop workspace.

## Workspace/desktop in every page with a thin system behind it

With BindKraft we call each WEB page - a workspace. BindKraft boots the workspace - a thing usually associated with an OS that has to boot in order to present a workspace to the user.

While BindKraftJS is immeasurably simpler than an OS (operating system) it shares a common concept:

    A system of functionalities has to be prepared during the boot process

    Then this system forms a workspace UI environment where the user can use it.

Therefore, what traditionally is seen as page is a context in which BK initializes that system of functionalities. They are prepared to be provided to all the apps that will work there as various services and API and then the UI part is started to enable the user to control the apps and work with them.

## The architecture

BindKraftJS is built in Javascript entirely. 

