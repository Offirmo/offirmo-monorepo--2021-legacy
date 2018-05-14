"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
/////////////////////
function parse_human_readable_UTC_timestamp_ms_v1(tstamp) {
    //console.log({tstamp})
    // format: ${YYYY}${MM}${DD}_${hh}h${mm}:${ss}.${mmm}
    if (tstamp.length !== 21)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [wrong length]');
    const [date_part, time_part] = tstamp.split('_');
    //console.log({date_part, time_part})
    if (date_part.length !== 8)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [wrong date length]');
    const YYYY_part = date_part.slice(0, 4);
    const MM_part = date_part.slice(4, 6);
    const DD_part = date_part.slice(6, 8);
    const YYYY = Number(YYYY_part);
    if (YYYY < 1970)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [YYYY]');
    const MM = Number(MM_part) - 1; // stupid spec
    if (MM > 11)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [MM]');
    const DD = Number(DD_part);
    if (DD > 31)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [DD]');
    if (time_part.length !== 12)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [wrong time length]');
    const hh_part = time_part.slice(0, 2);
    const mm_part = time_part.slice(3, 5);
    const ss_part = time_part.slice(6, 8);
    const mmm_part = time_part.slice(9, 12);
    //console.log({YYYY_part, MM_part, DD_part, hh_part, mm_part, ss_part, mmm_part})
    const hh = Number(hh_part);
    if (hh > 23)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [hh]');
    const mm = Number(mm_part);
    if (mm > 59)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [mm]');
    const ss = Number(ss_part);
    if (ss > 59)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [ss]');
    const mmm = Number(mmm_part);
    //console.log({YYYY, MM, DD, hh, mm, ss, mmm})
    return new Date(Date.UTC(YYYY, MM, DD, hh, mm, ss, mmm));
}
exports.parse_human_readable_UTC_timestamp_ms_v1 = parse_human_readable_UTC_timestamp_ms_v1;
function parse_human_readable_UTC_timestamp_ms(tstamp) {
    if (tstamp.startsWith('ts1_'))
        return parse_human_readable_UTC_timestamp_ms_v1(tstamp.slice(4));
    throw new Error('wrong timestamp, cant parse!');
}
exports.parse_human_readable_UTC_timestamp_ms = parse_human_readable_UTC_timestamp_ms;
/////////////////////
//# sourceMappingURL=parse.js.map