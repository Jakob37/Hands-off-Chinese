import Amplify, { Storage } from "aws-amplify"
import React, { useEffect } from "react"
import awsconfig from "./src/aws-exports"
import { Button, ScrollView, Text, View } from "react-native"
import { AudioEntryPair } from "src/backend/audioentry"
import { makeNewAudioEntry } from "./src/backend/apicalls"
import { Database } from "./src/backend/database"
import { styles } from "./src/style/Stylesheet"
import Footer from "./src/views/footers/footer"
import CategoryCardList from "./src/views/list/categorycardlist"
import ScrollableAudioCardList from "./src/views/list/scrollableaudiocardlist"

// FIXME: Leave Amplify
Amplify.configure(awsconfig)
// Needed to run in production? (verify)
Amplify.register(Storage)

const db = new Database()

interface DefaultState {
    audioListDefault: AudioEntryPair[]
    defaultCategory: string | null
    defaultDisplayCategoryList: string[]
    defaultIsSelectedView: boolean
}

// const defaultState =

const App: React.FunctionComponent<DefaultState> = ({
    audioListDefault = [],
    defaultCategory = null,
    defaultDisplayCategoryList = ["Loading from AWS..."],
    defaultIsSelectedView = false,
}) => {
    const loadDatabase = () => {
        db.initDatabase((db) => {
            setDisplayCategoryList(db.getCategories())
        })
    }
    useEffect(loadDatabase, [])

    const retrieveCategoryEntriesList = (category: string) => {
        const audioEntries = db.getAudioEntries(category)
        setAudioList(audioEntries)
    }

    const [audioList, setAudioList] = React.useState(
        audioListDefault
    )
    const [currCategory, setCurrCategory] = React.useState(
        defaultCategory
    )
    const [displayCategoryList, setDisplayCategoryList] = React.useState(
        defaultDisplayCategoryList
    )
    const [isSelectedView, setIsSelectedView] = React.useState(
        defaultIsSelectedView
    )

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
                    />
                </ScrollView>
            ) : (
                <ScrollableAudioCardList
                    audioList={audioList}
                    refreshS3List={() => console.log("Refresh S3 placeholder")}
                />
            )}

            <Footer
                audioEntries={audioList}
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
