
// yes it's like localStorage
export interface PersistentStorage {
	/**
	 * Returns the number of key/value pairs currently present in the list associated with the
	 * object.
	 */
	readonly length: number;
	/**
	 * Empties the list associated with the object of all key/value pairs, if there are any.
	 */
	clear(): void;
	/**
	 * value = storage[key]
	 */
	getItem(key: string): string | null;
	/**
	 * delete storage[key]
	 */
	removeItem(key: string): void;
	/**
	 * storage[key] = value
	 */
	setItem(key: string, value: string): void;
}
