interface RawArmorEntry {
    type: 'base' | 'qualifier1' | 'qualifier2';
    hid: string;
}
declare const ENTRIES: RawArmorEntry[];
export { RawArmorEntry, ENTRIES, };
