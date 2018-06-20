import { pickRandom } from '../../helpers/random';
function predict(request) {
    const possible_output = [
        request.team1,
        request.team2,
    ];
    return {
        winner: pickRandom(...possible_output)
    };
}
export default predict;
//# sourceMappingURL=index.js.map