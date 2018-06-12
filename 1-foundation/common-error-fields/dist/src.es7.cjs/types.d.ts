interface XError {
    name: string;
    message: string;
    stack?: string;
    statusCode?: number;
    shouldRedirect?: boolean;
    details?: {
        [k: string]: any;
    };
    SEC?: any;
    _temp?: any;
}
export { XError, };
