# WorkFlowyFX

_Makes [WorkFlowy](https://workflowy.com/) even smarter._

A plugin for Chrome and Firefox, built with [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions).
It adds a couple of small usability features to the already awesome _WorkFlowy_.

## Features

* prints `Hello, WorkFlowy` to the console
* shows (or hides) all notes with `Accelerator + N`
* makes the list of shortcuts a little wider to avoid line breaks

## Build

WorkFlowyFX is built with NPM, so `npm install` in its root should install all dependencies.
To build the plugins use `npm run build` and look into the new folder `plugins`.
For a more detailed build, look into `build.js`, particularly the `build` function.

In Chrome the extension can be loaded [like so](https://developer.chrome.com/extensions/getstarted#unpacked).
I did not yet test it in Firefox.