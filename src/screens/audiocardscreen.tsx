import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Overlay } from 'react-native-elements'
import { AddEntryOverlay } from '../uicomponents/addentryoverlay'
import { DbContext } from '../../store/contexts/contexts'
import { NAVIGATION } from '../screens/navigationutils'
import { FloatingActionButton } from '../uicomponents/buttons'
import { icons } from '../uicomponents/style'
import { AudioCardList } from '../views/list/audiocardlist'
import { AudioEntriesProps } from './navigationutils'
import { makeNewAudioEntry } from '../backend/apicalls'
import { upperCaseFirst } from '../util/util'

const SPECIAL_CATEGORIES = 'Flagged'

function AudioCardScreen({ route, navigation }: AudioEntriesProps) {
    const { db } = useContext(DbContext)

    const [audioEntries, setAudioEntries] = useState(route.params.audioEntries)
    const [menuOpen, setMenuOpen] = useState(false)

    const refreshDatabase = () => {
        if (!SPECIAL_CATEGORIES.includes(route.params.category)) {
            db.initDatabase(() => {
                const categoryEntries = db.getAudioEntries(
                    route.params.category
                )
                setAudioEntries(categoryEntries)
            })
        }
    }
    useEffect(refreshDatabase, [])

    const isSpecialCategory = (): boolean => {
        return SPECIAL_CATEGORIES.includes(route.params.category)
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{paddingBottom: 150}}>
                <AudioCardList user={db.getUser()} listEntries={audioEntries} />
            </ScrollView>

            <Overlay
                isVisible={menuOpen}
                onBackdropPress={() => {
                    setMenuOpen(!menuOpen)
                }}
            >
                <AddEntryOverlay
                    category={route.params.category}
                    baseLanguage={'English'}
                    learnedLanguage={upperCaseFirst(route.params.learnedLanguage)}
                    onSubmit={(category, base, learned) => {
                        makeNewAudioEntry(
                            base,
                            learned,
                            category,
                            route.params.learnedLanguage,
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
                    icon={icons.play}
                    yPosition={0}
                    onPress={() => {
                        navigation.navigate(NAVIGATION.audioPlayer, {
                            audioEntries: route.params.audioEntries,
                            category: route.params.category,
                            learnedLanguage: route.params.learnedLanguage,
                        })
                    }}
                ></FloatingActionButton>
                {!SPECIAL_CATEGORIES.includes(route.params.category) && (
                    <FloatingActionButton
                        icon={icons.plus}
                        yPosition={1}
                        onPress={() => {
                            setMenuOpen(!menuOpen)
                        }}
                    ></FloatingActionButton>
                )}
            </View>
        </View>
    )
}

export default AudioCardScreen
