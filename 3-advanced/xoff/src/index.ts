// Firefox ESL compatible

//import poll_window_variable from '@offirmo-private/poll-window-variable'

console.log('17')

////////////////////////////////////

export interface OffirmoExtras {
	top_win: Window // may be inaccessible! (cross origin)
	top_xoff_win: Window
	xoff_depth: number,

	// flags
	flagꓽdebug_render: boolean

	// ...
}

interface ScriptsMemo {
	// ↆscriptꓽ<url>
	[k: string]: Promise<HTMLElementTagNameMap['script']>
}

////////////////////////////////////

// note that should NEVER be accessed directly on another iframe
// without a try/catch
const PROP = 'xoff'

////////////////////////////////////
/////// Accessors

function _get_offirmo_extras(win: Window = window): OffirmoExtras | undefined {
	try {
		// may throw if cross-origin
		return (win as any)[PROP]
	}
	catch {
		return undefined
	}
}

export function get_offirmo_extras<T = {}>(win: Window = window): OffirmoExtras & T {
	const res = _get_offirmo_extras(win) as OffirmoExtras & T

	if (!res)
		throw new Error('get_offirmo_extras(): XOFF not available on target!')

	return res
}

export function get_top_window(win: Window = window): Window {
	return get_offirmo_extras(win).top_win
}

export function get_top_xoff_window(win: Window = window): Window {
	return get_offirmo_extras(win).top_xoff_win
}

function get_script_memo_attribute(url: string): string {
	return `ↆscriptꓽ${url}`
}

export function get_xoff_depth(win: Window = window): number {
	const xoff = _get_offirmo_extras(win)
	if (xoff)
		return xoff.xoff_depth

	if (win.parent !== win) {
		const parent_xoff = _get_offirmo_extras(win.parent)
		if (parent_xoff)
			return parent_xoff.xoff_depth + 1
	}

	return 0
}

////////////////////////////////////

function ensure_xoff(win: Window = window): OffirmoExtras {
	console.log('ensure_xoff()', { win, existing_xoff_depth: get_xoff_depth(win) || undefined })

	if (!_get_offirmo_extras(win)) {

		if (win.parent !== win) {
			try {
				ensure_xoff(win.parent)
			}
			catch {}
		}


		;(win as any)[PROP] = {
			top_win: win.parent,
			top_xoff_win: win,
			flagꓽdebug_render: false,

			..._get_offirmo_extras(win),
			..._get_offirmo_extras(win.parent), // inherit from parent if any and accessible. Only once, assuming const

			xoff_depth: get_xoff_depth(win),
		}
		console.log('ensure_xoff() installed', { xoff_depth: get_offirmo_extras(win).xoff_depth, xoff: get_offirmo_extras(win) })
	}

	return get_offirmo_extras(win)
}

export function extend_xoff<T>(defaults: T, win: Window = window): T {
	console.log('extend_xoff()', { defaults, win })

	const res = (win as any)[PROP] = {
		...defaults,
		..._get_offirmo_extras(win),
	} as OffirmoExtras & T

	return res as T
}

////////////////////////////////////

/*
export function reload_from_top(): void {
	console.log('reload_from_top()')
	get_top_window().location.reload()
}*/

/*
export function open_from_top(args: Parameters<typeof window.open>): ReturnType<typeof window.open> {
	console.log('open_from_top()', { ...args })
	return get_top_window().open(...args)
}*/

export function load_script_from_top(url: string, win?: Window): Promise<HTMLElementTagNameMap['script']> {
	return Promise.resolve().then(() => {
		const target_win: Window = win || (() => {
			const { top_win } = get_offirmo_extras()
			if (_get_offirmo_extras(top_win))
				return top_win
			return get_offirmo_extras().top_xoff_win
		})()
		console.log('load_script_from_top()', { url, target_win })

		if (!_get_offirmo_extras(target_win))
			throw new Error('load_script_from_top(): invalid target window! (cross origin?)')

		const xoff_scripts = get_offirmo_extras<ScriptsMemo>(target_win)
		const memo_attribute = get_script_memo_attribute(url)
		if (!xoff_scripts[memo_attribute]) {
			const all_existing_top_scripts = Array.from(
				target_win.document.querySelectorAll(
					'script'
				)
			)
			let script: HTMLElementTagNameMap['script'] = all_existing_top_scripts.find(s => s.src === url) || (() => {
				const el = target_win.document.createElement('script')
				el.type = 'text/javascript'
				el.src = url
				;(el as any).importance = 'low' // https://developers.google.com/web/updates/2019/02/priority-hints
				el.defer = true
				document.body.appendChild(el)
				return el
			})()

			xoff_scripts[memo_attribute] = new Promise((resolve, reject) => {
				script.onload = () => {
					console.log('loaded', url)
					resolve(script)
				}
				script.onerror = (_m, _s, _l, _c, err) => {
					console.log('rejected', url, err)
					reject(err)
				}
			})
/*
			xoff_scripts[memo_attribute]
				.then(console.log)
				.catch(console.error)*/
		}

		return xoff_scripts[memo_attribute]
	})
}

/*
// TODO into a separate lib?
type Netlify = any
export function get_netlify_identity(args: Parameters<typeof window.open>): Promise<Netlify> {

	poll_window_variable('netlifyIdentity', { timeoutMs: 2 * 60 * 1000 })
		.then(NetlifyIdentity => {
			console.info('Netlify Identity loaded ✅')

}
*/

////////////////////////////////////

ensure_xoff()
