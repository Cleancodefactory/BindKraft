# Settings persistence in BindKraftJS

## Why settings persistence and not persistence in general?

This is probably the first question that everybody will want to ask. The reason is actually obvious - persistence of objects in general will include all kinds of cases - including those where the data will be huge and not settings-like at all. Having this feature of the platform especially designed for the _settings_ case we can make a little more presumptions about its usage and design a nice and easy to use API for it.

## So, what the settings persistence is supposed to do

This is a set of interfaces and classes that enable the programmer to collect and store the settings or the configuration of an App or part of an App (e.g. a window, view etc.). These will be certain options, may be at least partially editable by the end user, positions, sizes, order and other parameters that can reconstruct the working environment the App shows to the user to the state it had when he previously used the App.

The `settings`, obviously, may need to be collected from / used in different parts of the App and so the API for persistence includes built-in persistence capability in some BindKraft classes (e.g. windows). This helps the programmer to collect these easily and concentrate mostly on the settings related to his/her work.

# Persistence API

The API consists of these parts:

1. `ISettingsPersister` interface
2. `SettingsPersister` base class for settings persisters.
3. `ISettingsPersistenceProvider` interface
4. `SettingsPersistenceProvider` base class for providers

# TO BE Continued ...