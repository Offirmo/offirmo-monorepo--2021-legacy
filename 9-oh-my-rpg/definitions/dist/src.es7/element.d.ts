import { UUID } from '@offirmo/uuid';
import { ElementType, Element } from './types';
declare function create_element_base(element_type: ElementType, hints?: Readonly<{
    uuid?: UUID;
}>): Element;
declare function xxx_test_unrandomize_element<T extends Element>(e: Readonly<T>, hint?: UUID): T;
export { create_element_base, xxx_test_unrandomize_element, };
