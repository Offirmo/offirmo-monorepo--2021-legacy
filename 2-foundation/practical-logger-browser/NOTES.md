

```js
import { createLogger } from '@offirmo/practical-logger-browser'

const logger = createLogger({
	name: 'FOO',
	suggestedLevel: 'silly', // optional
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
- https://medium.com/@mattburgess/beyond-console-log-2400fdf4a9d8
- https://konklone.com/post/how-to-hack-the-developer-console-to-be-needlessly-interactive
- ...

Inspiration:
- https://github.com/ianstormtaylor/browser-logger


```css

:host-context(.platform-mac) .monospace,
:host-context(.platform-mac) .source-code,
.platform-mac .monospace,
.platform-mac .source-code {
    font-size: 11px !important;
    font-family: Menlo, monospace;
}

:host-context(.platform-windows) .monospace,
:host-context(.platform-windows) .source-code,
.platform-windows .monospace,
.platform-windows .source-code {
    font-size: 12px !important;
    font-family: Consolas, Lucida Console, Courier New, monospace;
}

:host-context(.platform-linux) .monospace,
:host-context(.platform-linux) .source-code,
.platform-linux .monospace,
.platform-linux .source-code {
    font-size: 11px !important;
    font-family: dejavu sans mono, monospace;
}

.source-code {
    font-family: monospace;
    font-size: 11px !important;
    white-space: pre-wrap;
}

```
,https://medium.com/@mattburgess/beyond-console-log-2400fdf4a9d8
