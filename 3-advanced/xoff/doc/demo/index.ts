
import {
	extend_xoff,
	get_offirmo_extras,
	get_top_window,
} from '../../src'

interface LocalExtras {
	top_href: string
}

console.group(window.location.href)
extend_xoff<LocalExtras>({ top_href: window.location.href })
console.log('Offirmo’s extras:', get_offirmo_extras())
console.log('Extra.top_href', get_offirmo_extras<LocalExtras>().top_href)
console.log(get_top_window() === window ? 'I’m top' : 'I’m not top')
console.groupEnd()
