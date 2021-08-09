
export type PulseFrequency =
	// all those frequencies are BEST EFFORT
	// since they will be sampled from requestAnimationFrame anyway
	number
	| 'framerate' // asap, for graphical updates
	| 'minute' // lower freq, for ex. displaying a clock
	| 'cloudᝍsync' // lower freq, the frequency we check for cloud updates

export interface PulseOptions {
	frequency: PulseFrequency
}

export interface State {
	logger: Console
	subscriptions: {
		[id: string]: {
			options: PulseOptions
			last_call_tms: number
		}
	}
}
