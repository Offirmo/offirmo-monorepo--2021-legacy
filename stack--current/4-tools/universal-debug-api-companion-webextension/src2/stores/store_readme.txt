A minimum of knowledge of web programming is required to be able to properly use this extension.
Documentation: https://universal-debug-api-js.netlify.app/
Source: https://github.com/Offirmo/offirmo-monorepo/tree/master/4-tools/universal-debug-api-companion-webextension/src

This is for web developers writing complex/semi-complex JavaScript.

No clue about what your code is doing?
Wish you could just turn logs on prod?

You can with Offirmo’s Universal Debug API (for node & browser + isomorphic)
- loggers with controllable log level
- local overrides of variables
- debug commands (in alpha)
- exposition of internal data (in alpha)

This extension is a companion to the debug API, allowing to control it through a UI.

You'll have to modify your source code
to include and use "Offirmo’s Universal Debug API" (https://universal-debug-api-js.netlify.app/)
but this comes at nearly no cost
since you only have to bundle/use a very small "placeholder" version, doing nothing at all.

However, when this extension is used and active,
the placeholder version will be dynamically replaced by an active version,
served by the extension.
The replacement is done synchronously before any other code can execute,
so it just works without any complex setup.
