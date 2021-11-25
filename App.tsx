import Amplify, { Storage } from "aws-amplify"
import React, { useEffect } from "react"
import { Button, ScrollView, Text, View } from "react-native"
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
/** @type {Map<string,{english:MetaObj, chinese:MetaObj, active:boolean}>} */
const idToEntry = new Map()
/** @type {Map<string,Set<string>>} */
const categoryToIds = new Map()

const App = () => {
    const loadDatabase = () => {
        getAllMeta().then((result) => {
            for (const resultEntry of result) {
                if (!idToEntry.get(resultEntry.id)) {
                    idToEntry.set(resultEntry.id, {
                        english: null,
                        chinese: null,
                        active: true,
                    })
                }

                idToEntry.get(resultEntry.id)[resultEntry.language] =
                    resultEntry
                if (!categoryToIds.has(resultEntry.category)) {
                    categoryToIds.set(resultEntry.category, new Set())
                }
                categoryToIds.get(resultEntry.category).add(resultEntry.id)
            }

            setCategoryList(Array.from(categoryToIds.keys()))

            const categoryWithCounts = Array.from(categoryToIds).map(
                ([category, ids]) => `${category} (${ids.size})`
            )

            setDisplayCategoryList(categoryWithCounts)
        })
    }
    useEffect(loadDatabase, [])

    const retrieveCategoryEntriesList = (category) => {
        const entries = categoryToIds.get(category)
        const audioList = []
        for (const entryId of Array.from(entries)) {
            const entries = idToEntry.get(entryId)
            audioList.push([
                entries.english.text,
                entries.english.filename,
                entries.chinese.text,
                entries.chinese.filename,
                entries.active,
            ])
        }
        setAudioList(audioList)
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
                    // console.log("loaded data:", categoryToIds, idToEntry)
                    console.log(await getMetaAsAudioEntries())
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
