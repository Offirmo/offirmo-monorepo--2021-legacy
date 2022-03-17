import { RoundType } from '../../types';
import { pickRandom } from '../../helpers/random';
function predict(request) {
    const possible_output = [
        request.team1,
        request.team2,
    ];
    if (request.round === RoundType.Group)
        possible_output.push('draw');
    return {
        winner: pickRandom(...possible_output)
    };
}
export default predict;
//# sourceMappingURL=index.js.map