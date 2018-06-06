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
declare function enrich_SEC(SEC: SoftExecutionContext): void;
export { SoftExecutionContext, BaseContext, ImmutabilityEnforcer, OMRContext, enrich_SEC };
