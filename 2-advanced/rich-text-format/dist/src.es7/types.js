import { Enum } from 'typescript-string-enums';
///////
const NodeType = Enum(
// https://stackoverflow.com/questions/9189810/css-display-inline-vs-inline-block
// display "inline"
'inline_fragment', // = span
'strong', // strong but less strong than heading. Ex. ansi.bold
'weak', // opposite of strong ;) Ex. ansi.dim
'em', // TODO semantic difference with strong? Alternate? (= italic)
// display "block"
'block_fragment', // = div
'heading', 'hr', 'ol', 'ul', 
// special
'br', 
// internally used, don't mind, don't use directly
'li');
////////////
export { NodeType, };
//# sourceMappingURL=types.js.map