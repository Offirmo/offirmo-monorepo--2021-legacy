
export type Callback = (tms: number, id?: string) => void

export type PulseFrequency =
	// all those frequencies are BEST EFFORT
	// since they will be sampled from requestAnimationFrame anyway
	number
	| 'framerate' // asap, for graphical updates
	| 'minute' // lower freq, for ex. displaying a clock
	| 'cloudᝍsync' // lower freq, the frequency we check for cloud updates

export interface PulseOptions {
	visual: boolean // means that we don't need pulse if app is not visible
	cloud: boolean  // means that we don't need pulse if app is no network

	ideal_period_ms: number // BEST EFFORT since will be sampled from requestAnimationFrame anyway
}

export interface State {
	logger: Console
	min_period_ms: number
	subscriptions: {
		[id: string]: {
			options: PulseOptions
			callback: Callback
			last_call_tms: number
		}
	}
}
