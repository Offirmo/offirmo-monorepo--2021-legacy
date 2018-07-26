import { PRODUCT } from './consts';
/////////////////////
const enforce_immutability = (x) => x;
//const enforce_immutability = (state: State) => deepFreeze(state) TODO
function decorate_SEC(SEC) {
    SEC.injectDependencies({
        enforce_immutability,
    });
    SEC.setAnalyticsAndErrorDetails({
        product: PRODUCT,
    });
    return SEC; // for chaining
}
/////////////////////
export { decorate_SEC, };
//# sourceMappingURL=root_sec.js.map