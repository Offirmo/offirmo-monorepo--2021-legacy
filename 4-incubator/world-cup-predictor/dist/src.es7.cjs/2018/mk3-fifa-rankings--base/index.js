"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const random_1 = require("../../helpers/random");
function predict(request) {
    const possible_output = [
        request.team1,
        request.team2,
    ];
    if (request.round === types_1.RoundType.Group)
        possible_output.push('draw');
    return {
        winner: random_1.pickRandom(...possible_output)
    };
}
exports.default = predict;
//# sourceMappingURL=index.js.map