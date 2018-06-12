import { getRootSEC } from '@offirmo/soft-execution-context';
import { LIB } from './consts';
function get_lib_SEC(parent) {
    return (parent || getRootSEC())
        .createChild()
        .setLogicalStack({ module: LIB });
}
export { get_lib_SEC, };
//# sourceMappingURL=sec.js.map