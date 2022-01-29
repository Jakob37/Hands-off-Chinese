import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, Button } from 'react-native'
import { AudioEntryPair } from 'src/backend/audioentry'
import { makeNewAudioEntry } from './src/backend/apicalls'
import { styles } from './src/style/Stylesheet'
import Footer from './src/views/footers/footer'
import CategoryCardList from './src/views/list/categorycardlist'
import { HocDb } from './src/backend/database'
import { useContext } from 'react'
import { ShownIdsContext } from './store/contexts/mytestcontext'
import { AudioCardList } from './src/views/list/audiocardlist'

interface DefaultState {
    audioListDefault: AudioEntryPair[]
    defaultDisplayCategoryList: string[]
    defaultIsSelectedView: boolean
}

let db: HocDb = new HocDb()

// To think about: React Navigation?
// https://blog.logrocket.com/navigating-react-native-apps-using-react-navigation/

const MainScreen: React.FunctionComponent = () => {
    const [audioEntries, setAudioEntries] = useState([])
    const [currentCategories, setCurrentCategories] = useState([
        'Loading from AWS...',
    ])
    const [isSelectedView, setIsSelectedView] = useState(false)
    const [enterCategory, setEnterCategory] = useState('')
    const { setShownIds } = useContext(ShownIdsContext)

    const loadDatabaseInMainScreen = () => {
        db.initDatabase(() => {
            setCurrentCategories(db.getCategories())
        })
    }
    useEffect(loadDatabaseInMainScreen, [])

    const retrieveCategoryEntriesList = (category: string) => {
        const audioEntries = db.getAudioEntries(category)
        const shownIds = audioEntries.map((entry) => entry.id)
        setShownIds(shownIds)
        setAudioEntries(audioEntries)
    }

    return (
        <View style={{ flex: 1 }}>
            {/* {!isSelectedView ? (
                <View>
                    <Text style={styles.header}>Hands-off Chinese</Text>
                </View>
            ) : (
                <></>
            )} */}

            {!isSelectedView ? (
                <ScrollView>
                    <CategoryCardList
                        categories={currentCategories}
                        currentCategories={currentCategories}
                        selectCategoryAction={(category) => {
                            retrieveCategoryEntriesList(category)
                            setIsSelectedView(true)
                        }}
                    />
                </ScrollView>
            ) : (
                <ScrollView>
                    <AudioCardList
                        listEntries={audioEntries}
                        endAction={() => {}}
                    />
                </ScrollView>
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
