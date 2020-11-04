// Must be Firefox ESR compatible!
// Beware of cross-origin!
// TODO clean the logs

////////////////////////////////////

export interface OffirmoExtras {
	// TODO those 2 props may be useless / redundant
	top_win: Window // may be inaccessible! (cross origin/sandbox)
	top_xoff_win: Window

	xdepth: number, // pre-compiled for ease of use

	// private:
	// ...flags
	// ...scripts memo
}

interface ScriptsMemo {
	// ↆscriptꓽ<url>
	[k: string]: Promise<HTMLElementTagNameMap['script']>
}
interface Flags<T> {
	// flagꓽdebug_xoff
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
const FLAG_DEBUG_XOFF = 'debug_xoff'
const FLAG_DEBUG_RENDER = 'debug_render'

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
	const xoff = _get_xoff(win) as OffirmoExtras & T

	if (!xoff)
		throw new Error('🆇ⓧ get_xoff(): not found on target!')

	return xoff
}

// can't access parent, either sandboxed or cross-origin
export function is_isolated(win: Window = window): boolean {
	const { top_win } = get_xoff(win)
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
	return is_isolated()
		? get_top_xoff_window(win)
		: get_top_window(win)
}

export function get_xoff_depth(win: Window = window): number {
	const xoff = _get_xoff(win)
	if (xoff)
		return xoff.xdepth

	if (win.parent !== win) {
		try {
			const parent_xoff = _get_xoff(win.parent)
			if (parent_xoff)
				return parent_xoff.xdepth + 1
		} catch {}
		return 1
	}

	return 0
}

export function get_log_symbol(win: Window = window): string {
	const xoff = _get_xoff(win)
	if (!xoff)
		return 'ⓧ'

	const xdepth = get_xoff_depth(win)
	if (xdepth === 0)
		return '⓪' // no zero, we use o

	return String.fromCodePoint(0x245F + xdepth)
}

function get_log_prefix(win: Window = window): string {
	return `🆇 ${get_log_symbol(win)}`
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
	//console.log('🆇 ensure_xoff()', { win, existing_xoff_depth: get_xoff_depth(win) || undefined })

	if (!_get_xoff(win)) {
		let root: OffirmoExtras | null = null

		if (win.parent !== win) {
			try {
				// can fail if cross-origin
				root = ensure_xoff(win.parent)
			}
			catch (err) {
				//console.warn(`${get_log_prefix(win)} error on ensure_xoff(parent)`, { err })
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
					[get_flag_attribute(FLAG_DEBUG_XOFF)]: {
						value: false, // TODO load from LS
						writable: true,
					},
					[get_flag_attribute(FLAG_DEBUG_RENDER)]: {
						value: false,
						writable: true,
					},
				}),
				xdepth: {
					value: get_xoff_depth(win),
					writable: false,
				},
			}
			//console.log('🆇', {properties})
		;(win as any)[PROP] = Object.create(root, properties)
		//console.log(`${get_log_prefix(win)} ensure_xoff() installed`, { xdepth: get_xoff(win).xdepth, xoff: get_xoff(win) })
	}

	if (get_xoff_flag(FLAG_DEBUG_XOFF, win)) console.log(`${get_log_prefix(win)} ensure_xoff() ✔`, { xoff: get_xoff(win) })
	return get_xoff(win)
}

export function extend_xoff<T>(defaults: T, win: Window = window): T {
	if (get_xoff_flag(FLAG_DEBUG_XOFF, win)) console.log(`${get_log_prefix(win)} extend_xoff()`, { defaults, win })

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
// needed to bypass X-Frame preventions

export function load_script_from_top(url: string, target_win: Window = get_top_ish_window()): Promise<HTMLElementTagNameMap['script']> {
	console.log(`${get_log_prefix()} → ${get_log_symbol(target_win)} load_script_from_top()…`, { url })
	return Promise.resolve().then(() => {
		if (!_get_xoff(target_win))
			throw new Error(`${get_log_prefix()} load_script_from_top(): invalid target window! (cross origin?)`)

		const xoff_scripts = get_xoff<ScriptsMemo>(target_win)
		const memo_attribute = get_script_memo_attribute(url)
		if (!xoff_scripts[memo_attribute]) {
			const all_existing_target_scripts = Array.from(
				target_win.document.querySelectorAll(
					'script',
				),
			)
			let script: HTMLElementTagNameMap['script'] = all_existing_target_scripts.find(s => s.src === url) || (() => {
				const el = target_win.document.createElement('script')
				//el.type = 'text/javascript'
				el.src = url
				;(el as any).importance = 'low' // https://developers.google.com/web/updates/2019/02/priority-hints
				el.defer = true
				target_win.document.body.appendChild(el)
				return el
			})()

			xoff_scripts[memo_attribute] = new Promise((resolve, reject) => {
				script.onload = () => {
					if (get_xoff_flag(FLAG_DEBUG_XOFF)) console.log(`${get_log_prefix()} script loaded from top ✔`, url)
					resolve(script)
				}
				script.onerror = (_m, _s, _l, _c, err) => {
					err = err ?? new Error('Unknown script loading error!')
					console.warn(`${get_log_prefix()} script failed to load from top!`, { url, err }, err)
					reject(err)
				}
			})
		}

		return xoff_scripts[memo_attribute]
	})
}

function _stringify_fn_call<A, R>(fn: (...args: A[]) => R, ...args: A[]): string {
	return `;(${String(fn)})(${args.map(p => JSON.stringify(p)).join(',')})`
}
export function execute_from_top<A, R>(fn: (...args: A[]) => R, ...args: A[]): Promise<void> {
	const target_win: Window = get_top_ish_window()
	const code = _stringify_fn_call(fn, ...args)
	console.log(`${get_log_prefix()} → ${get_log_symbol(target_win)} execute_from_top()…`, { fn, code, target_win })
	return Promise.resolve()
		.then(() => {
			const target_is_me = target_win === window
			if (target_is_me) {
				// better bc 1) better error report 2) better privacy (avoid a postMessage)
				eval(code)
				return
			}

			const { origin } = window.document.location
			// local files all have unique origins https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp
			// also a local file has origin === "null" on Firefox ESR
			const targetOrigin = (!origin || origin === 'file://' || origin === 'null') ? '*' : origin
			target_win.postMessage(
				{ xoff: { code }},
				targetOrigin,
			)
			// TODO some sort of callback?
		})
		.catch(err => {
			console.warn(`${get_log_prefix()} → ${get_log_symbol(target_win)} execute_from_top() failed!`, { fn, code, err })
			throw err
		})
}

////////////////////////////////////

ensure_xoff()

window.addEventListener('message', ({data, origin, source}) => {
	if (!data.xoff) return

	console.log(`${get_log_prefix()} received xoff postm`, { data, origin, source, depth: get_xoff_depth()})
	if (data.xoff.code)
		eval(data.xoff.code)
}, false)

if (get_xoff_flag(FLAG_DEBUG_XOFF)) console.log(`${get_log_prefix()} is listening`)

