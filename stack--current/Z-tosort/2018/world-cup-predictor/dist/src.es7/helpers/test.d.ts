import { PredictionRequest, PredictionResult, Predictor } from '../types';
declare function iterateXTimes(fn: (iteration: number) => void, times?: number): void;
interface ExpectFunctionParams {
    request: PredictionRequest;
    result: PredictionResult;
    debugId: string;
    iteration: number;
}
declare function iterateOverPossibleCases(predict: Predictor, expectFn: (params: ExpectFunctionParams) => void): void;
export { iterateXTimes, ExpectFunctionParams, iterateOverPossibleCases, };
