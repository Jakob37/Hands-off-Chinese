import { HocDb } from '../../src/backend/database'

const LOAD_DATABASE = 'LOAD_DATABASE'
const TOGGLE_ENTRIES_PAUSED = 'TOGGLE_ENTRIES_PAUSED'
const SET_CURRENT_ENTRIES = 'SET_CURRENT_ENTRIES'

const loadDatabase = (callback: (db: HocDb) => void) => {
    return { type: LOAD_DATABASE, callback }
}

const toggleEntriesPaused = (ids: Set<string>) => {
    return { type: TOGGLE_ENTRIES_PAUSED, ids }
}

const setCurrentEntries = (ids: Set<string>) => {
    return { type: SET_CURRENT_ENTRIES, ids }
}

export {
    LOAD_DATABASE,
    loadDatabase,
    TOGGLE_ENTRIES_PAUSED,
    toggleEntriesPaused,
    SET_CURRENT_ENTRIES,
    setCurrentEntries,
}
