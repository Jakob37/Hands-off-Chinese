import { HocDb } from '../../src/backend/database'

const LOAD_DATABASE = 'LOAD_DATABASE'
const TOGGLE_ENTRY_PAUSED = 'TOGGLE_ENTRY_PAUSED'

const loadDatabase = (callback: (db: HocDb) => void) => {
    return { type: LOAD_DATABASE, callback }
}

const toggleEntryPaused = (id: string) => {
    return { type: TOGGLE_ENTRY_PAUSED, id }
}

export { 
    LOAD_DATABASE,
    loadDatabase,
    TOGGLE_ENTRY_PAUSED,
    toggleEntryPaused
}
