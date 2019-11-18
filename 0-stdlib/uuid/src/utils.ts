import { UUID, WithUUID } from './types'

function xxx_test_unrandomize_element<T extends WithUUID>(x: Readonly<T>, hint?: UUID): T {
	return {
		...x,
		uuid: hint || 'uu1~test~test~test~test~',
	}
}

export {
	xxx_test_unrandomize_element,
}
