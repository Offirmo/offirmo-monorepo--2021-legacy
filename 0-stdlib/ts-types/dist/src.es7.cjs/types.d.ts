declare type JSPrimitiveType = boolean | null | undefined | number | string;
declare type JSONPrimitiveType = boolean | null | undefined | number | string;
interface JSONObject {
    [k: string]: JSONPrimitiveType | JSONArray | JSONObject;
}
interface JSONArray extends Array<JSONPrimitiveType | JSONObject | JSONArray> {
}
interface I18nMessages {
    [k: string]: string | I18nMessages;
}
declare type ImmutabilityEnforcer = <T>(x: T) => Readonly<T>;
export { JSPrimitiveType, JSONPrimitiveType, JSONArray, JSONObject, I18nMessages, ImmutabilityEnforcer, };
