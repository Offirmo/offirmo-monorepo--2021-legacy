A simple polling utility, sometimes there is no other way...

default options:
* periodMs: 100, // check every 100ms
* timeoutMs: 10 * 1000, // after 10 seconds, timeout
* debugId: 'an unnamed predicate',

Usage:
```js
poll(() => this.props.user.user_metadata, { timeoutMs: 30 * 1000 })
	.then(() => {
		console.log('got metadata...')
		this.setState({ loaded: true })
```
