import { NodeType, CheckedNode, Node, Document } from '../types';
interface CommonOptions {
    id?: string;
    classes?: string[];
}
interface Builder {
    addClass(...classes: string[]): Builder;
    addHints(hints: {
        [k: string]: any;
    }): Builder;
    pushText(str: string): Builder;
    pushRawNode(node: Node, options?: CommonOptions): Builder;
    pushNode(node: Node, options?: CommonOptions): Builder;
    pushInlineFragment(str: string, options?: CommonOptions): Builder;
    pushBlockFragment(str: string, options?: CommonOptions): Builder;
    pushStrong(str: string, options?: CommonOptions): Builder;
    pushWeak(str: string, options?: CommonOptions): Builder;
    pushHeading(str: string, options?: CommonOptions): Builder;
    pushHorizontalRule(): Builder;
    pushLineBreak(): Builder;
    pushHeading(str: string, options?: CommonOptions): Builder;
    pushKeyValue(key: Node | string, value: Node | string, options?: CommonOptions): Builder;
    done(): CheckedNode;
}
declare function create($type: NodeType): Builder;
declare function inline_fragment(): Builder;
declare function block_fragment(): Builder;
declare function heading(): Builder;
declare function strong(): Builder;
declare function weak(): Builder;
declare function ordered_list(): Builder;
declare function unordered_list(): Builder;
declare function key_value(key: Node | string, value: Node | string): Builder;
export { NodeType, Document, Builder, create, inline_fragment, block_fragment, heading, strong, weak, ordered_list, unordered_list, key_value, };
