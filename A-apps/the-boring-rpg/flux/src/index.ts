export { VERSION, NUMERIC_VERSION, SCHEMA_VERSION, BUILD_DATE, get_logger } from '@tbrpg/state'

export * from './game-instance'
export { Store } from './stores/types'
export { setTextEncoder } from '@offirmo-private/murmurhash' // due to parcel duplicating the packages :-/
export { StorageKey } from './stores/local-storage'
