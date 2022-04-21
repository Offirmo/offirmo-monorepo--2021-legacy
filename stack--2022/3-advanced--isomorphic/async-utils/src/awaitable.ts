import {
	IdleDeadline,
	requestIdleCallback,
	MAX_IDLE_DELAY_MS,
} from './ponyfills'


export async function next_microtask(): Promise<void> {
	await Promise.resolve() // promise resolution is in microtasks
}

export async function end_of_current_event_loop(): Promise<void> {
	return new Promise(resolve => {
		setTimeout(resolve, 0)
	})
}

export async function elapsed_time_ms(duration_ms: number): Promise<void> {
	await new Promise(resolve => {
		setTimeout(resolve, duration_ms)
	})
	await end_of_current_event_loop() // extra wait for stuff that would fire exactly at the limit
}

export async function next_idle(): Promise<IdleDeadline> {
	return new Promise<IdleDeadline>(resolve => {
		requestIdleCallback(resolve)
	})
}

// useful for tests
export async function all_planned_idle_executed(): Promise<void> {
	let info: IdleDeadline | undefined
	let safety: number = 10
	//console.log({ safety, dt: info?.didTimeout ?? true})
	while (--safety && (info?.didTimeout ?? true)) {
		info = await next_idle()
		//console.log({ safety, dt: info?.didTimeout ?? true})
	}
}
