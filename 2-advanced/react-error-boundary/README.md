Based on [render-props](https://github.com/donavon/render-props) to allow any type of usage:



```jsx
import ErrorBoundary from '@offirmo-private/react-error-boundary'

<ErrorBoundary name={'omr:logo'}>
	{this.props.logo}
</ErrorBoundary>

<ErrorBoundary name={'foo'}
	render={() => trickyStuff() } />
}
```


WARNING !!!!
[React error boundaries](https://fb.me/react-error-boundaries) are NOT really behaving like a try/catch.
You MAY have to use an intermediate component to really catch errors. Ex.

```jsx
import ErrorBoundary from '@offirmo-private/react-error-boundary'

// Will NOT work!!!
<ErrorBoundary name={'foo'}>
	{dangerousFunctionThatThrow(x)}
</ErrorBoundary>

// Will work:
<ErrorBoundary name={'foo'}>
	{dangerousFunctionThatThrow.bind(null, x)}
</ErrorBoundary>

or
<ErrorBoundary name={'foo'}'
	render={dangerousFunctionThatThrow.bind(null, x)} />

or:
const View = ({x}) => (
		<Fragment>
			{RichText.to_text(doc)} />
		</Fragment>
)
<ErrorBoundary name={'foo'}>
	<View x={x} />
</ErrorBoundary>
```


Note .babelrc is needed by some consumers of this package (ex. webpack)
