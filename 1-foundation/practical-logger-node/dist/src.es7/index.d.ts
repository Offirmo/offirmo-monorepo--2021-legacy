import { Logger, LogParams, createChildLogger } from '@offirmo/practical-logger-core';
declare const LEVEL_TO_STYLIZE: {
    [k: string]: (s: string) => string;
};
declare function createLogger(p: LogParams): Logger;
export { LEVEL_TO_STYLIZE, createLogger, createChildLogger, };
