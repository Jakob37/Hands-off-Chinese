import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, Button } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { AudioEntryPair } from 'src/backend/audioentry'
import { loadDatabase } from './store/actions/audioentries'
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

    const pausedIds = useSelector((state) => state.audioEntries.pausedIds)



    const retrieveCategoryEntriesList = (category: string) => {
        const audioEntries = db.getAudioEntries(category)
        setAudioEntries(audioEntries)
    }

    const [audioEntries, setAudioEntries] = useState(audioListDefault)
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
        <View style={{ flex: 1 }}>
            {!isSelectedView ? (
                <View>
                    <Text style={styles.header}>Hands-off Chinese</Text>
                </View>
            ) : (
                <></>
            )}

            <Button onPress={() => {
                console.log('Paused IDs')
                console.log(pausedIds)
            }} title="Test"></Button>

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
                    handleToggleComplete={handleToggleComplete}
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
                pauseAll={pauseAll}
            />
        </View>
    )
}

export default MainScreen
