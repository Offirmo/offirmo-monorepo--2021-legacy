declare const VERSION = "v0.1.0";
declare const PRODUCT = "@oh-my-rpg";
declare const ITEM_QUALITIES: (string | number | symbol)[];
declare const ITEM_QUALITIES_TO_INT: {
    [k: string]: number;
};
declare const ITEM_SLOTS: (string | number | symbol)[];
declare const ITEM_SLOTS_TO_INT: {
    [k: string]: number;
};
declare const MIN_LEVEL = 1;
declare const MAX_LEVEL = 9999;
export { VERSION, PRODUCT, ITEM_QUALITIES, ITEM_QUALITIES_TO_INT, ITEM_SLOTS, ITEM_SLOTS_TO_INT, MIN_LEVEL, MAX_LEVEL, };
