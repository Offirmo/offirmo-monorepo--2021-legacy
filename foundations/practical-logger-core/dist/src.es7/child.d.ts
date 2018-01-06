import { Logger, LogParams, OutputFn } from './types';
interface ChildCreateParams extends Partial<LogParams> {
    parent: Logger;
    outputFn?: OutputFn;
}
declare function createChildLogger({parent, name, level, details, outputFn}: ChildCreateParams): Logger;
export { ChildCreateParams, createChildLogger };
