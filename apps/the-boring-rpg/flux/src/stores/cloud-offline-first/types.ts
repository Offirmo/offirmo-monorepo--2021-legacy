import { SoftExecutionContext } from '../../sec'

type JsonRpcCaller = <Params, Resp>(p: { SEC: SoftExecutionContext, method: string, params: Params }) => Promise<Resp>

export {
	JsonRpcCaller,
}
