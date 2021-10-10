import Amplify, { Storage } from "aws-amplify"
import React, { useEffect } from "react"
import { ScrollView, Text, View } from "react-native"
import awsconfig from "./src/aws-exports"
import {
    getCategories, makeNewAudioEntry
} from "./src/backend/apicalls"
import { getAudioListForCategory, listCategory } from "./src/backend/languageentryhelpers"
import { styles } from "./src/Stylesheet"
import AddAudioMenu from "./src/views/addaudiomenu"
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


const App = () => {
    const retrieveCategoryEntriesList = (category) => {
        getAudioListForCategory(category).then((returnedList) => {
            console.log("setting audio list", returnedList)
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

    // const [chineseText, setChineseText] = React.useState("")
    // const [englishText, setEnglishText] = React.useState("")
    // const [categoryText, setCategoryText] = React.useState("")

    const [currCategory, setCurrCategory] = React.useState(null)

    const [categoryList, setCategoryList] = React.useState([
        "Category1",
    ])
    const [displayCategoryList, setDisplayCategoryList] = React.useState([
        "Loading from AWS...",
    ])

    // const [addEntryMenuOpen, setAddEntryMenuOpen] = React.useState(false)
    const [isSelectedView, setIsSelectedView] = React.useState(false)

    return (
        <View style={{ flex: 1 }}>
            {/* <Header header="Hands-off Chinese"></Header> */}
            <View>
                <Text style={styles.header}>Hands-off Chinese</Text>
            </View>

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

            {/* {addEntryMenuOpen ? (
                <AddAudioMenu
                    // setChineseText={setChineseText}
                    // setEnglishText={setEnglishText}
                    // setCategoryText={setCategoryText}
                />
            ) : null} */}

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
                // entryMenuOpen={addEntryMenuOpen}
                backToMenu={() => {
                    setIsSelectedView(false)
                    setCurrCategory(null)
                }}
                // openAddEntryMenu={() => {
                //     console.log('setting open')
                //     // setAddEntryMenuOpen(true)
                // }}
                // closeAddEntryMenu={() => {
                //     // setAddEntryMenuOpen(false)
                // }}
                refreshCategories={refreshCategories}
                addNew={(englishText, chineseText, categoryText) => {
                    makeNewAudioEntry(
                        englishText,
                        chineseText,
                        categoryText,
                        (englishText, chineseText, categoryText) => {
                            console.log("Completed logic coming here!")
                        }
                    )
                    // setAddEntryMenuOpen(false)
                    // setChineseText("")
                    // setEnglishText("")
                    // setCategoryText("")
                }}
            />
        </View>
    )
}

export default App
