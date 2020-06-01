// Firefox ESR compatible!

////////////////////////////////////

export interface OffirmoExtras {
	top_win: Window // may be inaccessible! (cross origin/sandbox)
	top_xoff_win: Window
	xdepth: number,

	// private:
	// ...flags
	// ...scripts memo
}

interface ScriptsMemo {
	// ↆscriptꓽ<url>
	[k: string]: Promise<HTMLElementTagNameMap['script']>
}
interface Flags<T> {
	// flagꓽdebug_render
	[k: string]: T
}

// check that we are always explicit
let document: never
//let window: never

////////////////////////////////////

// note that should NEVER be accessed directly on another iframe without a try/catch
// due to cross origin/sandbox
const PROP = 'oᐧextra'

////////////////////////////////////
/////// Accessors

function _get_xoff(win: Window = window): OffirmoExtras | undefined {
	try {
		// may throw if cross-origin/sandbox
		return (win as any)[PROP]
	}
	catch {
		return undefined
	}
}

export function get_xoff<T = {}>(win: Window = window): OffirmoExtras & T {
	const res = _get_xoff(win) as OffirmoExtras & T

	if (!res)
		throw new Error('ⓧ get_xoff(): not found on target!')

	return res
}

export function is_sandboxed(): boolean {
	const { top_win } = get_xoff()
	return !_get_xoff(top_win)
}

// TODO isn't that always the parent of the top xoff win?
export function get_top_window(win: Window = window): Window {
	return get_xoff(win).top_win
}

export function get_top_xoff_window(win: Window = window): Window {
	return get_xoff(win).top_xoff_win
}

export function get_top_ish_window(win: Window = window): Window {
	return is_sandboxed()
		? get_top_xoff_window(win)
		: get_top_window(win)
}

export function get_xoff_depth(win: Window = window): number {
	const xoff = _get_xoff(win)
	if (xoff)
		return xoff.xdepth

	if (win.parent !== win) {
		const parent_xoff = _get_xoff(win.parent)
		if (parent_xoff)
			return parent_xoff.xdepth + 1
	}

	return 0
}

export function get_log_prefix(win: Window = window): string {
	const depth = get_xoff_depth(win)
	return String.fromCodePoint(
		depth === 0
		? 0x24ea
		: 0x245F + depth
	)
}

function get_script_memo_attribute(url: string): string {
	return `ↆscriptꓽ${url}`
}

function get_flag_attribute(name: string): string {
	return `flagꓽ${name}`
}

export function get_xoff_flag<T = boolean>(name: string, win: Window = window): T {
	const xoff = get_xoff<Flags<T>>(win)

	return xoff[get_flag_attribute(name)]
}

////////////////////////////////////

function ensure_xoff(win: Window = window): OffirmoExtras {
	//console.log('ⓧ ensure_xoff()', { win, existing_xoff_depth: get_xoff_depth(win) || undefined })

	if (!_get_xoff(win)) {
		let root: OffirmoExtras | null = null

		if (win.parent !== win) {
			try {
				root = ensure_xoff(win.parent)
			}
			catch (err) {
				console.warn(`${get_log_prefix(win)} error on ensure_xoff(parent)`, { err })
			}
		}

		const properties: PropertyDescriptorMap = {
				...(root === null && {
					top_win: {
						value: win.parent, // Rem: may be equal to window
						writable: false,
					},
					top_xoff_win: {
						value: win,
						writable: false,
					},
					flagꓽdebug_render: {
						value: false,
						writable: true,
					},
				}),
				xdepth: {
					value: get_xoff_depth(win),
					writable: false,
				},
			}
		console.log({properties})
		;(win as any)[PROP] = Object.create(root, properties)
		//console.log(`${get_log_prefix(win)} ensure_xoff() installed`, { xdepth: get_xoff(win).xdepth, xoff: get_xoff(win) })
	}

	console.log(`${get_log_prefix(win)} ensure_xoff() ✔`, { win, xoff: get_xoff(win) })
	return get_xoff(win)
}

