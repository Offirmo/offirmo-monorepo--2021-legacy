
BETA, works but has rough edges

# Universal Debug API companion webextension

A **companion webextension** to the Universal Debug API for browser.

This extension will inject a full-fledged version of the Universal Debug API,
which will take precedence over the empty one you should have in your bundle.

In addition, some UI allows an easy control of the debug API.


## Contributing

### concepts
`sjson` = stringified JSON

### local dev
This package is part of a monorepo and uses other modules from this monorepo.
Go to the [top README](../../README.md) and follow installation instructions.

To rebuild only this package:
```bash
## assuming all the monorepo is built:
yarn build
```
Result is in `./dist`

To develop locally:
```bash
yarn dev
```
Will continually rebuild the extension in `./dist` + serve the UI on :9090. Ex. http://localhost:9090/ui/popup/popup.html
This is to develop and serve the react pages directly without the need to reload the extension.


```bash
yarn demo
```
Serves a test page on :1234 which uses the Universal Debug API.

#### Debug
`localStorage.setItem('🧩UWDTi.context.debug', true)`

## Credits and hat tips
* Herbert Spencer "spanner" icon https://thenounproject.com/term/spanner/333486/


## TODO review other extensions:
- [Web Developer Toolbar](https://chrome.google.com/webstore/detail/web-developer-toolbar/deeboegbjcnfgidliakhpoapnpomphji)
- [JavaScript Errors Notifier](https://chrome.google.com/webstore/detail/javascript-errors-notifie/jafmfknfnkoekkdocjiaipcnmkklaajd)
- [Code Injector](https://microsoftedge.microsoft.com/addons/detail/code-injector/kgmlfocfgenookigofalapefagndnlnc)
