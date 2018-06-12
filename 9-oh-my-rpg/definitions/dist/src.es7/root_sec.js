import { PRODUCT, VERSION } from './consts';
/////////////////////
const enforce_immutability = (v) => v;
//const enforce_immutability = (state: State) => deepFreeze(state) TODO
function decorate_SEC(SEC) {
    SEC.injectDependencies({
        enforce_immutability,
    });
    SEC.setAnalyticsAndErrorDetails({
        product: PRODUCT,
        version: VERSION,
    });
    return SEC; // for chaining
}
/////////////////////
export { decorate_SEC, };
//# sourceMappingURL=root_sec.js.map