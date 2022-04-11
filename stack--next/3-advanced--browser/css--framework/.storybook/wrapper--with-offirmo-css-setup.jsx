import WithAutoDarkMode from './wrapper--with-auto-dark-mode'

import '../src/style.css';
import '../src/style--theme--dark--colorhunt212.css';
import '../src/extras/beautiful-website.css';
import '../src/extras/diagnostics.css';
import '../src/extras/work-in-progress.css';
//import '../src/extras/debug-snippet.css';

export default function WithOffirmoCssSetup({
	children,
	extra_body_classes = [ 'o⋄fontꘌfast-and-good-enough' ],
	light_theme_id,
	dark_theme_id,
}) {
	//console.log('WithOffirmoCssSetup')

	const html_elt = document.getElementsByTagName('html')[0]
	const body_elt = document.getElementsByTagName('body')[0]

	html_elt.classList.add('o⋄top-container')

	body_elt.classList.add(/*'o⋄body⁚full-viewport',*/ 'o⋄top-container', ...extra_body_classes)
	body_elt.classList.remove('sb-show-main', 'sb-main-padded')

	const root_elt = document.getElementById('root')
	if (root_elt) root_elt.classList.add('o⋄top-container')

	return <WithAutoDarkMode light_theme_ids={[light_theme_id]} dark_theme_ids={[dark_theme_id]}>{children}</WithAutoDarkMode>
}
