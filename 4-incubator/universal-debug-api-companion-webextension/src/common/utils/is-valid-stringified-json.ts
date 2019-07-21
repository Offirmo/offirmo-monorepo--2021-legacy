// TODO external module?

export default function is_valid_stringified_json(sjson: string): boolean {
	try {
		JSON.parse(sjson)
		return true
	}
	catch {
		return false
	}
}
