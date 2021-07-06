
export default function WithAutoDarkMode({ children, light_theme_id = 'light--default', dark_theme_id = 'dark--default' }) {
	//console.log('WithAutoDarkMode')

	const body_elt = document.getElementsByTagName('body')[0]

	function refresh() {
		body_elt.classList.remove('sb-show-main', 'sb-main-padded') // it seems they come back on refresh

		const storybook_theme = body_elt.classList.contains('dark') ? 'dark' : 'light'
		const offirmo_theme_id = {
			'light': light_theme_id,
			'dark': dark_theme_id,
		}[storybook_theme] ?? light_theme_id

		if (body_elt.dataset['oTheme'] !== offirmo_theme_id) {
			console.log('WithAutoDarkMode: switching theme…', {
				light_theme_id,
				dark_theme_id,
				storybook_theme,
				offirmo_theme_id__previous: body_elt.dataset['oTheme'],
				offirmo_theme_id__next: offirmo_theme_id,
			})
			body_elt.dataset['oTheme'] = offirmo_theme_id
		}
	}
	setInterval(refresh, 500)
	refresh()

	return children
}
