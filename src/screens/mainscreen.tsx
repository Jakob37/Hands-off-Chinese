import { Auth } from 'aws-amplify'
import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Input, Overlay, Text } from 'react-native-elements'
import {
    DbContext,
    FlaggedIdsContext,
    ShownIdsContext
} from '../../store/contexts/contexts'
import { makeNewAudioEntry } from '../backend/apicalls'
import { AudioEntryPair } from '../backend/audioentry'
import { BasicCard } from '../uicomponents/cards'
import { sc } from '../uicomponents/style'
import ClickableIcon from '../util/clickableicon'
import CategoryCardList from '../views/list/categorycardlist'
import { HomeProps } from './navigationutils'


const MainScreen = ({ navigation }: HomeProps) => {
    const [currentCategories, setCurrentCategories] = useState([
        'Loading from AWS...',
    ])

    const [categoryInput, setCategoryInput] = useState('')
    const [englishInput, setEnglishInput] = useState('')
    const [chineseInput, setChineseInput] = useState('')

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
                text={`${flaggedIds.length}`}
                icon="flag"
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

            <Overlay
                isVisible={menuOpen}
                onBackdropPress={() => {
                    setMenuOpen(!menuOpen)
                }}
            >
                <View>
                    <Text
                        style={{
                            marginHorizontal: sc.componentMargins.medium,
                            fontSize: sc.fontSizes.cardLarge,
                            paddingBottom: sc.componentMargins.medium,
                        }}
                    >
                        Please enter a sentence
                    </Text>
                    <Input
                        placeholder="Category"
                        onChangeText={(text) => setCategoryInput(text)}
                    ></Input>
                    <Input
                        placeholder="Chinese"
                        onChangeText={(text) => setChineseInput(text)}
                    ></Input>
                    <Input
                        placeholder="English"
                        onChangeText={(text) => setEnglishInput(text)}
                    ></Input>
                    <Button
                        onPress={() => {
                            makeNewAudioEntry(
                                englishInput,
                                chineseInput,
                                categoryInput,
                                db.getUser(),
                                () => {},
                                () => {
                                    refreshDatabase()
                                }
                            )
                            setMenuOpen(false)
                        }}
                        title={'Submit'}
                    ></Button>
                </View>
            </Overlay>

            <View
                style={{
                    position: 'absolute',
                    bottom: sc.componentMargins.large,
                    right: sc.componentMargins.large,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <View style={{ alignItems: 'flex-end' }}>
                    <ClickableIcon
                        iconColor={sc.colors.white}
                        backgroundColor={sc.colors.green}
                        icon={!menuOpen ? 'plus' : 'times'}
                        size={sc.iconSizes.large}
                        clickCallback={() => {
                            setMenuOpen(!menuOpen)
                        }}
                    ></ClickableIcon>
                </View>
            </View>
        </View>
    )
}

export default MainScreen
