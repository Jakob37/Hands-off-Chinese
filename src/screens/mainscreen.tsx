import { Auth } from 'aws-amplify'
import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { AudioEntryPair } from 'src/backend/audioentry'
import { DbContext, ShownIdsContext } from '../../store/contexts/mytestcontext'
import { makeNewAudioEntry } from '../backend/apicalls'
import CategoryFooter from '../views/footers/categoryfooter'
import CategoryCardList from '../views/list/categorycardlist'

// let db: HocDb = new HocDb()

// To think about: React Navigation?
// https://blog.logrocket.com/navigating-react-native-apps-using-react-navigation/

const MainScreen = ({ navigation }) => {
    // const [audioEntries, setAudioEntries] = useState([])
    const [currentCategories, setCurrentCategories] = useState([
        'Loading from AWS...',
    ])
    const [enterCategory, setEnterCategory] = useState('')
    const { setShownIds } = useContext(ShownIdsContext)

    const { db } = useContext(DbContext)

    // const [currentUser, setCurrentUser] = useState('[Refresh to show email]')

    const refreshDatabase = () => {
        console.log('---> Loading database')
        db.initDatabase(() => {
            console.log('---> Processing finished')
            setCurrentCategories(db.getCategories())
        })
    }
    useEffect(refreshDatabase, [])

    const retrieveCategoryEntriesList = (
        category: string
    ): AudioEntryPair[] => {
        const audioEntries = db.getAudioEntries(category)
        const shownIds = audioEntries.map((entry) => entry.id)
        setShownIds(shownIds)
        // setAudioEntries(audioEntries)
        return audioEntries
    }

    const setUserData = () => {
        Auth.currentAuthenticatedUser().then((currUser) => {
            // setCurrentUser(currUser.attributes.email)
            db.setUser(currUser.attributes.email)
            console.log(currUser.attributes)
        })
    }
    useEffect(setUserData, [])

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Text>Current email: {db.getUser()}</Text>
            </View>
            {/* <Button
                onPress={async () => {
                    const currUser = await Auth.currentAuthenticatedUser()
                    setCurrentUser(currUser.attributes.email)
                }}
                title="Force current user update"
            ></Button> */}
            <ScrollView>
                <CategoryCardList
                    categories={currentCategories}
                    currentCategories={currentCategories}
                    selectCategoryAction={(category) => {
                        const newAudioEntries =
                            retrieveCategoryEntriesList(category)
                        navigation.navigate('Test', {
                            audioEntries: newAudioEntries,
                        })
                    }}
                />
            </ScrollView>

            <CategoryFooter
                refreshCategories={refreshDatabase}
                addEntry={(englishText, chineseText, categoryText) => {
                    makeNewAudioEntry(
                        englishText,
                        chineseText,
                        categoryText,
                        db.getUser(),
                        () => {},
                        () => {
                            console.log('Totally completed!')
                            refreshDatabase()
                        }
                    )
                }}
                startCategory={enterCategory}
                updateCategory={(category) => {
                    setEnterCategory(category)
                }}
                loadDb={refreshDatabase}
            />
        </View>
    )
}

export default MainScreen
