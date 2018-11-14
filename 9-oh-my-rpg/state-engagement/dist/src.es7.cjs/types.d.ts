import { Enum } from 'typescript-string-enums';
declare const EngagementType: {
    flow: "flow";
    aside: "aside";
    warning: "warning";
};
declare type EngagementType = Enum<typeof EngagementType>;
interface Engagement {
    key: string;
    type: EngagementType;
}
interface EngagementParams {
    semantic_level?: 'error' | 'warning' | 'info' | 'success';
    auto_dismiss_delay_ms?: number;
    [key: string]: any;
}
interface PendingEngagement {
    uid: number;
    engagement: Engagement;
    params: EngagementParams;
}
interface State {
    schema_version: number;
    revision: number;
    queue: PendingEngagement[];
}
export { EngagementType, Engagement, EngagementParams, PendingEngagement, State, };
