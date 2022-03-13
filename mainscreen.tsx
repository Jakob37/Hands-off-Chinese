import { Auth } from 'aws-amplify'
import React, { useContext, useEffect, useState } from 'react'
import { Button, ScrollView, Text, View } from 'react-native'
import { makeNewAudioEntry } from './src/backend/apicalls'
import { HocDb } from './src/backend/database'
import CategoryFooter from './src/views/footers/categoryfooter'
import CategoryCardList from './src/views/list/categorycardlist'
import { ShownIdsContext } from './store/contexts/mytestcontext'

let db: HocDb = new HocDb()

// To think about: React Navigation?
// https://blog.logrocket.com/navigating-react-native-apps-using-react-navigation/

const MainScreen = ({ navigation }) => {
    const [audioEntries, setAudioEntries] = useState([])
    const [currentCategories, setCurrentCategories] = useState([
        'Loading from AWS...',
    ])
    const [enterCategory, setEnterCategory] = useState('')
    const { setShownIds } = useContext(ShownIdsContext)

    const [currentUser, setCurrentUser] = useState('[Refresh to show email]')

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

    const setUserData = () => {
        Auth.currentAuthenticatedUser().then((currUser) => {
            console.log('Setting current user')
            setCurrentUser(currUser.attributes.email)
            console.log(currUser.attributes)
        })
    }
    useEffect(setUserData, [])

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Text>Current email: {currentUser}</Text>
            </View>
            <Button
                onPress={async () => {
                    const currUser = await Auth.currentAuthenticatedUser()
                    setCurrentUser(currUser.attributes.email)
                }}
                title="Force current user update"
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
                        currentUser,
                        () => {}
                    )
                }}
                startCategory={enterCategory}
                updateCategory={(category) => {
                    setEnterCategory(category)
                }}
                loadDb={loadDatabaseInMainScreen}
            />
        </View>
    )
}

export default MainScreen
