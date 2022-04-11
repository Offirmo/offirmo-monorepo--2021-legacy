import { useEffect } from 'react'


export default function WithBodyFullWidth({ children }) {
	console.log('WithBodyFullWidth')

	const body_elt = document.getElementsByTagName('body')[0]

	useEffect(() => {
		body_elt.classList.add('o⋄body⁚full-viewport', 'o⋄paddingꘌnone')

		// Remove class on cleanup
		return () => body_elt.classList.remove('o⋄body⁚full-viewport', 'o⋄paddingꘌnone')
	}, []) // Empty array ensures that effect is only run on mount

	return children
}
