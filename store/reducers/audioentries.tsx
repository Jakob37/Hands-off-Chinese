import { HocDb } from '../../src/backend/database'
import { AudioEntryPair } from '../../src/backend/audioentry'
import { LOAD_DATABASE, TOGGLE_ENTRY_PAUSED } from '../actions/audioentries'

const initialState = {
    db: null,
    pausedIds: new Set(),
}

const audioEntriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_DATABASE:
            const db = new HocDb()
            db.initDatabase(() => {
                state.db = db
                action.callback(db)
            })
        case TOGGLE_ENTRY_PAUSED:
            console.log('In redux, for action', action)
            if (state.pausedIds.has(action.id)) {
                state.pausedIds.delete(action.id)
            } else {
                state.pausedIds.add(action.id)
            }
            console.log('Final state', state.pausedIds)
        default:
            return state
    }
}

export default audioEntriesReducer
