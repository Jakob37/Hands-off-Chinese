import React, { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
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
    defaultCategory: string | null
    defaultDisplayCategoryList: string[]
    defaultIsSelectedView: boolean
}

let db

const MainScreen: React.FunctionComponent<DefaultState> = ({
    audioListDefault = [],
    defaultCategory = null,
    defaultDisplayCategoryList = ['Loading from AWS...'],
    defaultIsSelectedView = false,
}) => {

    const availableMeals = useSelector(
        (state) => state.meals.filteredMeals
    )

    const dispatch = useDispatch()
    const loadDatabaseHandler = () => {
        dispatch(loadDatabase((loadedDb) => {
            console.log('Callback!')
            db = loadedDb
            console.log(loadedDb)
        }))
    }


    const loadDatabaseInMainScreen = () => {


        console.log('Calling loading')

        // const availableMeals = useSelector(
        //     (state) => state.meals.filteredMeals
        // )
    
        // console.log('---> Meals found inside:', availableMeals)


        loadDatabaseHandler()
        // console.log('Obtained db', obtainedDb)

        

        // db = useSelector((state) => state.audioEntries.db)

        // let categories = useSelector((state) => state.categories.categories)

        // useDispatch()

        // db = useSelector((state) => state.audioEntries.db)
        // db = useSelector(
        //     (state: RootState) => state.audioEntries.db
        // )
        // db.initDatabase((db) => {
        //     setDisplayCategoryList(db.getCategories())
        // })

        console.log('Calling loading end')
    }

    const refresh = () => {
        console.log('Refresh')

        console.log('Available meals', availableMeals)

        console.log(db)

        // const result = useSelector((state) => state.categories.categories)

        // console.log(categories)
    }

    // useEffect(loadDatabase, [])

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
                        const newCategory = `Category: ${Math.random()}`
                        console.log('Adding category', newCategory)
                        console.log('Existing categories:')
                    }}
                    title="Test the categories"
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
