declare const ITEM_QUALITIES: ("common" | "uncommon" | "rare" | "epic" | "legendary" | "artifact")[];
declare const ITEM_QUALITIES_TO_INT: {
    [k: string]: number;
};
declare const ITEM_SLOTS: ("weapon" | "armor")[];
declare const ITEM_SLOTS_TO_INT: {
    [k: string]: number;
};
declare const MIN_LEVEL = 1;
declare const MAX_LEVEL = 9999;
export { ITEM_QUALITIES, ITEM_QUALITIES_TO_INT, ITEM_SLOTS, ITEM_SLOTS_TO_INT, MIN_LEVEL, MAX_LEVEL };
