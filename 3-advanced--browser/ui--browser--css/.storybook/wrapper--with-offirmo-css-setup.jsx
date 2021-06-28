import WithAutoDarkMode from './wrapper--with-auto-dark-mode'

export default function WithOffirmoCssSetup({ children }) {
	//console.log('WithOffirmoCssSetup')

	const html_elt = document.getElementsByTagName('html')[0]
	const body_elt = document.getElementsByTagName('body')[0]

	html_elt.classList.add('o⋄top-container')

	body_elt.classList.add(/*'o⋄body⁚full-viewport',*/ 'o⋄top-container', 'o⋄fontꘌfast-and-good-enough')
	body_elt.classList.remove('sb-show-main', 'sb-main-padded')

	const root_elt = document.getElementById('root')
	if (root_elt) root_elt.classList.add('o⋄top-container')

	return <WithAutoDarkMode>{children}</WithAutoDarkMode>
}
