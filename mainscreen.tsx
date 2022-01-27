import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, Button } from 'react-native'
import { AudioEntryPair } from 'src/backend/audioentry'
// import { loadDatabase, setCurrentEntries } from './store/actions/audioentries'
import { makeNewAudioEntry } from './src/backend/apicalls'
import { styles } from './src/style/Stylesheet'
import Footer from './src/views/footers/footer'
import CategoryCardList from './src/views/list/categorycardlist'
import ScrollableAudioCardList from './src/views/list/scrollableaudiocardlist'
import { HocDb } from './src/backend/database'
import { useContext } from 'react'
import { ShownIdsContext } from './store/contexts/mytestcontext'

interface DefaultState {
    audioListDefault: AudioEntryPair[]
    defaultDisplayCategoryList: string[]
    defaultIsSelectedView: boolean
}

let db: HocDb = new HocDb();

const MainScreen: React.FunctionComponent = () => {
    const { setShownIds } = useContext(ShownIdsContext)

    const loadDatabaseInMainScreen = () => {
        db.initDatabase(() => {
            setDisplayCategoryList(db.getCategories())
        })
    }

    // const refresh = () => {
    //     db.initDatabase(() => {
    //         setDisplayCategoryList(db.getCategories())
    //     })
    // }

    useEffect(loadDatabaseInMainScreen, [])

    const retrieveCategoryEntriesList = (category: string) => {
        const audioEntries = db.getAudioEntries(category)
        const shownIds = audioEntries.map((entry) => entry.id)
        setShownIds(shownIds)
        setAudioEntries(audioEntries)
    }

    const [audioEntries, setAudioEntries] = useState([])
    const [displayCategoryList, setDisplayCategoryList] = useState([
        'Loading from AWS...',
    ])
    const [isSelectedView, setIsSelectedView] = useState(false)
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
                refreshCategories={loadDatabaseInMainScreen}
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
