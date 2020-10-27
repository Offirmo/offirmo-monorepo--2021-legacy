import {
	BaseRootState,
	BaseTState,
	BaseUState,
	WithRevision,
} from './types'


export interface AnyBaseState extends WithRevision {
	[k: string]: any
}
export interface AnyBaseUState extends BaseUState {
	[k: string]: any
}
export interface AnyBaseTState extends BaseTState {
	[k: string]: any
}
export interface AnyRootState extends BaseRootState<AnyBaseUState, AnyBaseTState> {
}
