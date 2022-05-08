import React, { useContext, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Overlay } from 'react-native-elements'
import { AddEntryOverlay } from '../uicomponents/addentryoverlay'
import { DbContext } from '../../store/contexts/contexts'
import { NAVIGATION } from '../screens/navigationutils'
import { FloatingActionButton } from '../uicomponents/buttons'
import { icons } from '../uicomponents/style'
import { AudioCardList } from '../views/list/audiocardlist'
import { AudioEntriesProps } from './navigationutils'

function AudioCardScreen({ route, navigation }: AudioEntriesProps) {
    const { db } = useContext(DbContext)
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <AudioCardList
                    user={db.getUser()}
                    listEntries={route.params.audioEntries}
                />
            </ScrollView>

            <Overlay
                isVisible={menuOpen}
                onBackdropPress={() => {
                    setMenuOpen(!menuOpen)
                }}
            >
                <AddEntryOverlay
                    category={'test'}
                    baseLanguage={'English'}
                    learnedLanguage={'Chinese'}
                    onSubmit={() => {
                        console.log('On submit')
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
                        })
                    }}
                ></FloatingActionButton>
                <FloatingActionButton
                    icon={icons.plus}
                    yPosition={1}
                    onPress={() => {
                        setMenuOpen(!menuOpen)
                        // navigation.navigate(NAVIGATION.audioPlayer, {
                        //     audioEntries: route.params.audioEntries,
                        // })
                    }}
                ></FloatingActionButton>
            </View>
        </View>
    )
}

export default AudioCardScreen
