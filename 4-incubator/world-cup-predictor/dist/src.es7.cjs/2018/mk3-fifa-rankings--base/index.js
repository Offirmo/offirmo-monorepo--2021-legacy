"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const _2018_1 = require("../../datasets/2018");
function predict(request) {
    if (request.team1 === 'Russia' || request.team2 === 'Russia')
        return { winner: types_1.Team['Russia'] };
    const team1_fifa_points = _2018_1.FIFA_RANKING[request.team1];
    const team2_fifa_points = _2018_1.FIFA_RANKING[request.team2];
    return {
        winner: team1_fifa_points > team2_fifa_points
            ? request.team1
            : request.team2
    };
}
exports.default = predict;
//# sourceMappingURL=index.js.map