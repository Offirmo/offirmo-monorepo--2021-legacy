import * as OriginState from './origin'
import * as TabState from './tab'

export interface State {
	origin: OriginState.State,
	tab: TabState.State,
}
