
export function create_default_origin_state({is_eligible = true} = {}) {
	return {
		is_eligible,
		last_active: 0,
		is_injection_enabled: false,
		last_is_injection_enabled_value: false,
		overrides: {},
	}
}

export function create_demo_origin_state() {
	return {
		is_eligible: true,
		last_active: 0,
		is_injection_enabled: true,
		last_is_injection_enabled_value: true,
		overrides: {
			'root.logLevel': {
				is_enabled: false,
				type: 'll',
				value: 'error',
				has_activity: false,
				last_load_value: undefined,
			},
			'fooExperiment.cohort': {
				is_enabled: true,
				type: 'co',
				value: 'not-enrolled',
				has_activity: true,
				last_load_value: undefined,
			},
			'fooExperiment.logLevel': {
				is_enabled: true,
				type: 'll',
				value: 'error',
				has_activity: true,
				last_load_value: undefined,
			},
			'fooExperiment.isSwitchedOn': {
				is_enabled: true,
				type: 'b',
				value: true,
				has_activity: true,
				last_load_value: undefined,
			},
		}
	}
}
