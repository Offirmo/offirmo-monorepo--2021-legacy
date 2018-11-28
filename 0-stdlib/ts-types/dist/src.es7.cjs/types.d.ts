declare type JSPrimitiveType = boolean | null | undefined | number | string;
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
export { JSPrimitiveType, JSONAny, JSONPrimitiveType, JSONArray, JSONObject, I18nMessages, ImmutabilityEnforcer, };
