interface XError {
    name: string;
    message: string;
    stack?: string;
    statusCode?: number;
    shouldRedirect?: boolean;
    framesToPop?: number;
    details?: {
        [k: string]: boolean | number | string;
    };
    SEC?: any;
    _temp?: any;
}
export { XError, };
