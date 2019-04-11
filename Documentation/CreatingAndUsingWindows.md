# Creating and using BindKraftJS windows

This documents will guide you through the general patterns and techniques used when you create and manage BindKraftJS windows. These are the components that inherit the `BaseWindow` class directly or indirectly and not the browser's windows and tabs. The BindKraft windows are elements of the platform dedicated to provide containment of other windows (for more complex UI structure) and views. Here a `view` is a semi-strict term denoting the content that does the details of the work.

To illustrate the above let's describe an example construct:

    Imagine a relatively simple app that provides the user with the ability to quickly select a person and edit his/her data. Let us construct that app in the following way (in reality this will probably be quite different, we cut a lot of stuff down for the sake of the example):

    A main window, a split window in it, then a view that hosts search and browse form on the left side of the split window and a single user edit form on the right.

    What this entails is creating the main window, putting a split window in it and then putting a view host window on each of its sides. Together with this or after forming this structure we command the two view host windows to load the search and edit form respectively. Then from this point on whenever the user finds the person s/he seeks in the left form we will load the person's data in the edit form on the right and after editing we will save it if the user clicks some button there. Of course, we can add a lot of goodies, like a start page shown when no person is selected for editing, check if the changes are saved when a new selection is made before completing the form on the right and so on and so forth.

What the above story says is - we construct a structure of containers and we host two content pieces that play the role of two specialized forms in the last two of them (windows) and then we conduct the general flow from the app (from its class), while the details like validating fields, checking for unsaved changes and others we leave for the relevant views or call them forms if this seems more fitting.

This is a typical approach picked up from the desktop applications of any OS known today, but implemented as an app in WEB environment on WEB based workspace desktop abstraction. Our app is separated from other apps running in parallel in windows (BindKraft windows) - in this case the main window. Its internal structure is neatly constructed again with windows and the code and the UI that deals with the details of the work is split into convenient pieces and placed in some of the windows.

We do not consider our workspace/desktop as a WEB page, on the contrary we build a desktop-like workspace using the capabilities the browser gives us in something that is still technically a WEB page, but both we and our users use everything we put there in a way much more closer to the way applications work on a typical desktop of an OS. The same applies to a mobile/tablet design - it is still the same internally, but we arrange the containers (the windows) in a way more appropriate for mobile and tablet devices and we probably also switch the styles and possibly some behaviors of the views (forms) to more mobile friendly mode. 

Thus the windows give us the ability to arrange differently the pieces of our UI and keep the actual work done inside them or to coordinate them as separated from the arrangement as possible, most often requiring no code changes whatsoever when the arrangement is changed (for any kind of reason). Also they keep our apps separate both visually and functionally enabling us to present to the user more than one of them at the same time. The benefits of that last thing are numerous, but are a matter of the articles about the apps in BindKraft, so here it would be enough to say that having many apps working in parallel opens a whole new world of possibilities for integration between different tools and high productivity.

Windows are well-recognized trait of platforms that target productivity first in contrast to platforms that have as their primary target - content consumption. Yet these two directions are not inherently opposite and are often needed at the same time. BindKraftJS relying on the browser's capabilities never forgets that and while it cannot offer the same simplicity as purely consumer WEB designs it still does not require overwhelming effort when consumption of content is the goal or part of it.

## What are the BindKraft windows and how they work internally

... TODO: