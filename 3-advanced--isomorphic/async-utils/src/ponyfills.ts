import assert from 'tiny-invariant'
import { getGlobalThis } from '@offirmo/globalthis-ponyfill'


// XXX DO NOT USE
// XXX queueMicrotask() SHOULD ALWAYS BE PREFERRED
// node only so far, semantic changed in >=0.9.1
// adds callback to the "next tick queue".
// This queue is fully drained after the current operation on the JavaScript stack runs to completion
// and before the event loop is allowed to continue.
// It's possible to create an infinite loop if one were to recursively call process.nextTick()
export const nextTick: (callback: Function, ...args: any[]) => void
	= getGlobalThis().process?.nextTick
	|| function nextTickPonyFill(callback: Function, ...args: any[]): void {
		// closest possible effect in browser
		queueMicrotask(() => callback(...args))
	}


// XXX DO NOT USE except for very special nodejs I/O cases
// node only so far >=0.9.1
// Schedules the "immediate" execution of the callback after I/O events' callbacks.
// that could happen in current event loop or in the next one, depending on where we are
interface Immediate { // credits: node typings
	hasRef(): boolean
	ref(): this
	unref(): this
	_onImmediate: Function // to distinguish it from the Timeout class
}
export const setImmediate: (callback: (...args: any[]) => void, ...args: any[]) => Immediate
	= getGlobalThis().setImmediate
	|| function setImmediatePonyFill(callback: (...args: any[]) => void, ...args: any[]): void {
		// closest possible effect
		setTimeout(callback, 0, ...args)
	}


// browser only
// Strange semantic of being clamped to 50ms
// https://developers.google.com/web/updates/2015/08/using-requestidlecallback
export const MIN_IDLE_DELAY_MS = 2 // since <=1 is all the same
export const MAX_IDLE_DELAY_MS = 50 // according to https://developers.google.com/web/updates/2015/08/using-requestidlecallback
const DEFAULT_IDLE_DELAY_MS = MIN_IDLE_DELAY_MS // interesting discussion:
// according to Chrome, rIC replaces a direct invocation, so its default should be short
export interface IdleDeadline {
	didTimeout: boolean
	timeRemaining: () => number
}
export type IdleCallbackId = any
export const requestIdleCallback: (callback: (info: IdleDeadline) => void, options?: { timeout?: number }) => IdleCallbackId
	= getGlobalThis().requestIdleCallback?.bind(getGlobalThis()) // yes, the bind is needed
	|| function requestIdleCallbackPonyFill(callback: (info: IdleDeadline) => void, { timeout = DEFAULT_IDLE_DELAY_MS }: { timeout?: number } = {}): IdleCallbackId {
		// inspired from https://developers.google.com/web/updates/2015/08/using-requestidlecallback#checking_for_requestidlecallback

		assert (timeout >= MIN_IDLE_DELAY_MS, 'whats the point in requesting idle with a short timeout??')
		assert (timeout <= MAX_IDLE_DELAY_MS, 'must be an error requesting idle with a timeout of more than 50ms??')

		let startTime = Date.now()
		function timeRemaining() {
			return Math.max(0, Date.now() - startTime)
		}

		// const fake_possible_idle_delay_for_polyfill_ms = Math.floor(Math.random() * timeout) NO!! or subsequent calls may happen earlier than the previous!
		//const final_delay_ms = Math.max(fake_possible_idle_delay_for_polyfill_ms, MIN_IDLE_DELAY_MS)
		const final_delay_ms = MIN_IDLE_DELAY_MS // no choice in a polyfill...

		return setTimeout(() => {
			callback({
				didTimeout: false, // this is a shim
				timeRemaining,
			})
		}, final_delay_ms)
	}

// TODO one day cancelIdleCallback (I don't need it)
