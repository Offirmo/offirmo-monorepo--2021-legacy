import { Enum } from 'typescript-string-enums';
///////
const NodeType = Enum(
// https://stackoverflow.com/questions/9189810/css-display-inline-vs-inline-block
// display "inline"
'span', 'strong', 'em', 
// display "block"
'heading', 'hr', 'ol', 'ul', 
// internally used, don't mind
'li', 
// special
'br', 'inline_fragment', 'block_fragment');
////////////
export { NodeType, };
//# sourceMappingURL=types.js.map