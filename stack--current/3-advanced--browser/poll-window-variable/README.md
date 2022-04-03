example

```js
import poll_window_variable from '@offirmo-private/poll-window-variable'

poll_window_variable('netlifyIdentity', { timeoutMs: 2 * 60 * 1000 })
	.then(NetlifyIdentity => {
		console.info('Netlify Identity loaded ✅')
```
