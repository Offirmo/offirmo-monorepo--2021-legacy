import { Enum } from 'typescript-string-enums';
//import { JSONObject } from "@offirmo/ts-types"
/////////////////////
const AchievementStatus = Enum('secret', // should not even be hinted
'hidden', // may be hinted, for ex. as [???]
'revealed', // appear and conditions may be seen
'unlocked');
/////////////////////
export { AchievementStatus, };
/////////////////////
//# sourceMappingURL=types.js.map