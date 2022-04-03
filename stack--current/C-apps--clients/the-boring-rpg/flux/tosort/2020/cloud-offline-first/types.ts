import { OMRSoftExecutionContext } from '../../sec'

type JsonRpcCaller = <Params, Resp>(p: { SEC: OMRSoftExecutionContext, method: string, params: Params }) => Promise<Resp>

export {
	JsonRpcCaller,
}
