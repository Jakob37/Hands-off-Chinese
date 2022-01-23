import Amplify, { Storage } from 'aws-amplify'
import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'
import { AudioEntryPair } from 'src/backend/audioentry'
import MainScreen from './mainscreen'
import awsconfig from './src/aws-exports'
import audioEntriesReducer from './store/reducers/audioentries'
import mealsReducer from './store/reducers/meals'
import categoriesReducer from './store/reducers/testcategories'

// FIXME: Leave Amplify
Amplify.configure(awsconfig)
// Needed to run in production? (verify)
Amplify.register(Storage)

// const db = new HocDb()

interface DefaultState {
    audioListDefault: AudioEntryPair[]
    defaultCategory: string | null
    defaultDisplayCategoryList: string[]
    defaultIsSelectedView: boolean
}

const rootReducer = combineReducers({
    meals: mealsReducer,
    categories: categoriesReducer,
    audioEntries: audioEntriesReducer,
})

const store = createStore(rootReducer)

// FIXME: Looking into how to work with Redux subscribers
// const counterSubscriber = () => {
//     const latestState = store.getState()
//     console.log(latestState)
// }
// store.subscribe(counterSubscriber)
// store.dispatch({ type: 'TOGGLE_ENTRIES_PAUSED', ids: new Set() })

// Is the 'connect' function correct here?



// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch

interface DefaultState {
    audioListDefault: AudioEntryPair[]
    defaultCategory: string | null
    defaultDisplayCategoryList: string[]
    defaultIsSelectedView: boolean
}

const App: React.FunctionComponent = () => {
    return (
        <Provider store={store}>
            <MainScreen />
        </Provider>
    )
}

export default App
