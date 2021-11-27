import React, { useEffect } from "react"
import { Button, ScrollView, Text, View } from "react-native"
import { makeNewAudioEntry } from "./src/backend/apicalls"
import { Database } from "./src/backend/database"
import { listCategory } from "./src/backend/languageentryhelpers"
import { styles } from "./src/Stylesheet"
import Footer from "./src/views/footer"
import CategoryCardList from "./src/views/list/categorycardlist"
import ScrollableAudioCardList from "./src/views/list/scrollableaudiocardlist"

const db = new Database()

const App = () => {
    const loadDatabase = () => {
        db.initDatabase((db) => {
            setDisplayCategoryList(db.getCategories())
        })
    }
    useEffect(loadDatabase, [])

    const retrieveCategoryEntriesList = (category) => {
        // console.log('retrieving for category', category)
        const audioEntries = db.getAudioEntries(category)
        // console.log('audio entries', audioEntries)
        const audioList = audioEntries.map((entry) => entry.getListFormat())
        // console.log('loaded list', audioList)
        setAudioList(audioList)
    }

    const [audioList, setAudioList] = React.useState([])
    const [currCategory, setCurrCategory] = React.useState(null)

    // const [categoryList, setCategoryList] = React.useState(["[Categories not loaded]"])
    const [displayCategoryList, setDisplayCategoryList] = React.useState([
        "Loading from AWS...",
    ])

    const [isSelectedView, setIsSelectedView] = React.useState(false)

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Text style={styles.header}>Hands-off Chinese</Text>
            </View>

            <Button
                title="Testbutton"
                onPress={async () => {
                    loadDatabase()
                }}
            />

            {!isSelectedView ? (
                <ScrollView>
                    <CategoryCardList
                        categories={displayCategoryList}
                        displayCategories={displayCategoryList}
                        selectAction={(category) => {
                            console.log("select action", category)
                            retrieveCategoryEntriesList(category)
                            // listCategory(category)
                            setIsSelectedView(true)
                            setCurrCategory(category)
                        }}
                        refresh={loadDatabase}
                    />
                </ScrollView>
            ) : (
                <ScrollableAudioCardList audioList={audioList} />
            )}

            <Footer
                pathPairs={
                    currCategory != null
                        ? audioList.map((entry) => {
                              const output = [entry[1], entry[3]]
                              return output
                          })
                        : []
                }
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
                        () => {
                            console.log("Completed logic coming here!")
                        }
                    )
                }}
            />
        </View>
    )
}

export default App
