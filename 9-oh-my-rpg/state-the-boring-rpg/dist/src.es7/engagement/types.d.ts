import { Enum } from 'typescript-string-enums';
declare const EngagementKey: {
    "hello_world--flow": "hello_world--flow";
    "hello_world--aside": "hello_world--aside";
    "hello_world--warning": "hello_world--warning";
    "tip--first_play": "tip--first_play";
    "code_redemption--failed": "code_redemption--failed";
    "code_redemption--succeeded": "code_redemption--succeeded";
};
declare type EngagementKey = Enum<typeof EngagementKey>;
export { EngagementKey, };
