import { Enum } from 'typescript-string-enums';
///////
const NodeType = Enum(
// https://stackoverflow.com/questions/9189810/css-display-inline-vs-inline-block
// display "inline"
'span', 'strong', 'em', 
// display "block"
'heading', 'hr', 'ol', 'ul', 
// special
'br', 'inline_fragment', 'block_fragment', 
// internally used, don't mind, don't use directly
'li');
////////////
export { NodeType, };
//# sourceMappingURL=types.js.map