
## title
Offirmo’s Universal Web Dev Tool

## Summary
Get convenient dev and debug features for your JavaScript code

## Detailed Description
THIS IS A DEVELOPER TOOL, for web apps developers.

A minimum of knowledge of web programming is required to be able to properly use this extension.

Technical details and usage guide: https://universal-debug-api-js.netlify.com/

Source (open): https://github.com/Offirmo/offirmo-monorepo/tree/master/4-tools/universal-debug-api-companion-webextension/src

This is for web developers writing complex/semi-complex JavaScript.

No clue about what your app is doing?
Wish you could just turn logs on prod?

You can with Offirmo’s Universal Debug API (for node & browser + isomorphic)
- loggers with controllable log level
- local overrides of variables
- debug commands (in alpha)
- exposition of internal data (in alpha)

This extension is a companion to the debug API, allowing to control it through a UI.

You'll have to modify your source code to include and use "Offirmo’s Universal Debug API" (https://universal-debug-api-js.netlify.com/) but this comes at nearly no cost since you only have to bundle/use a very small "placeholder" version, doing nothing at all.

However, when this extension is used and active,
the placeholder version will be dynamically replaced by an active version,
served by the extension.
The replacement is done synchronously before any other code can execute,
so it just works without any complex setup.


## Screenshots
> 1280x800 or 640x400
> JPEG or 24-bit PNG (no alpha)
> At least one is required. Up to a maximum of 5.

> Small Promo Tile
> 440x280 Canvas
> JPEG or 24-bit PNG (no alpha)

> Large Promo Tile
> 920x680 Canvas
> JPEG or 24-bit PNG (no alpha)

> Marquee Promo Tile
> 1400x560 Canvas
> JPEG or 24-bit PNG (no alpha)

## Official Url
https://www.offirmo.net

## Homepage Url
https://universal-debug-api-js.netlify.com/

## Support Url
https://github.com/Offirmo/offirmo-monorepo/issues

## Google Analytics ID

## Single purpose

This extension helps develop web apps and web sites by injecting (only if requested) debugging code and later controlling this debugging code (as explained on the dedicated site https://universal-debug-api-js.netlify.com/)
The code is fully open source and can be inspected at will.
This extension is not sending any data remotely.

## Permission justification

This extension will, on request, inject debugging code in the current tab and display a control panel for the debug features of the current tab.

This extension needs to recognize a tab's origin to save and restore settings for this origin.

This extension is a generic tool, not made for a particular site.

