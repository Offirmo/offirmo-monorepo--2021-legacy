import {JSON_UNDEFINED} from "../../../../4-incubator/universal-debug-api-companion-webextension/src/common/utils/stringified-json";

export interface WithTimestamps {
	created_at: string
	updated_at: string
}

export type WithoutTimestamps<T> = Omit<Omit<T, 'created_at'>, 'updated_at'>
