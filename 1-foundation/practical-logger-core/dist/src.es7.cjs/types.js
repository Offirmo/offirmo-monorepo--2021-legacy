"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
///////
const LogLevel = typescript_string_enums_1.Enum('fatal', 'emerg', 'alert', 'crit', 'error', 'warning', 'warn', 'notice', 'info', 'verbose', 'log', 'debug', 'trace', 'silly');
exports.LogLevel = LogLevel;
//# sourceMappingURL=types.js.map