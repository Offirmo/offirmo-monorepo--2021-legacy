declare const LIB = "@offirmo/practical-logger-core";
declare const ALL_LOG_LEVELS: ("fatal" | "emerg" | "alert" | "crit" | "error" | "warning" | "warn" | "notice" | "info" | "verbose" | "log" | "debug" | "trace" | "silly")[];
declare const LEVEL_TO_INTEGER: {
    [k: string]: number;
};
declare const LEVEL_TO_HUMAN: {
    [k: string]: string;
};
export { LIB, ALL_LOG_LEVELS, LEVEL_TO_INTEGER, LEVEL_TO_HUMAN };
