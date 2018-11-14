import { Enum } from 'typescript-string-enums';
declare const NodeType: {
    span: "span";
    strong: "strong";
    weak: "weak";
    em: "em";
    heading: "heading";
    hr: "hr";
    ol: "ol";
    ul: "ul";
    br: "br";
    inline_fragment: "inline_fragment";
    block_fragment: "block_fragment";
    li: "li";
};
declare type NodeType = Enum<typeof NodeType>;
interface CheckedNode {
    $v: number;
    $type: NodeType;
    $classes: string[];
    $content: string;
    $sub: {
        [id: string]: Partial<CheckedNode>;
    };
    $hints: {
        [k: string]: any;
    };
}
declare type Node = Partial<CheckedNode>;
declare type Document = Node;
export { NodeType, CheckedNode, Node, Document, };
