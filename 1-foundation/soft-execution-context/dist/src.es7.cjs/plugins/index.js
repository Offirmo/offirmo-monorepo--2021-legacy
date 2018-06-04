"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./logical-stack/index");
const index_2 = require("./dependency-injection/index");
const index_3 = require("./error-handling/index");
const index_4 = require("./analytics/index");
const PLUGINS_BY_ID = {
    [index_4.PLUGIN]: index_4.PLUGIN,
    [index_1.PLUGIN.id]: index_1.PLUGIN,
    [index_2.PLUGIN.id]: index_2.PLUGIN,
    [index_3.PLUGIN.id]: index_3.PLUGIN,
};
exports.PLUGINS_BY_ID = PLUGINS_BY_ID;
const PLUGINS = Object.values(PLUGINS_BY_ID);
exports.PLUGINS = PLUGINS;
//# sourceMappingURL=index.js.map