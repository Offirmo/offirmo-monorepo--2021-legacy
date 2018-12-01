declare type PrettyJsonOptions = any;
declare function prettify_json(data: Readonly<any>, options?: Readonly<PrettyJsonOptions>): string;
declare function dump_pretty_json(msg: string, data: Readonly<any>, options?: Readonly<PrettyJsonOptions>): void;
export default prettify_json;
export { prettify_json, dump_pretty_json, };
