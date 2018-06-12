declare type SoftExecutionContext = any;
interface BaseContext {
    SEC: SoftExecutionContext;
    ENV: string;
    logger: any;
}
declare type ImmutabilityEnforcer = <T>(v: T) => Readonly<T>;
interface OMRContext extends BaseContext {
    enforce_immutability: ImmutabilityEnforcer;
}
declare function decorate_SEC(SEC: SoftExecutionContext): SoftExecutionContext;
export { SoftExecutionContext, BaseContext, ImmutabilityEnforcer, OMRContext, decorate_SEC, };
