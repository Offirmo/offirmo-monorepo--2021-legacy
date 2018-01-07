interface UnicodeCharDetails {
    code_point: number;
    char: string;
    taxonomy: string[];
    tags: string[];
    CLDR_short_name?: string;
    gendered?: boolean;
    skin_colorizable?: boolean;
    properties: {
        [k: string]: string;
    };
}
declare const CHARACTERS: {
    [k: string]: UnicodeCharDetails;
};
export { UnicodeCharDetails, CHARACTERS };