export function extend_xoff<T>(defaults: T, win: Window = window): T {
	console.log(`${get_log_prefix(win)} extend_xoff()`, { defaults, win })

	const xoff = get_xoff(win) as OffirmoExtras & T
	Object
		.entries(defaults)
		.filter(([k]) => !(k in xoff))
		.forEach(([k, value]) => (xoff as any)[k] = value)

	return xoff as T
}

export function set_xoff_flag<T = boolean>(name: string, value: T, win: Window = window): void {
	const xoff = get_xoff<Flags<T>>(win)

	xoff[get_flag_attribute(name)] = value
}

////////////////////////////////////

/*
export function reload_from_top(): void {
	console.log('ⓧ reload_from_top()')
	get_top_window().location.reload()
}*/

/*
export function open_from_top(args: Parameters<typeof window.open>): ReturnType<typeof window.open> {
	console.log('ⓧ open_from_top()', { ...args })
	return get_top_window().open(...args)
}*/

export function load_script_from_top(url: string, target_win: Window = get_top_ish_window()): Promise<HTMLElementTagNameMap['script']> {
	console.log(`${get_log_prefix()} load_script_from_top()`, { url, target_win })
	return Promise.resolve().then(() => {
		if (!_get_xoff(target_win))
			throw new Error(`${get_log_prefix()} load_script_from_top(): invalid target window! (cross origin?)`)

		const xoff_scripts = get_xoff<ScriptsMemo>(target_win)
		const memo_attribute = get_script_memo_attribute(url)
		if (!xoff_scripts[memo_attribute]) {
			const all_existing_top_scripts = Array.from(
				target_win.document.querySelectorAll(
					'script',
				),
			)
			let script: HTMLElementTagNameMap['script'] = all_existing_top_scripts.find(s => s.src === url) || (() => {
				const el = target_win.document.createElement('script')
				el.type = 'text/javascript'
				el.src = url
				;(el as any).importance = 'low' // https://developers.google.com/web/updates/2019/02/priority-hints
				el.defer = true
				target_win.document.body.appendChild(el)
				return el
			})()

			xoff_scripts[memo_attribute] = new Promise((resolve, reject) => {
				script.onload = () => {
					console.log(`${get_log_prefix()} script loaded from top`, url)
					resolve(script)
				}
				script.onerror = (_m, _s, _l, _c, err) => {
					console.warn(`${get_log_prefix()} script failed to load from top`, url, err)
					reject(err)
				}
			})
		}

		return xoff_scripts[memo_attribute]
	})
}

// needed to bypass X-Frame?
function _stringify_fn_call<A, R>(fn: (...args: A[]) => R, ...args: A[]): string {
	return `;(${String(fn)})(${args.map(p => typeof p === 'string' ? `"${p}"` : String(p)).join(',')})`
}
//console.log('XXX', _stringify_fn_call(console.log, [ 'foo', 'bar' ]))

export function execute_from_top<A, R>(fn: (...args: A[]) => R, ...args: A[]): Promise<void> {
	const target_win: Window = get_top_window()
	const code = _stringify_fn_call(fn, ...args)
	console.log(`${get_log_prefix()} execute_from_top`, get_xoff_depth(), 'to', get_xoff_depth(target_win), { target_win, target_xoff: get_xoff(target_win), fn, code })
	return Promise.resolve().then(() => {
		target_win.postMessage(
			{ xoff: { code }},
			window.document.location.origin,
		)
		//return eval(code) // yeah baby!
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

/*
window.addEventListener('message', ({data, origin, source}) => {
	console.log(`${get_log_prefix()} received pm`, { data, origin, source, depth: get_xoff_depth()})
	if (data?.xoff?.code)
		eval(data?.xoff?.code) // yeah baby!
}, false);

console.log(`${get_log_prefix()} is listening`)
*/
