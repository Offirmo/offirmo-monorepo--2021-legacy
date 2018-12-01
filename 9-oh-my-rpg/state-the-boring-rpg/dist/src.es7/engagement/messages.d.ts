import * as RichText from '@offirmo/rich-text-format';
import { PendingEngagement } from '@oh-my-rpg/state-engagement';
import { State } from '../types';
declare function get_engagement_message(state: Readonly<State>, pe: Readonly<PendingEngagement>): RichText.Document;
export { get_engagement_message, };
