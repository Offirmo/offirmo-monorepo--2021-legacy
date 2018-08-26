import { NodeType, CheckedNode, Node, Document } from '../types';
interface Builder {
    addClass(...classes: string[]): Builder;
    pushText(str: string): Builder;
    pushStrong(str: string, id?: string): Builder;
    pushEmphasized(str: string, id?: string): Builder;
    pushRawNode(node: Node, id?: string): Builder;
    pushNode(node: Node, id?: string): Builder;
    pushLineBreak(): Builder;
    pushHorizontalRule(): Builder;
    pushKeyValue(key: Node | string, value: Node | string, id?: string): Builder;
    done(): CheckedNode;
}
declare function create($type: NodeType): Builder;
declare function inline_fragment(): Builder;
declare function block_fragment(): Builder;
declare function heading(): Builder;
declare function span(): Builder;
declare function ordered_list(): Builder;
declare function unordered_list(): Builder;
declare function key_value(key: Node | string, value: Node | string): Builder;
export { NodeType, Document, Builder, create, inline_fragment, block_fragment, heading, span, ordered_list, unordered_list, key_value, };
