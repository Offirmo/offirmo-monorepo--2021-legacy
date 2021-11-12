	sourceV1: // TODO remove
	// primary
		| 'manual'

		// primary
		| 'exif'

		// primary -- original
		| 'original_basename_np' | 'original_basename_np+fs'
		| 'original_fs+original_env_hints'

		// primary -- current
		| 'current_basename_np'
		| 'some_basename_np' | 'some_basename_np+fs'
		| 'current_fs+current_env_hints'

		// secondary
		| 'some_basename_p'
		| 'original_env_hints'
		| 'current_env_hints'

		// junk
		| 'original_fs'
		| 'current_fs'

// https://stackoverflow.com/a/56650790/587407
const _get_defined_props = (obj: any) =>
Object.fromEntries(
Object.entries(obj)
.filter(([k, v]) => v !== undefined)
)
