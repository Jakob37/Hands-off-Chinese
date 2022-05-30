import { Auth } from 'aws-amplify'
import React, { useContext, useEffect, useState } from 'react'
import { Modal, ScrollView, View } from 'react-native'
import { LANGUAGES } from '../../config'
import {
    DbContext,
    FlaggedIdsContext,
    PausedIdsContext,
    ShownIdsContext
} from '../../store/contexts/contexts'
import {
    FLAGS_ID,
    getUserDataRequest,
    makeNewAudioEntry,
    PAUSED_ID
} from '../backend/apicalls'
import { AudioEntryPair } from '../backend/audioentry'
import { AddEntryOverlay } from '../uicomponents/addentryoverlay'
import { FloatingActionButton } from '../uicomponents/buttons'
import { BasicCard } from '../uicomponents/cards'
import { icons, sc } from '../uicomponents/style'
import { upperCaseFirst } from '../util/util'
import CategoryCardList from '../views/list/categorycardlist'
import { HomeProps } from './navigationutils'


const MainScreen = ({ navigation }: HomeProps) => {
    const [currentCategories, setCurrentCategories] = useState([
        'Loading from AWS...',
    ])

    const { setShownIds } = useContext(ShownIdsContext)
    const [menuOpen, setMenuOpen] = useState(false)
    const { db } = useContext(DbContext)
    const { flaggedIds, setFlaggedIds } = useContext(FlaggedIdsContext)
    const { setPausedIds } = useContext(PausedIdsContext)
    const [selectedIndex, _setSelectedIndex] = useState(0)
    const [userEmail, setUserEmail] = useState(null)

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
            const user = currUser.attributes.email
            db.setUser(user)
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
            setUserEmail(user)
        })
    }
    useEffect(setUserData, [])

    const refreshDatabase = () => {
        if (userEmail != null) {
            db.initDatabase(userEmail, () => {
                setCurrentCategories(db.getCategories())
            })
        }
    }
    useEffect(refreshDatabase, [userEmail])

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
                        category: 'Flagged',
                        learnedLanguage: LANGUAGES[selectedIndex],
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
                            learnedLanguage: LANGUAGES[selectedIndex],
                        })
                    }}
                    db={db}
                />
            </ScrollView>

            {menuOpen ? (
                <Modal>
                    <AddEntryOverlay
                        category={null}
                        baseLanguage={'English'}
                        learnedLanguage={upperCaseFirst(
                            LANGUAGES[selectedIndex]
                        )}
                        onSubmit={(language, category, baseText, learnedText) => {
                            makeNewAudioEntry(
                                baseText,
                                learnedText,
                                category,
                                language,
                                db.getUser(),
                                () => {},
                                () => {
                                    refreshDatabase()
                                }
                            )
                            setMenuOpen(false)
                        }}
                        onCancel={() => {
                            setMenuOpen(false)
                        }}
                    ></AddEntryOverlay>
                </Modal>
            ) : undefined}

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
            </View>
        </View>
    )
}

export default MainScreen
