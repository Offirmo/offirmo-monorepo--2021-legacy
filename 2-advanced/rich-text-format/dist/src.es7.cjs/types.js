"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
///////
const NodeType = typescript_string_enums_1.Enum(
// https://stackoverflow.com/questions/9189810/css-display-inline-vs-inline-block
// display: inline
'span', 'strong', 'em', 
// "block"
'heading', 'hr', 'ol', 'ul', 
// internally used, don't bother
'li', 
// special
'br', 'fragment');
exports.NodeType = NodeType;
//# sourceMappingURL=types.js.map