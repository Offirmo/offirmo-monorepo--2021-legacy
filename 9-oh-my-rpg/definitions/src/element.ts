
import { UUID, ElementType, Element} from './types'
import { generate_uuid } from './generate_uuid'

function create_element_base(element_type: ElementType, hints: {uuid?: UUID} = {}): Element {
	const uuid = hints.uuid || generate_uuid()

	return {
		element_type,
		uuid,
	}
}

function xxx_test_unrandomize_element<T extends Element>(e: any, hint?: UUID): T {
	return {
		...e,
		uuid: hint || 'uu1~test~test~test~test~'
	} as T
}

export {
	create_element_base,
	xxx_test_unrandomize_element,
}
