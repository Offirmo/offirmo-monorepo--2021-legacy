function createCatcher({ decorators = [], onError, debugId = '?' } = {}) {
    return (err) => {
        //console.info(`[catchFactory from ${debugId}]`)
        err = decorators.reduce((err, decorator) => {
            try {
                err = decorator(err);
                if (!err.message)
                    throw new Error();
            }
            catch (decoratorErr) {
                console.error(`catchFactory exec from ${debugId}: bad decorator!`, {
                    err,
                    decoratorErr,
                    'decorator.name': decorator.name,
                });
            }
            return err;
        }, err);
        if (onError)
            return onError(err);
        throw err; // or rethrow since still unhandled
    };
}
export { createCatcher, };
//# sourceMappingURL=catch-factory.js.map