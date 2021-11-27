import React, { useEffect } from "react"
import { Button, ScrollView, Text, View } from "react-native"
import { makeNewAudioEntry } from "./src/backend/apicalls"
import { Database } from "./src/backend/database"
import { styles } from "./src/style/Stylesheet"
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
        const audioEntries = db.getAudioEntries(category)
        const audioList = audioEntries.map((entry) => entry.getListFormat())
        setAudioList(audioList)
    }

    const [audioList, setAudioList] = React.useState([])
    const [currCategory, setCurrCategory] = React.useState(null)
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
                            retrieveCategoryEntriesList(category)
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
                            console.warn("Completed logic coming here!")
                        }
                    )
                }}
            />
        </View>
    )
}

export default App
