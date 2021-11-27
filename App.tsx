import Amplify, { Storage } from "aws-amplify"
import React, { useEffect } from "react"
import { Button, ScrollView, Text, View } from "react-native"
import { Database } from "./src/backend/database"
import awsconfig from "./src/aws-exports"
import {
    getAllMeta,
    getCategories,
    getMetaAsAudioEntries,
    makeNewAudioEntry,
} from "./src/backend/apicalls"
import {
    getAudioListForCategory,
    listCategory,
} from "./src/backend/languageentryhelpers"
import { styles } from "./src/Stylesheet"
import Footer from "./src/views/footer"
import CategoryCardList from "./src/views/list/categorycardlist"
import ScrollableAudioCardList from "./src/views/list/scrollableaudiocardlist"

/**
 * @typedef {import('./src/backend/apicalls.js').MetaObj} MetaObj
 */

Amplify.configure(awsconfig)
// Needed to run in production? (verify)
Amplify.register(Storage)

// Continue testing: https://docs.amplify.aws/lib/storage/getting-started/q/platform/js#using-a-custom-plugin
// Further configuration needed??

// /** @type {Map<string,{english:MetaObj, chinese:MetaObj, active:boolean}>} */
// const idToEntry = new Map()
// /** @type {Map<string,Set<string>>} */
// const categoryToIds = new Map()

const db = new Database();

const App = () => {
    const loadDatabase = () => {
        db.initDatabase((db) => {
            console.log(`Done loading ${db.audioEntries.size} entries`)
            setDisplayCategoryList(db.getCategories())
        })
    }
    useEffect(loadDatabase, [])

    const retrieveCategoryEntriesList = (category) => {
        console.log('retrieve category')
        // setAudioList(audioList)
    }

    const [audioList, setAudioList] = React.useState([])
    const [currCategory, setCurrCategory] = React.useState(null)

    const [categoryList, setCategoryList] = React.useState(["Category1"])
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
                    console.log("press!")
                    loadDatabase()
                }}
            />

            {!isSelectedView ? (
                <ScrollView>
                    <CategoryCardList
                        categories={categoryList}
                        displayCategories={displayCategoryList}
                        selectAction={(category) => {
                            retrieveCategoryEntriesList(category)
                            listCategory(category)
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
