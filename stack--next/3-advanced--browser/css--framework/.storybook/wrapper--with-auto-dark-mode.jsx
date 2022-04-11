import { useState, useEffect } from 'react'

let _id = 0
export default function WithAutoDarkMode({ children, light_theme_ids = [], dark_theme_ids = [] }) {

	// clean params
	light_theme_ids = light_theme_ids.filter(e => !!e)
	if (light_theme_ids.length === 0) light_theme_ids.push('light--default')
	dark_theme_ids = dark_theme_ids.filter(e => !!e)
	if (dark_theme_ids.length === 0) dark_theme_ids.push('dark--default', 'dark--colorhunt212')

	const body_elt = document.getElementsByTagName('body')[0]
	function get_current_storybook_mode() {
		return body_elt.classList.contains('dark') ? 'dark' : 'light'
	}

	// state
	const [ id ] = useState(_id)
	_id++
	const [ last_seen_storybook_mode, set_last_seen_storybook_mode ] = useState(get_current_storybook_mode())
	const recovered_theme = body_elt.dataset['oTheme']
	const recovered_light_index = light_theme_ids.indexOf(recovered_theme)
	const [ light_theme_index, set_light_theme_index ] = useState(recovered_light_index === -1 ? 0 : recovered_light_index)
	const recovered_dark_index = dark_theme_ids.indexOf(recovered_theme)
	const [ dark_theme_index, set_dark_theme_index ] = useState(recovered_dark_index === -1 ? 0 : recovered_dark_index)

	console.log('WithAutoDarkMode render', {
		id,
		params: {
			light_theme_ids,
			dark_theme_ids,
		},
		state: {
			last_seen_storybook_mode,
			light_theme_index,
			dark_theme_index,
		},
		env: {
			recovered_theme,
			storybook_mode: get_current_storybook_mode(),
		},
	})

	// selectors
	function get_expected_current_theme_id(mode) {
		if (mode === 'dark')
			return dark_theme_ids[dark_theme_index % dark_theme_ids.length]

		return light_theme_ids[light_theme_index % light_theme_ids.length]
	}

	useEffect(() => {
		body_elt.dataset['oTheme'] = get_expected_current_theme_id(last_seen_storybook_mode)
	})

	useEffect(() => {
		function refresh() {
			body_elt.classList.remove('sb-show-main', 'sb-main-padded') // it seems they come back on refresh
			const storybook_mode = get_current_storybook_mode()

			/*console.log('refresh', {
				id,
				current_mode: storybook_mode,
				last_seen_mode: last_seen_storybook_mode,
			})*/

			if (storybook_mode === last_seen_storybook_mode)
				return // no change

			console.log('WithAutoDarkMode: switching theme…', {
				id,
				light_theme_ids,
				dark_theme_ids,
				storybook_mode,
				offirmo_theme_id__from_dom: body_elt.dataset['oTheme'],
				offirmo_theme_id__next: get_expected_current_theme_id(storybook_mode),
			})

			set_last_seen_storybook_mode(storybook_mode)

			// cycle through the previous mode themes
			if (last_seen_storybook_mode === 'light') {
				set_light_theme_index(light_theme_index + 1)
			}
			else
				set_dark_theme_index(dark_theme_index + 1)
		}
		refresh()

		const iid = setInterval(refresh, 500)

		return () => {
			clearInterval(iid)
		}
	})

	return children
}
