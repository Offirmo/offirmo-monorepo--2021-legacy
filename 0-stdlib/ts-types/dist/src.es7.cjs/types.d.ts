declare type JSPrimitiveType = boolean | null | undefined | number | string;
interface NumberHash {
    [k: string]: number;
}
declare type JSONAny = JSONPrimitiveType | JSONArray | JSONObject;
declare type JSONPrimitiveType = boolean | null | undefined | number | string;
interface JSONObject {
    [k: string]: JSONAny;
}
interface JSONArray extends Array<JSONAny> {
}
interface I18nMessages {
    [k: string]: string | I18nMessages;
}
declare type ImmutabilityEnforcer = <T>(x: T) => Readonly<T>;
export { JSPrimitiveType, NumberHash, JSONAny, JSONPrimitiveType, JSONArray, JSONObject, I18nMessages, ImmutabilityEnforcer, };
