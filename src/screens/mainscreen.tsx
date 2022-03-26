import { Auth } from 'aws-amplify'
import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, TouchableOpacityBase, View } from 'react-native'
import { Text } from 'react-native-elements'

import { BasicCard } from '../uicomponents/cards'
import { AudioEntryPair } from '../backend/audioentry'
import {
    DbContext,
    FlaggedIdsContext,
    ShownIdsContext,
} from '../../store/contexts/contexts'
import { makeNewAudioEntry } from '../backend/apicalls'
import CategoryFooter from '../views/footers/categoryfooter'
import CategoryCardList from '../views/list/categorycardlist'
import { HomeProps } from './navigationutils'
import ClickableIcon from '../util/clickableicon'
import { sc } from '../uicomponents/style'

const MainScreen = ({ navigation }: HomeProps) => {
    const [currentCategories, setCurrentCategories] = useState([
        'Loading from AWS...',
    ])
    const [enterCategory, setEnterCategory] = useState('')
    const { setShownIds } = useContext(ShownIdsContext)

    const [menuOpen, setMenuOpen] = useState(false)

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
        const flaggedEntries = audioEntries.filter((audioEntry) =>
            flaggedIds.includes(audioEntry.id)
        )
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
            {/* <View style={{paddingLeft: 15, paddingVertical: 5}}>
                <Text style={{color: "gray"}}>Current email: {db.getUser()}</Text>
            </View> */}

            <BasicCard
                key="test"
                text={`Play flag: ${flaggedIds.length}`}
                action={() => {
                    const flagged = retrieveFlaggedEntriesList()
                    navigation.navigate('Audio entries', {
                        audioEntries: flagged,
                    })
                }}
            ></BasicCard>

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

            {menuOpen ? (
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
            ) : null}

            <ClickableIcon
                iconStyle={{
                    backgroundColor: sc.colors.green,
                    padding: 20,
                    borderRadius: 50,
                    width: 60,
                    height: 60,
                    textAlign: 'center',
                    right: 10,
                    bottom: 10,
                }}
                containerStyle={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                }}
                icon={!menuOpen ? 'plus' : 'times'}
                size={25}
                color={sc.colors.white}
                clickCallback={() => {
                    setMenuOpen(!menuOpen)
                }}
            ></ClickableIcon>
            {/* {!menuOpen ? (
            ) : (
                null
            )} */}

            {/* <Text style={{ position: 'absolute', bottom: 50, right: 10 }}>
                Floating text
            </Text> */}
        </View>
    )
}

export default MainScreen
