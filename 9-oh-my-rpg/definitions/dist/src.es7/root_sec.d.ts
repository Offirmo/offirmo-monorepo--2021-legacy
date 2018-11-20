import { ImmutabilityEnforcer } from '@offirmo/ts-types';
declare type SoftExecutionContext = any;
interface BaseContext {
    SEC: SoftExecutionContext;
    ENV: string;
    logger: any;
}
interface OMRContext extends BaseContext {
    enforce_immutability: ImmutabilityEnforcer;
}
declare function decorate_SEC(SEC: SoftExecutionContext): SoftExecutionContext;
export { SoftExecutionContext, BaseContext, OMRContext, decorate_SEC, };
