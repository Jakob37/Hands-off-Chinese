import { HocDb } from "../../src/backend/database"

const LOAD_DATABASE = 'LOAD_DATABASE'

const loadDatabase = (callback: (db: HocDb) => void) => {
    return { type: LOAD_DATABASE, callback }
}

export { LOAD_DATABASE, loadDatabase }
