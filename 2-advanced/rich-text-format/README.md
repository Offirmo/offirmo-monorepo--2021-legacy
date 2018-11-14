A generic, platform independent rich text format.

It's half-way between raw text and html. It has only 1 dimension.

Can be rendered in ascii, html, react...

See /demos/*

```js
import * as RichText from '@offirmo/rich-text-format'

const $doc = RichText.block_fragment()
		.pushNode(RichText.heading().pushText('Identity:').done(), {id: 'header'})
		.pushNode(
			RichText.unordered_list()
				.pushKeyValue('name', $doc_name)
				.pushKeyValue('class', $doc_class)
				.done()
		)
		.done()
		
```

Inspiration:
* https://developer.atlassian.com/cloud/stride/apis/document/structure/
* https://bitbucket.org/atlassian/adf-builder-javascript#readme


Tosort
* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

TODO
* error boundaries!!!
