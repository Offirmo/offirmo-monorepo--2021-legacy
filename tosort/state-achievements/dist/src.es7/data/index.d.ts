import { AchievementDefinition, AchievementStatus, Statistics } from '../types';
interface RawEntry {
    name: string;
    description: string;
    lore?: string;
    get_status?: (stats: Statistics) => AchievementStatus;
}
declare const RAW_ENTRIES: RawEntry[];
declare const ENTRIES: AchievementDefinition[];
export default ENTRIES;
export { RawEntry, RAW_ENTRIES, ENTRIES, };
