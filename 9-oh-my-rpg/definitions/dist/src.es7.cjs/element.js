"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("@offirmo/uuid");
function create_element_base(element_type, hints = {}) {
    const uuid = hints.uuid || uuid_1.generate_uuid();
    return {
        element_type,
        uuid,
    };
}
exports.create_element_base = create_element_base;
function xxx_test_unrandomize_element(e, hint) {
    return Object.assign({}, e, { uuid: hint || 'uu1~test~test~test~test~' });
}
exports.xxx_test_unrandomize_element = xxx_test_unrandomize_element;
//# sourceMappingURL=element.js.map