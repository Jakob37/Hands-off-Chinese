import React, { useContext } from 'react'
import { ScrollView, View } from 'react-native'
import ClickableIcon from '../uicomponents/clickableicon'
import { DbContext } from '../../store/contexts/contexts'
import { AudioCardList } from '../views/list/audiocardlist'
import { AudioEntriesProps } from './navigationutils'
import { icons, sc } from '../uicomponents/style'
import { FloatingActionButton } from '../uicomponents/buttons'
import { NAVIGATION } from '../screens/navigationutils'

function AudioCardScreen({ route, navigation }: AudioEntriesProps) {
    const { db } = useContext(DbContext)

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <AudioCardList
                    user={db.getUser()}
                    listEntries={route.params.audioEntries}
                />
            </ScrollView>

            <FloatingActionButton
                icon={icons.play}
                onPress={() => {
                    navigation.navigate(NAVIGATION.testAudioPlayer, {
                        audioEntries: route.params.audioEntries,
                    })
                    // navigation.navigate(NAVIGATION.audioPlayer, {
                    //     audioEntries: route.params.audioEntries,
                    // })
                }}
            ></FloatingActionButton>
        </View>
    )
}

export default AudioCardScreen
