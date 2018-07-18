import { NodeType, CheckedNode, Node } from './types';
export interface OnNodeEnterParams<State> {
    $id: string;
    $node: CheckedNode;
    depth: number;
}
export interface BaseParams<State> {
    state: State;
    $node: CheckedNode;
    depth: number;
}
export interface OnRootExitParams<State> extends BaseParams<State> {
}
export interface OnNodeExitParams<State> extends BaseParams<State> {
    $id: string;
}
export interface OnConcatenateStringParams<State> extends BaseParams<State> {
    str: string;
}
export interface OnConcatenateSubNodeParams<State> extends BaseParams<State> {
    sub_state: State;
    $id: string;
    $parent_node: CheckedNode;
}
export interface OnFilterParams<State> extends BaseParams<State> {
    $filter: string;
    $filters: string[];
}
export interface OnClassParams<State> extends BaseParams<State> {
    $class: string;
}
export interface OnTypeParams<State> extends BaseParams<State> {
    $type: NodeType;
    $parent_node?: CheckedNode;
}
interface WalkerReducer<State, P extends BaseParams<State>> {
    (params: P): State;
}
interface WalkerCallbacks<State> {
    on_root_enter(): void;
    on_root_exit(params: OnRootExitParams<State>): any;
    on_node_enter(params: OnNodeEnterParams<State>): State;
    on_node_exit: WalkerReducer<State, OnNodeExitParams<State>>;
    on_concatenate_str: WalkerReducer<State, OnConcatenateStringParams<State>>;
    on_concatenate_sub_node: WalkerReducer<State, OnConcatenateSubNodeParams<State>>;
    on_filter: WalkerReducer<State, OnFilterParams<State>>;
    on_filter_Capitalize: WalkerReducer<State, OnFilterParams<State>>;
    on_class_before: WalkerReducer<State, OnClassParams<State>>;
    on_class_after: WalkerReducer<State, OnClassParams<State>>;
    on_type: WalkerReducer<State, OnTypeParams<State>>;
    on_type_span?: WalkerReducer<State, OnTypeParams<State>>;
    on_type_strong?: WalkerReducer<State, OnTypeParams<State>>;
    on_type_em?: WalkerReducer<State, OnTypeParams<State>>;
    on_type_heading?: WalkerReducer<State, OnTypeParams<State>>;
    on_type_hr?: WalkerReducer<State, OnTypeParams<State>>;
    on_type_ol?: WalkerReducer<State, OnTypeParams<State>>;
    on_type_ul?: WalkerReducer<State, OnTypeParams<State>>;
    on_type_li?: WalkerReducer<State, OnTypeParams<State>>;
    on_type_br?: WalkerReducer<State, OnTypeParams<State>>;
    [on_fiter_or_type: string]: any;
}
declare function walk<State>($raw_node: Node, raw_callbacks: Partial<WalkerCallbacks<State>>, { $parent_node, $id, depth, }?: {
    $parent_node?: CheckedNode;
    $id?: string;
    depth?: number;
}): State;
export { NodeType, CheckedNode, Node, WalkerReducer, WalkerCallbacks, walk, };
