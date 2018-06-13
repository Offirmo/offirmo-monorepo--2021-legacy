"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const typescript_string_enums_1 = require("typescript-string-enums");
const types_1 = require("../types");
const DEFAULT_EXAMPLE = {
    "round": "Group",
    "match": 5,
    "team1": "Australia",
    "team2": "France",
    "results": [
        {
            "match": 1,
            "round": "Group",
            "team1": {
                "name": "Russia",
                "score": 1,
                "winner": true
            },
            "team2": {
                "name": "Saudi Arabia",
                "score": 0,
                "winner": false
            }
        },
        {
            "match": 2,
            "round": "Group",
            "team1": {
                "name": "Egypt",
                "score": 2,
                "winner": false
            },
            "team2": {
                "name": "Uruguay",
                "score": 3,
                "winner": true
            }
        },
        {
            "match": 3,
            "round": "Group",
            "team1": {
                "name": "Portugal",
                "score": 2,
                "winner": false
            },
            "team2": {
                "name": "Spain",
                "score": 2,
                "winner": false
            }
        },
        {
            "match": 4,
            "round": "Group",
            "team1": {
                "name": "Morocco",
                "score": 1,
                "winner": true
            },
            "team2": {
                "name": "Iran",
                "score": 0,
                "winner": false
            }
        }
    ]
};
function iterateXTimes(fn, times = 10) {
    for (let iteration = 0; iteration < 10; ++iteration) {
        fn(iteration);
    }
}
exports.iterateXTimes = iterateXTimes;
function assertBasic(request, result, debugId) {
    if (request.round === types_1.RoundType.Group)
        chai_1.expect(result.winner === request.team1 || result.winner === request.team2 || result.winner === 'draw', debugId).to.be.true;
    else
        chai_1.expect(result.winner === request.team1 || result.winner === request.team2, debugId).to.be.true;
}
function iterateOverPossibleCases(predict, expectFn) {
    function test(request, iteration) {
        const debugId = `when predicting ${request.team1} vs ${request.team2} in ${request.round} #${iteration}`;
        const result = predict(request);
        assertBasic(request, result, debugId);
        expectFn({ request, result, debugId, iteration });
    }
    iterateXTimes(iteration => {
        test(DEFAULT_EXAMPLE, iteration);
    });
    typescript_string_enums_1.Enum.values(types_1.RoundType).forEach(round => {
        typescript_string_enums_1.Enum.values(types_1.Team).forEach(team1 => {
            typescript_string_enums_1.Enum.values(types_1.Team).forEach(team2 => {
                if (team2 === team1)
                    return;
                const request = {
                    round,
                    match: 1,
                    team1,
                    team2,
                    results: [],
                };
                iterateXTimes(iteration => {
                    test(request, iteration);
                });
            });
        });
    });
}
exports.iterateOverPossibleCases = iterateOverPossibleCases;
//# sourceMappingURL=test.js.map