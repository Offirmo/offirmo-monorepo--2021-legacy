
export interface WithTimestamps {
	created_at: string
	updated_at: string
}

export type WithoutTimestamps<T> = Omit<Omit<T, 'created_at'>, 'updated_at'>
