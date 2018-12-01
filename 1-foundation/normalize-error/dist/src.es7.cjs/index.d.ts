import { XError } from '@offirmo/common-error-fields';
declare function normalizeError(err_like?: Readonly<Partial<Error>>): XError;
export default normalizeError;
