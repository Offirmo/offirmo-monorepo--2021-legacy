import { generate_uuid } from '@offirmo/uuid';
function create_element_base(element_type, hints = {}) {
    const uuid = hints.uuid || generate_uuid();
    return {
        element_type,
        uuid,
    };
}
function xxx_test_unrandomize_element(e, hint) {
    return Object.assign({}, e, { uuid: hint || 'uu1~test~test~test~test~' });
}
export { create_element_base, xxx_test_unrandomize_element, };
//# sourceMappingURL=element.js.map