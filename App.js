import Amplify, { Storage } from "aws-amplify"
import React, { useEffect } from "react"
import { ScrollView, View } from "react-native"
import { Header } from "./components/Header"
import {
    getCategories,
    getMetaByCategory,
    makeNewAudioEntry,
    retrieveEntriesFromS3,
} from "./src/apicalls"
import awsconfig from "./src/aws-exports"
import AddAudioMenu from "./src/views/addaudiomenu"
// import CategoryCardList from "./src/views/list/categorycardlist.js";
import Footer from "./src/views/footer"
import CategoryCardList from "./src/views/list/categorycardlist"
import ScrollableAudioCardList from "./src/views/list/scrollableaudiocardlist"

/**
 * @typedef {import('./src/apicalls.js').MetaObj} MetaObj
 */

Amplify.configure(awsconfig)
// Needed to run in production? (verify)
Amplify.register(Storage)

// Continue testing: https://docs.amplify.aws/lib/storage/getting-started/q/platform/js#using-a-custom-plugin
// Further configuration needed??

const listBucket = async () => {
    const listResult = await Storage.list("")
}

const refreshClick = async () => {
    const listResult = await Storage.list("")
}

/**
 * @param {string} category
 * @returns {Promise<import("./src/apicalls").MetaObj[]>}
 */
const listCategory = async (category) => {
    const result = await getMetaByCategory()
    return result.get(category)
}

class LanguagePair {
    id
    /** @type {{text:string, filename:string}[]} */
    chinese = []
    /** @type {{text:string, filename:string}[]} */
    english = []

    /**
     * @param {string} id
     */
    constructor(id) {
        this.id = id
    }

    /**
     * @param {MetaObj} metaObj
     */
    addEntry(metaObj) {
        if (metaObj.language == 'chinese') {
            this._addChinese(metaObj.text, metaObj.filename)
        } else {
            this._addEnglish(metaObj.text, metaObj.filename)
        }
    }

    /**
     * @param {string} text
     * @param {string} filename
     */
    _addChinese(text, filename) {
        this.chinese.push({ text, filename })
    }

    /**
     * @param {string} text
     * @param {string} filename
     */
    _addEnglish(text, filename) {
        this.english.push({ text, filename })
    }

    /**
     * @returns {boolean}
     */
    isValid() {
        return this.chinese.length == 1 && this.english.length == 1
    }

    /**
     * @returns {[string,string,string,string]}
     */
    getFourStrings() {
        return [
            this.chinese[0].text,
            this.chinese[0].filename,
            this.english[0].text,
            this.english[0].filename,
        ]
    }
}

/**
 * @param {string} category
 * @returns {Promise<[string,string,string,string][]>}
 */
const getAudioListForCategory = async (category) => {
    const categoryEntries = await listCategory(category)

    /** @type {Map<string,LanguagePair>} */
    const idToLanguagePair = new Map()

    for (const categoryEntry of categoryEntries) {
        const languagePair = idToLanguagePair.get(categoryEntry.id)
        if (languagePair != null) {
            languagePair.addEntry(categoryEntry)
        } else {
            const newPair = new LanguagePair(categoryEntry.id)
            newPair.addEntry(categoryEntry)
            idToLanguagePair.set(
                categoryEntry.id,
                newPair
            )
        }
    }

    const validPairs = Array.from(idToLanguagePair.values()).filter((pair) =>
        pair.isValid()
    )
    const returnPairs = validPairs.map((validPair) =>
        validPair.getFourStrings()
    )
    return returnPairs
}

const App = () => {

    const retrieveCategoryEntriesList = (category) => {
        getAudioListForCategory(category).then((returnedList) => {
            setAudioList(returnedList)
        })
    }

    const refreshCategories = () => {
        getCategories().then((returnedCategories) => {
            setCategoryList(returnedCategories.categories)
            setDisplayCategoryList(returnedCategories.categoriesWithCounts)
        })
    }
    useEffect(refreshCategories, [])

    const [audioList, setAudioList] = React.useState([])

    const [chineseText, setChineseText] = React.useState("")
    const [englishText, setEnglishText] = React.useState("")
    const [categoryText, setCategoryText] = React.useState("")

    const [currCategory, setCurrCategory] = React.useState(null)

    const [categoryList, setCategoryList] = React.useState([
        "Category1",
        "Category2",
        "Category3",
    ])
    const [displayCategoryList, setDisplayCategoryList] = React.useState([
        "Category1 (6)",
        "Category2 (3)",
        "Category3 (4)",
    ])

    const [addEntryMenuOpen, setAddEntryMenuOpen] = React.useState(false)
    const [isSelectedView, setIsSelectedView] = React.useState(false)

    return (
        <View style={{ flex: 1 }}>
            <Header header="Hands-off Chinese"></Header>

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
                        refresh={refreshCategories}
                    />
                </ScrollView>
            ) : (
                <ScrollableAudioCardList
                    audioList={audioList}
                    // refreshS3List={refreshS3List}
                />
            )}

            {addEntryMenuOpen ? (
                <AddAudioMenu
                    setChineseText={setChineseText}
                    setEnglishText={setEnglishText}
                    setCategoryText={setCategoryText}
                />
            ) : null}

            <Footer
                pathPairs={currCategory != null ? 
                    audioList.map((entry) => {
                        const output = [entry[1], entry[3]]
                        return output
                    }) :
                    []
                }
                isSelectedView={isSelectedView}
                entryMenuOpen={addEntryMenuOpen}
                backToMenu={() => {
                    setIsSelectedView(false)
                    setCurrCategory(null)
                }}
                openAddEntryMenu={() => {
                    setAddEntryMenuOpen(true)
                }}
                closeAddEntryMenu={() => {
                    setAddEntryMenuOpen(false)
                }}
                refreshCategories={refreshCategories}
                addNew={() => {
                    makeNewAudioEntry(
                        englishText,
                        chineseText,
                        categoryText,
                        () => {
                            console.log("Completed logic coming here!")
                        }
                    )
                    setAddEntryMenuOpen(false)
                    setChineseText("")
                    setEnglishText("")
                    setCategoryText("")
                }}
            />
        </View>
    )
}

export default App
