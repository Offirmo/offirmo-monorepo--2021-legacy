import '../src/index.css'

import { ELEMENTS } from '../src'

console.log(ELEMENTS)

function get_bg_id(css_class: string): string {
	return css_class.split('⁚')[1]
}

const current_url = new URL(window.location.href)
const current_search_params = current_url.searchParams
current_search_params.sort()


interface State {
	previous_bg_id: string | null
	bg_id: string
}

const state: State = {
	previous_bg_id: null,
	bg_id: current_search_params.get('id') || get_bg_id(ELEMENTS[0].css_class),
}

////////////////////////////////////

function set_bg_id(id: string) {
	state.bg_id = id
}

////////////////////////////////////

function render() {
	const css_class = `tbrpg⋄bg-image⁚${state.bg_id}`

	if (!state.previous_bg_id) {
		document.getElementById('bg')!.classList.add(css_class)

		const inner_html = ELEMENTS.reduce((acc, bg) => {
			const { css_class } = bg
			return acc + `
<button class="grid-item o⋄marginꘌnone o⋄outline" onclick="switch_to_bg('${get_bg_id(css_class)}')">${get_bg_id(css_class)}</button>`
		}, '')
		document.getElementById('grid-root')!.innerHTML = inner_html

		$('.grid').isotope({
			// options
			itemSelector: '.grid-item',
			layoutMode: 'fitRows'
		})
	}
	else {
		const previous_css_class = `tbrpg⋄bg-image⁚${state.previous_bg_id}`
		document.getElementById('bg')!.classList.replace(previous_css_class, css_class)
	}
	state.previous_bg_id = state.bg_id

	if (history.pushState) {
		const new_url = window.location.protocol + "//" + window.location.host + window.location.pathname + '?id=' + state.bg_id
		window.history.pushState({path:new_url},'',new_url)
	}
}
render()

////////////////////////////////////

window.switch_to_bg = (id: string) => {
	set_bg_id(id)
	render()
}
