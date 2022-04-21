import { requestIdleCallback, MAX_IDLE_DELAY_MS } from './ponyfills'

type VoidFunction = () => void

export const DELAY_UNTIL_NEXT_EVENT_LOOP_MS = 1 // for Chrome/nodejs at least
export const BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS = 2 * DELAY_UNTIL_NEXT_EVENT_LOOP_MS // to account for outdated code using setTimeout(0)
export const FRAME_DURATION_MS = Math.floor(1000 / 60) // 60 fps
export const HUMAN_PERCEPTION_MS = 100 // https://developers.google.com/web/updates/2015/08/using-requestidlecallback
export const MAX_IDLE_DELAY_SAFE_FOR_HUMAN_PERCEPTION_MS = Math.floor(HUMAN_PERCEPTION_MS / 2.) // https://developers.google.com/web/updates/2015/08/using-requestidlecallback


export function schedule_when_idle_but_not_too_far(callback: VoidFunction, max_delay_ms: number = MAX_IDLE_DELAY_MS): void {
	requestIdleCallback(callback, { timeout: max_delay_ms })
}

export function schedule_when_idle_but_within_human_perception(callback: VoidFunction): void {
	// yes, same as above but semantically different
	requestIdleCallback(callback, { timeout: MAX_IDLE_DELAY_SAFE_FOR_HUMAN_PERCEPTION_MS })
}

export function asap_but_not_synchronous(callback: VoidFunction): void {
	queueMicrotask(callback)
}

export function asap_but_out_of_immediate_execution(callback: VoidFunction): void {
	setTimeout(callback, BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS)
}
export function asap_but_out_of_current_event_loop(callback: VoidFunction): void {
	setTimeout(callback, BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS)
}

// https://blog.izs.me/2013/08/designing-apis-for-asynchrony
export function dezalgo(callback: VoidFunction): VoidFunction {
	return () => asap_but_not_synchronous(callback)
}
