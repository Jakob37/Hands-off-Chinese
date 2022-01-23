import { HocDb } from '../../src/backend/database'
import { AudioEntryPair } from '../../src/backend/audioentry'
import { LOAD_DATABASE } from '../actions/audioentries'

const initialState = {
    db: null,
}

// const retrieveCategoryEntriesList = (category: string) => {
//     const audioEntries = db.getAudioEntries(category)
//     setAudioEntries(audioEntries)
// }

const audioEntriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_DATABASE:
            console.log('Loading database')
            const db = new HocDb()
            db.initDatabase(() => {
                console.log('Loading done')
                // console.log('Obtained db', db)
                state.db = db
                action.callback(db)
            })
        default:
            return state
    }
}

export default audioEntriesReducer
