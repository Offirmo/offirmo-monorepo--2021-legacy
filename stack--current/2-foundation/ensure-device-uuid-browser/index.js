import { generate_uuid } from '@offirmo-private/uuid'

export const LS_KEY = 'XOF.device_uuid'

export default function ensureDeviceUUID({storage = window.localStorage} = {}) {
	let UUID = storage.getItem(LS_KEY)

	if (!UUID || UUID.length < 20) {
		UUID = generate_uuid()
		try {
			storage.setItem(LS_KEY, UUID)
		}
		catch (err) {
			// may happen if storage full or rare case where blocked
			UUID = "uu1cantwritetolocalstor8"
		}
	}

	return UUID
}
