import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, Button } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { AudioEntryPair } from 'src/backend/audioentry'
import { loadDatabase, setCurrentEntries } from './store/actions/audioentries'
import { makeNewAudioEntry } from './src/backend/apicalls'
import { styles } from './src/style/Stylesheet'
import Footer from './src/views/footers/footer'
import CategoryCardList from './src/views/list/categorycardlist'
import ScrollableAudioCardList from './src/views/list/scrollableaudiocardlist'
import { HocDb } from './src/backend/database'

interface DefaultState {
    audioListDefault: AudioEntryPair[]
    defaultDisplayCategoryList: string[]
    defaultIsSelectedView: boolean
}



let db: HocDb

const MainScreen: React.FunctionComponent<DefaultState> = ({
    audioListDefault = [],
    defaultDisplayCategoryList = ['Loading from AWS...'],
    defaultIsSelectedView = false,
}) => {
    const dispatch = useDispatch()
    const loadDatabaseHandler = (callback) => {
        dispatch(loadDatabase(callback))
    }
    const setCurrentEntriesHandler = (ids: Set<string>) => {
        dispatch(setCurrentEntries(ids))
    }

    const loadDatabaseInMainScreen = () => {
        loadDatabaseHandler((loadedDb) => {
            db = loadedDb
            setDisplayCategoryList(db.getCategories())
        })
    }

    const refresh = () => {
        console.log('Refresh')
    }

    useEffect(loadDatabaseInMainScreen, [])

    // const pausedIds = useSelector((state) => state.audioEntries.pausedIds)
    // const currentIds = useSelector((state) => state.audioEntries.currentIds)

    const retrieveCategoryEntriesList = (category: string) => {
        const audioEntries = db.getAudioEntries(category)
        setCurrentEntriesHandler(new Set(audioEntries.map((entry) => entry.id)))
        setAudioEntries(audioEntries)
    }

    const [audioEntries, setAudioEntries] = useState(audioListDefault)
    const [displayCategoryList, setDisplayCategoryList] = useState(
        defaultDisplayCategoryList
    )
    const [isSelectedView, setIsSelectedView] = useState(defaultIsSelectedView)
    const [enterCategory, setEnterCategory] = useState('')

    return (
        <View style={{ flex: 1 }}>
            {!isSelectedView ? (
                <View>
                    <Text style={styles.header}>Hands-off Chinese</Text>
                </View>
            ) : (
                <></>
            )}

            <Button
                onPress={() => {
                    console.log('Paused IDs')

                }}
                title="Test"
            ></Button>

            {!isSelectedView ? (
                <ScrollView>
                    <CategoryCardList
                        categories={displayCategoryList}
                        displayCategories={displayCategoryList}
                        selectAction={(category) => {
                            retrieveCategoryEntriesList(category)
                            setIsSelectedView(true)
                        }}
                    />
                </ScrollView>
            ) : (
                <ScrollableAudioCardList
                    audioList={audioEntries}
                    refreshS3List={() => {}}
                    // pausedIds={pausedIds}
                />
            )}

            <Footer
                audioEntries={audioEntries}
                isSelectedView={isSelectedView}
                backToMenu={() => {
                    setIsSelectedView(false)
                }}
                refreshCategories={refresh}
                addNew={(englishText, chineseText, categoryText) => {
                    makeNewAudioEntry(
                        englishText,
                        chineseText,
                        categoryText,
                        () => {}
                    )
                }}
                db={db}
                loadDb={loadDatabaseInMainScreen}
                startCategory={enterCategory}
                updateCategory={(category) => {
                    setEnterCategory(category)
                }}
            />
        </View>
    )
}

export default MainScreen
