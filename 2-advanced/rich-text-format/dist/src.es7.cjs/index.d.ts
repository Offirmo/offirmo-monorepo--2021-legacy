import { Node } from './types';
declare function to_debug($doc: Node): string;
declare function to_text($doc: Node): string;
declare function to_html($doc: Node): string;
export * from './types';
export * from './walk';
export * from './builder';
export { to_debug, to_text, to_html };
