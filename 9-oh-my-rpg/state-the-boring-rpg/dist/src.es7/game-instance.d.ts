import { State } from './types';
import { SoftExecutionContext } from './sec';
interface CreateParams<T> {
    SEC: SoftExecutionContext;
    get_latest_state: () => State;
    persist_state: (state: State) => void;
    view_state: T;
}
declare function create_game_instance<T>({ SEC, get_latest_state, persist_state, view_state }: CreateParams<T>): any;
export { CreateParams, create_game_instance, };
