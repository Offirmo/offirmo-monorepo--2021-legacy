import { State } from './types';
import { SoftExecutionContext } from './sec';
interface CreateParams<T> {
    SEC: SoftExecutionContext;
    get_latest_state: () => State;
    update_state: (state: State) => void;
    client_state: T;
}
declare function create_game_instance<T>({SEC, get_latest_state, update_state, client_state}: CreateParams<T>): any;
export { CreateParams, create_game_instance };
