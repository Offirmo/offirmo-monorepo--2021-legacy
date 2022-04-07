
<h1 align="center">
	Offirmo’s practical logger - browser implementation<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/public/offirmos_quality_seal.png" alt="Offirmo’s quality seal" width="333">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@offirmo/practical-logger-browser">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@offirmo/practical-logger-browser.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=2-foundation%2Fpractical-logger-browser">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=2-foundation%2Fpractical-logger-browser">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@offirmo/practical-logger-browser">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@offirmo/practical-logger-browser.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2022.svg">
</p>

**This is a browser implementation of [Offirmo’s practical logger](https://practical-logger-js.netlify.app/).**

## Demo

TODO codepen

On Firefox:

![firefox demo](https://www.offirmo.net/offirmo-monorepo/0-doc/practical-logger/screens/firefox_20190402.png)

On Chrome:

![firefox demo](https://www.offirmo.net/offirmo-monorepo/0-doc/practical-logger/screens/chromium_20190402.png)

On Safari:

![firefox demo](https://www.offirmo.net/offirmo-monorepo/0-doc/practical-logger/screens/safari_20190402.png)

On IE11:

TODO


## Usage

### Important note

**This lib may not be what you're looking for!**
It's a component of the much more complete (and awesome!!) **[Offirmo’s Universal Debug API](https://universal-debug-api-js.netlify.app/)** (which includes this lib)
This lib does just one thing and does it well: logging in the console.
However using the full [Offirmo’s Universal Debug API](https://universal-debug-api-js.netlify.app/) will gives you:
- ability to locally override the log level (through localstorage, optional UI available)
- singleton loggers (get API instead of create)
- complementing extra dev features
- lower bundle size, no need to bundle the full version!! can be injected locally it through a browser extension, Chrome+FF available
- UI to control the dev features, in the web extension

[Check it out!](https://universal-debug-api-js.netlify.app/)

Killer feature: no visible logs for your customers, but logs can be enabled at run time if needed!

### basic usage

If you're **really sure** you want to use this lib directly:

```javascript
import { createLogger } from '@offirmo/practical-logger-browser'

const logger = createLogger()
logger.log('hello from logger!')

const fooLogger = createLogger({
	// all params are optional
	name: 'Foo', // default: 'root'. This name is displayed on the log line and can be use for filtering
	suggestedLevel: 'silly' // default: 'error'. Your code is free to suggest a level, but should expect it to be dynamically overriden (see Universal Debug API)
	commonDetails: { channel: 'staging' }, // default: empty. details that'll be merged with all log invocations
	sinkOptions: { sink: ...} // default: empty. options specifically targeted at the sink, usually platform dependent

	// usage not recommended
	forcedLevel: 'silly' // default: undef. use only if you provide your own mechanism for dynamically setting the level
})
fooLogger.log('hello from fooLogger!', { bar: 42, baz: 33 })
```

### sink options

```javascript
const logger = createLogger({
	name: 'Foo',
	sinkOptions: {
		useCss: false, // default: true. set to false to not use console styling, ex. if cause problem in a new browser version?
		betterGroups: false, // default: true. See below
		explicitBrowser: 'chromium', // default: (undef=auto) use this to force browser detection. Should never be needed.
    }
})
fooLogger.log('hello from fooLogger!', { bar: 42, baz: 33 })
```

### Global magic: groups improvements

Groups are great! However the default behavior is a bit crude.
So when the 1st logger is created, it will globally improve
the console.group(...)/groupCollapsed(...)/groupEnd() API,
in order to bring:
- errors can't be hidden in a collapsed group (will auto break out to be sure the error is visible)
- groups won't appear until they have content. Vital to not pollute the console when filtering low-level traces

The drawback: you can't easily reach the call site of a log line anymore.
It's a tradeoff.

You can disable this improvement by passing `sinkOptions: { betterGroups: false }` in the **first** logger creation.
