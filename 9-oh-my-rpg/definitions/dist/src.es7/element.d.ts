import { UUID, ElementType, Element } from './types';
declare function create_element_base(element_type: ElementType, hints?: {
    uuid?: UUID;
}): Element;
declare function xxx_test_unrandomize_element<T extends Element>(e: any, hint?: UUID): T;
export { create_element_base, xxx_test_unrandomize_element };
