import { getRootSEC } from '@offirmo/soft-execution-context';
import { decorate_SEC } from '@oh-my-rpg/definitions';
import { LIB } from './consts';
function get_lib_SEC(parent) {
    return decorate_SEC((parent || getRootSEC())
        .createChild()
        .setLogicalStack({ module: LIB })
        .setAnalyticsAndErrorDetails({
        sub_product: 'state-progress',
    }));
}
export { get_lib_SEC, };
//# sourceMappingURL=sec.js.map