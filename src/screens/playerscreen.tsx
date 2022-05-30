import React, { useContext, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { DbContext } from '../../store/contexts/contexts'
import { sc } from '../uicomponents/style'
import { PlayerCardList } from '../views/list/playercardlist'
import { AudioPlayerProps } from './navigationutils'
import AudioPlayer from '../audio/audioplayercomponent'

const delayDiff = 0.5
const milliseconds = 1000

const AudioState = Object.freeze({
    stopped: 0,
    playing_english: 1,
    english_pause: 2,
    playing_chinese: 3,
    chinese_pause: 4,
})

function PlayerScreen({ route, navigation }: AudioPlayerProps) {
    const { db } = useContext(DbContext)
    const [playedEntries, setPlayedEntries] = useState([])

    return (
        <View style={{ flex: 1 }}>
            <View style={{ paddingLeft: sc.componentMargins.large }}></View>
            <ScrollView>
                <PlayerCardList
                    user={db.getUser()}
                    listEntries={playedEntries}
                />
            </ScrollView>

            {/* FIXME: Why is it pushed down into the bottom without the min height? */}
            <View style={{ justifyContent: 'flex-end', minHeight: '15%' }}>
                <AudioPlayer
                    audioEntries={route.params.audioEntries}
                    newEntryCallback={(audioEntry) => {
                        setPlayedEntries([audioEntry, ...playedEntries])
                    }}
                ></AudioPlayer>
            </View>
        </View>
    )
}

export default PlayerScreen
