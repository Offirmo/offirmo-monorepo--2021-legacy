declare type SoftExecutionContext = any;
interface BaseSECContext {
    SEC: SoftExecutionContext;
    env: string;
    logger: any;
}
declare type ImmutabilityEnforcer = <T>(v: T) => Readonly<T>;
interface SECContext extends BaseSECContext {
    enforce_immutability: ImmutabilityEnforcer;
}
declare function get_default_SEC_context(): {
    enforce_immutability: ImmutabilityEnforcer;
};
declare function oh_my_rpg_get_SEC({module, parent_SEC}: {
    module: string;
    parent_SEC?: SoftExecutionContext;
}): SoftExecutionContext;
export { SoftExecutionContext, BaseSECContext, ImmutabilityEnforcer, SECContext, get_default_SEC_context, oh_my_rpg_get_SEC };
