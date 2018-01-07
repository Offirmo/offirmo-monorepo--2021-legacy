import { walk } from './walk';
import { callbacks as callbacks_render_debug } from './to_debug';
function to_debug($doc) {
    return walk($doc, callbacks_render_debug);
}
import { callbacks as walk_callbacks_to_text } from './to_text';
function to_text($doc) {
    return walk($doc, walk_callbacks_to_text);
}
import { callbacks as callbacks_render_html } from './to_html';
function to_html($doc) {
    return walk($doc, callbacks_render_html);
}
export * from './types';
export * from './walk';
export * from './builder';
export { to_debug, to_text, to_html, };
//# sourceMappingURL=index.js.map