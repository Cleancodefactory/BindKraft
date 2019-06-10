# Windowing - BindKraft windows

If you look for the API Reference go [here](WindowingClasses.md)

As a platform that aims at using the WEB pages as desktop/mobile workspaces, running multiple applications simultaneously, BindKraft needs to manage the available screen estate in some way. This is where the windows come to the rescue.

Each BindKraftJS app has an hierarchy of windows, starting with one or more root windows (owned by the system's workspace window) that contain the rest of the hierarchy of nested windows. Additionally some pop-up windows are also shown by the apps or through the system to present a short lived UI to the user when needed.

