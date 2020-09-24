/* Insert the specified CSS with the hinted "id".
 * Returns either the newly created element, or the one that already exists.
 */
function style_once({id, css, href, document = window.document}) {
	let element = document.getElementById(id)

	if (!element) {

		if (css) {
			if (href)
				throw new Error('style_once(): conflicting css & href!')

			element = document.createElement('style')
			element.setAttribute('id', id)
			element.innerHTML = css
		}
		else if (href) {
			element = document.createElement('link')
			element.setAttribute('id', id)
			element.rel = 'stylesheet'
			element.href = href
		}
		else {
			throw new Error('style_once(): you must provide css or href!')
		}

		document.head.appendChild(element)
	}

	return element
}

export default style_once
