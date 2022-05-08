import { Auth } from 'aws-amplify'
import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Overlay } from 'react-native-elements'
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
import { AddEntryOverlay } from '../uicomponents/addentryoverlay'
import { FloatingActionButton } from '../uicomponents/buttons'
import { BasicCard } from '../uicomponents/cards'
import { icons, sc } from '../uicomponents/style'
import CategoryCardList from '../views/list/categorycardlist'
import { HomeProps } from './navigationutils'

const FLAGS_ID = 'flags'
const PAUSED_ID = 'paused'

const MainScreen = ({ navigation }: HomeProps) => {
    const [currentCategories, setCurrentCategories] = useState([
        'Loading from AWS...',
    ])

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
                        category: 'Flagged'
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
                            category: category,
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
                <AddEntryOverlay
                    category={null}
                    baseLanguage={'English'}
                    learnedLanguage={'Chinese'}
                    onSubmit={(category, base, learned) => {
                        makeNewAudioEntry(
                            base,
                            learned,
                            category,
                            db.getUser(),
                            () => {},
                            () => {
                                refreshDatabase()
                            }
                        )
                        setMenuOpen(false)
                    }}
                ></AddEntryOverlay>
            </Overlay>

            <View>
                <FloatingActionButton
                    iconColor={sc.colors.white}
                    backgroundColor={sc.colors.green}
                    icon={icons.plus}
                    yPosition={0}
                    onPress={() => {
                        setMenuOpen(!menuOpen)
                    }}
                ></FloatingActionButton>

                <FloatingActionButton
                    icon={icons.download}
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
                    icon={icons.upload}
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
