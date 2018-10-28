"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
/////////////////////
const EngagementType = typescript_string_enums_1.Enum('flow', // normal immediate feedback to user actions
'aside', // side message like an achievement
'warning');
exports.EngagementType = EngagementType;
/////////////////////
//# sourceMappingURL=types.js.map