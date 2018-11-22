"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
//import { JSONObject } from "@offirmo/ts-types"
/////////////////////
const AchievementStatus = typescript_string_enums_1.Enum('secret', // should not even be hinted
'hidden', // may be hinted, for ex. as [???]
'revealed', // appear and conditions may be seen
'unlocked');
exports.AchievementStatus = AchievementStatus;
/////////////////////
//# sourceMappingURL=types.js.map