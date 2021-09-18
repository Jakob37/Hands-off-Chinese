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

Amplify.configure(awsconfig)
// Needed to run in production? (verify)
Amplify.register(Storage)

// Continue testing: https://docs.amplify.aws/lib/storage/getting-started/q/platform/js#using-a-custom-plugin
// Further configuration needed??

const listBucket = async () => {
    const listResult = await Storage.list("")
    console.log(listResult)
}

const refreshClick = async () => {
    const listResult = await Storage.list("")
    console.log(listResult)
    console.log("refresh!")
}

/**
 * @param {string} category
 */
const listCategory = async (category) => {
    console.log("obtaining category", category)
    const result = await getMetaByCategory()
    console.log(result.get(category))
}

const App = () => {
    const refreshS3List = () => {
        retrieveEntriesFromS3().then((returnedList) =>
            setAudioList(returnedList)
        )
    }
    useEffect(refreshS3List, [])

    const refreshCategories = () => {
        getCategories().then((returnedCategories) => {
            setCategoryList(returnedCategories.categories)
            setDisplayCategoryList(returnedCategories.categoriesWithCounts)
        })
    }
    useEffect(refreshCategories, [])

    const [audioList, setAudioList] = React.useState([
        ["[English1]", "englishkey", "[Chinese1]", "chinesekey"],
        ["[English2]", "englishkey", "[Chinese2]", "chinesekey"],
    ])

    const [chineseText, setChineseText] = React.useState("")
    const [englishText, setEnglishText] = React.useState("")
    const [categoryText, setCategoryText] = React.useState("")

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
                            listCategory(category)
                        }}
                        refresh={refreshCategories}
                    />
                </ScrollView>
            ) : (
                <ScrollableAudioCardList
                    audioList={audioList}
                    refreshS3List={refreshS3List}
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
                setChineseText={setChineseText}
                setEnglishText={setEnglishText}
                chineseText={chineseText}
                englishText={englishText}
                setList={setAudioList}
                isSelectedView={isSelectedView}
                entryMenuOpen={addEntryMenuOpen}
                backToMenu={() => {
                    setIsSelectedView(false)
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

    // FIXME: Can parts of these be used?
    {
        /* <Menu></Menu> */
    }
    {
        /* <AudioPlayerCard key="audioPlayer" /> */
    }
}

export default App
