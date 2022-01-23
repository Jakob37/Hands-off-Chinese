import { HocDb } from '../../src/backend/database'
import { AudioEntryPair } from '../../src/backend/audioentry'
import {
    LOAD_DATABASE,
    SET_CURRENT_ENTRIES,
    TOGGLE_ENTRIES_PAUSED,
} from '../actions/audioentries'

interface InitialState {
    db: HocDb | null
    pausedIds: Set<string>
    currentIds: Set<string>
}
const initialState: InitialState = {
    db: null,
    pausedIds: new Set(),
    currentIds: new Set(),
}

interface Action {
    type: string
}

interface LoadDatabaseAction {
    type: string
    callback: (db: HocDb) => void
}

interface ToggleEntriesPausedAction {
    type: string
    ids: Set<string>
}

interface SetCurrentEntriesAction {
    type: string
    ids: Set<string>
}

const audioEntriesReducer = (
    state: InitialState = initialState,
    action: Action
) => {
    switch (action.type) {
        case LOAD_DATABASE:
            const loadDbAction = action as LoadDatabaseAction
            const db = new HocDb()
            // FIXME: Is this the right way to do side effects?
            db.initDatabase(() => {
                state.db = db
                loadDbAction.callback(db)
            })
            return state
        case TOGGLE_ENTRIES_PAUSED:
            const toggleEntriesPausedAction = action as ToggleEntriesPausedAction
            console.log('action', toggleEntriesPausedAction)
            const initialIds = new Set(Array.from(state.pausedIds));
            for (const id of Array.from(toggleEntriesPausedAction.ids)) {
                if (initialIds.has(id)) {
                    initialIds.delete(id)
                } else {
                    initialIds.add(id)
                }
                state.pausedIds = initialIds;
            }
            console.log('End ref', state.pausedIds);
            return state
        case SET_CURRENT_ENTRIES:
            const setCurrentEntriesAction = action as SetCurrentEntriesAction
            state.currentIds = setCurrentEntriesAction.ids
            return state
        default:
            return state
    }
}

export default audioEntriesReducer
