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
import AudioFooter from './src/views/footers/audiofooter'
import CategoryFooter from './src/views/footers/categoryfooter'
import { Auth } from 'aws-amplify'

// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

interface DefaultState {
    audioListDefault: AudioEntryPair[]
    defaultDisplayCategoryList: string[]
    defaultIsSelectedView: boolean
}

let db: HocDb = new HocDb()

// To think about: React Navigation?
// https://blog.logrocket.com/navigating-react-native-apps-using-react-navigation/

// Getting started with AWS CloudFormation
// https://levelup.gitconnected.com/setup-serverless-applications-with-aws-cloudformation-6042850f64d5

const MainScreen = ({ navigation }) => {
    const [audioEntries, setAudioEntries] = useState([])
    const [currentCategories, setCurrentCategories] = useState([
        'Loading from AWS...',
    ])
    const [isSelectedView, setIsSelectedView] = useState(false)
    const [enterCategory, setEnterCategory] = useState('')
    const { setShownIds } = useContext(ShownIdsContext)

    const [currentEmail, setCurrentEmail] = useState('[No email]')

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
            <View>
                <Text>
                    Current email: {currentEmail}
                </Text>
            </View>
            <Button
                onPress={async () => {
                    console.log('Testing current user')
                    const currUser = await Auth.currentAuthenticatedUser()
                    setCurrentEmail(currUser.attributes.email)
                    console.log(currUser.attributes)
                    // console.log(`Assigning email: ${currUser.email}`)
                }}
                title="Test"
            ></Button>
            <ScrollView>
                <CategoryCardList
                    categories={currentCategories}
                    currentCategories={currentCategories}
                    selectCategoryAction={(category) => {
                        navigation.navigate('Test', {
                            audioEntries,
                        })
                        retrieveCategoryEntriesList(category)
                        // setIsSelectedView(true)
                    }}
                />
            </ScrollView>

            <CategoryFooter
                refreshCategories={loadDatabaseInMainScreen}
                addEntry={(englishText, chineseText, categoryText) => {
                    makeNewAudioEntry(
                        englishText,
                        chineseText,
                        categoryText,
                        () => {}
                    )
                }}
                startCategory={enterCategory}
                updateCategory={(category) => {
                    setEnterCategory(category)
                }}
                loadDb={loadDatabaseInMainScreen}
            />

            {/* <Footer
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
            /> */}
        </View>
    )
}

export default MainScreen
