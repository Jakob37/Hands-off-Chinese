import { Auth } from 'aws-amplify'
import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Input, Overlay, Text } from 'react-native-elements'
import {
    DbContext,
    FlaggedIdsContext,
    PausedIdsContext,
    ShownIdsContext,
} from '../../store/contexts/contexts'
import {
    getUserDataRequest,
    makeNewAudioEntry,
    putUserDataRequest,
} from '../backend/apicalls'
import { AudioEntryPair } from '../backend/audioentry'
import { FloatingActionButton } from '../uicomponents/buttons'
import { BasicCard } from '../uicomponents/cards'
import { sc } from '../uicomponents/style'
import CategoryCardList from '../views/list/categorycardlist'
import { HomeProps, NAVIGATION } from './navigationutils'

const FLAGS_ID = 'flags'
const PAUSED_ID = 'paused'

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
    const { flaggedIds, setFlaggedIds } = useContext(FlaggedIdsContext)
    const { pausedIds, setPausedIds } = useContext(PausedIdsContext)

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
            getUserDataRequest(
                FLAGS_ID,
                db.getUser(),
                (retrievedFlaggedIds) => {
                    setFlaggedIds(retrievedFlaggedIds as string[])
                }
            )
            getUserDataRequest(
                PAUSED_ID,
                db.getUser(),
                (retrievedPausedIds) => {
                    setFlaggedIds(retrievedPausedIds as string[])
                }
            )
        })
    }
    useEffect(setUserData, [])

    return (
        <View style={{ flex: 1 }}>
            <Button
                onPress={() => {
                    console.log('Test press')
                    // navigation.navigate(NAVIGATION.testAudioPlayer, {title: 'Test'})
                }}
                title={'Test title'}
            ></Button>

            <BasicCard
                key="test"
                text={`${flaggedIds.length}`}
                icon={{
                    icon: 'flag',
                    color:
                        flaggedIds.length > 0
                            ? sc.colors.blue
                            : sc.colors.black,
                }}
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

            <View>
                <FloatingActionButton
                    iconColor={sc.colors.white}
                    backgroundColor={sc.colors.green}
                    icon="plus"
                    yPosition={0}
                    onPress={() => {
                        setMenuOpen(!menuOpen)
                    }}
                ></FloatingActionButton>

                <FloatingActionButton
                    icon="cloud-download"
                    yPosition={1}
                    onPress={() => {
                        getUserDataRequest(
                            FLAGS_ID,
                            db.getUser(),
                            (retrievedFlaggedIds) => {
                                setFlaggedIds(retrievedFlaggedIds as string[])
                            }
                        )

                        getUserDataRequest(
                            PAUSED_ID,
                            db.getUser(),
                            (retrievedPausedIds) => {
                                setPausedIds(retrievedPausedIds as string[])
                            }
                        )
                    }}
                ></FloatingActionButton>

                <FloatingActionButton
                    icon="cloud-upload"
                    yPosition={2}
                    onPress={() => {
                        putUserDataRequest(FLAGS_ID, db.getUser(), flaggedIds)
                        putUserDataRequest(PAUSED_ID, db.getUser(), pausedIds)
                    }}
                ></FloatingActionButton>
            </View>
        </View>
    )
}

export default MainScreen
