import { Enum } from 'typescript-string-enums';
declare const NodeType: {
    span: "span";
    br: "br";
    hr: "hr";
    ol: "ol";
    ul: "ul";
    li: "li";
    strong: "strong";
    em: "em";
    section: "section";
    heading: "heading";
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
export { NodeType, CheckedNode, Node, Document };
