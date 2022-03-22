import { Auth } from 'aws-amplify'
import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { AudioEntryPair } from '../../src/backend/audioentry'
import { CategoryCard } from '../../src/views/card/categorycard'
import {
    DbContext,
    FlaggedIdsContext,
    ShownIdsContext,
} from '../../store/contexts/contexts'
import { makeNewAudioEntry } from '../backend/apicalls'
import CategoryFooter from '../views/footers/categoryfooter'
import CategoryCardList from '../views/list/categorycardlist'
import { HomeProps } from './navigationutils'

const MainScreen = ({ navigation }: HomeProps) => {
    const [currentCategories, setCurrentCategories] = useState([
        'Loading from AWS...',
    ])
    const [enterCategory, setEnterCategory] = useState('')
    const { setShownIds } = useContext(ShownIdsContext)

    const { db } = useContext(DbContext)
    const { flaggedIds } = useContext(FlaggedIdsContext)

    const refreshDatabase = () => {
        db.initDatabase(() => {
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
        return audioEntries
    }

    const retrieveFlaggedEntriesList = (): AudioEntryPair[] => {
        const audioEntries = db._getAllEntries()
        const flaggedEntries = audioEntries.filter((audioEntry) => flaggedIds.includes(audioEntry.id))
        return flaggedEntries
    }

    const setUserData = () => {
        Auth.currentAuthenticatedUser().then((currUser) => {
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

            <CategoryCard
                key="test"
                displayCategory={`Play flagged: ${flaggedIds.length}`}
                selectAction={() => {
                    const flagged = retrieveFlaggedEntriesList()
                    navigation.navigate('Audio entries', {
                        audioEntries: flagged,
                    })
                }}
            ></CategoryCard>

            <ScrollView>
                <CategoryCardList
                    categories={currentCategories}
                    currentCategories={currentCategories}
                    selectCategoryAction={(category) => {
                        const newAudioEntries =
                            retrieveCategoryEntriesList(category)
                        navigation.navigate('Audio entries', {
                            audioEntries: newAudioEntries,
                        })
                    }}
                    db={db}
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
