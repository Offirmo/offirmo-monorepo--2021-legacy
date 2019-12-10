example

```js
poll(() => this.props.user.user_metadata, { timeoutMs: 30 * 1000 })
	.then(() => {
		console.log('got metadata...')
		this.setState({ loaded: true })
```
