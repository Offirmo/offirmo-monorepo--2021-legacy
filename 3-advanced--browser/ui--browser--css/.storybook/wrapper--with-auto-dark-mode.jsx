
export default function WithAutoDarkMode({ children }) {
	//console.log('WithAutoDarkMode')

	const body_elt = document.getElementsByTagName('body')[0]

	function refresh() {
		body_elt.classList.remove('sb-show-main', 'sb-main-padded') // it seems they come back on refresh

		const storybook_theme = body_elt.classList.contains('dark') ? 'dark' : 'light'
		/*console.log({
			storybook_theme,
		})*/

		const offirmo_theme = {
			'light': 'light--default',
			'dark': 'dark--default',
		}[storybook_theme] ?? 'light--default'
		body_elt.dataset['oTheme'] = offirmo_theme
	}
	setInterval(refresh, 500)
	refresh()

	return children
}
