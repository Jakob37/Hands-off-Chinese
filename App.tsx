import Amplify, { Storage } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import awsconfig from './src/aws-exports'
import { Button, ScrollView, Text, View } from 'react-native'
import { AudioEntryPair } from 'src/backend/audioentry'
import { makeNewAudioEntry } from './src/backend/apicalls'
import { HocDb } from './src/backend/database'
import { styles } from './src/style/Stylesheet'
import Footer from './src/views/footers/footer'
import CategoryCardList from './src/views/list/categorycardlist'
import ScrollableAudioCardList from './src/views/list/scrollableaudiocardlist'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import mealsReducer from './store/reducers/meals'
import { useSelector } from 'react-redux'

// FIXME: Leave Amplify
Amplify.configure(awsconfig)
// Needed to run in production? (verify)
Amplify.register(Storage)

const db = new HocDb()

interface DefaultState {
    audioListDefault: AudioEntryPair[]
    defaultCategory: string | null
    defaultDisplayCategoryList: string[]
    defaultIsSelectedView: boolean
}

// const defaultState =

const rootReducer = combineReducers({
    meals: mealsReducer,
})

const store = createStore(rootReducer)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

const App: React.FunctionComponent<DefaultState> = ({
    audioListDefault = [],
    defaultCategory = null,
    defaultDisplayCategoryList = ['Loading from AWS...'],
    defaultIsSelectedView = false,
}) => {

    

    const loadDatabase = () => {
        db.initDatabase((db) => {
            setDisplayCategoryList(db.getCategories())
        })
    }
    useEffect(loadDatabase, [])

    const retrieveCategoryEntriesList = (category: string) => {
        const audioEntries = db.getAudioEntries(category)
        setAudioEntries(audioEntries)
    }

    const [audioEntries, setAudioEntries] = useState(audioListDefault)
    const [currCategory, setCurrCategory] = useState(defaultCategory)
    const [displayCategoryList, setDisplayCategoryList] = useState(
        defaultDisplayCategoryList
    )
    const [isSelectedView, setIsSelectedView] = useState(defaultIsSelectedView)

    const [enterCategory, setEnterCategory] = useState('')


    const handleToggleComplete = (id: string) => {
        const updatedEntries = audioEntries.map((item) => {
            if (item.id === id) {
                const updatedItem = {
                    ...item,
                    paused: !item.paused,
                }
                return updatedItem
            }

            return item
        })

        setAudioEntries(updatedEntries)
    }

    const pauseAll = () => {
        const pausedEntries = audioEntries.map((entry) => {
            const updatedEntry = {
                ...entry,
                paused: true,
            }
            return updatedEntry
        })
        setAudioEntries(pausedEntries)
    }

    return (
        <Provider store={store}>
            <View style={{ flex: 1 }}>
                {!isSelectedView ? (
                    <View>
                        <Text style={styles.header}>Hands-off Chinese</Text>
                    </View>
                ) : (
                    <></>
                )}

                {/* <Button
                    onPress={() => {
                        console.log('hello world!')
                        console.log('Available meals:', availableMeals)
                    }}
                    title="test"
                ></Button> */}

                {!isSelectedView ? (
                    <ScrollView>
                        <CategoryCardList
                            categories={displayCategoryList}
                            displayCategories={displayCategoryList}
                            selectAction={(category) => {
                                retrieveCategoryEntriesList(category)
                                setIsSelectedView(true)
                                setCurrCategory(category)
                            }}
                        />
                    </ScrollView>
                ) : (
                    <ScrollableAudioCardList
                        audioList={audioEntries}
                        refreshS3List={() => {}}
                        db={db}
                        handleToggleComplete={handleToggleComplete}
                    />
                )}

                <Footer
                    audioEntries={audioEntries}
                    isSelectedView={isSelectedView}
                    backToMenu={() => {
                        setIsSelectedView(false)
                        setCurrCategory(null)
                    }}
                    refreshCategories={loadDatabase}
                    addNew={(englishText, chineseText, categoryText) => {
                        makeNewAudioEntry(
                            englishText,
                            chineseText,
                            categoryText,
                            () => {}
                        )
                    }}
                    db={db}
                    startCategory={enterCategory}
                    updateCategory={(category) => {
                        setEnterCategory(category)
                    }}
                    pauseAll={pauseAll}
                />
            </View>
        </Provider>
    )
}

export default App
