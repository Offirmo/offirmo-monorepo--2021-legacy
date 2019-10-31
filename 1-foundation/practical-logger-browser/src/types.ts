import { BaseSinkOptions } from '@offirmo/practical-logger-types'

export type Browser = 'firefox' | 'safari' | 'chromium' | 'other'

export interface SinkOptions extends BaseSinkOptions {
	useCss?: boolean
	betterGroups?: boolean
	explicitBrowser?: Browser
}
