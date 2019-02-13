// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html
export function getProperty<T, K extends keyof T>(obj: T, key: K) {
	return obj[key];  // Inferred type is T[K]
}
