import { Logger, LogParams, OutputFn } from './types';
interface CreateParams extends LogParams {
    outputFn?: OutputFn;
}
declare function createLogger({ name, level, details, outputFn, }: CreateParams): Logger;
export { CreateParams, createLogger, };
