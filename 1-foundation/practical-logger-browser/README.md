

```js
import { createLogger } from '@offirmo/practical-logger-browser'

const logger = createLogger({
	name: 'FOO',
	level: 'silly',
})

logger.log('hello')

;[
	'fatal',
	'emerg',
	'alert',
	'crit',
	'error',
	'warning',
	'warn',
	'notice',
	'info',
	'verbose',
	'log',
	'debug',
	'trace',
	'silly',
].forEach(level => logger[level]({level}))

```
Techniques
- https://stackoverflow.com/questions/7505623/colors-in-javascript-console
- https://hackernoon.com/styling-logs-in-browser-console-2ec0807dc91a
- ...

Inspiration:
- https://github.com/ianstormtaylor/browser-logger

