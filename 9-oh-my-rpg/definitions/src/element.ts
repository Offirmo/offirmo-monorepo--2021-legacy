import { UUID, generate_uuid } from '@offirmo/uuid'

import { ElementType, Element} from './types'

function create_element_base(element_type: ElementType, hints: {uuid?: UUID} = {}): Element {
	const uuid = hints.uuid || generate_uuid()

	return {
		element_type,
		uuid,
	}
}

function xxx_test_unrandomize_element<T extends Element>(e: Readonly<T>, hint?: UUID): T {
	return {
		...(e as any),
		uuid: hint || 'uu1~test~test~test~test~'
	} as T
}

export {
	create_element_base,
	xxx_test_unrandomize_element,
}
