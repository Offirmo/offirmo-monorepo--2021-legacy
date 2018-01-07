"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const walk_1 = require("./walk");
const to_debug_1 = require("./to_debug");
function to_debug($doc) {
    return walk_1.walk($doc, to_debug_1.callbacks);
}
exports.to_debug = to_debug;
const to_text_1 = require("./to_text");
function to_text($doc) {
    return walk_1.walk($doc, to_text_1.callbacks);
}
exports.to_text = to_text;
const to_html_1 = require("./to_html");
function to_html($doc) {
    return walk_1.walk($doc, to_html_1.callbacks);
}
exports.to_html = to_html;
tslib_1.__exportStar(require("./types"), exports);
tslib_1.__exportStar(require("./walk"), exports);
tslib_1.__exportStar(require("./builder"), exports);
//# sourceMappingURL=index.js.map