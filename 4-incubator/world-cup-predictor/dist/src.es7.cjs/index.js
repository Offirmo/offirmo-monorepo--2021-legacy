"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mk1_random__simple_1 = tslib_1.__importDefault(require("./2018/mk1-random--simple"));
const mk2_random__advanced_1 = tslib_1.__importDefault(require("./2018/mk2-random--advanced"));
const mk3_fifa_rankings__base_1 = tslib_1.__importDefault(require("./2018/mk3-fifa-rankings--base"));
const predict = {
    mk1: mk1_random__simple_1.default,
    mk2: mk2_random__advanced_1.default,
    mk3: mk3_fifa_rankings__base_1.default,
};
exports.default = predict;
//# sourceMappingURL=index.js.map