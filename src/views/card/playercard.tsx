import React, { useState } from 'react'
import { useContext } from 'react'
import { View, Text } from 'react-native'
import { AudioEntryPair } from '../../backend/audioentry'
import { removeFromArray } from '../../util/util'
import { PausedIdsContext } from '../../../store/contexts/mytestcontext'
import { styles } from '../../style/Stylesheet'
import AudioCardActive from './audiocardactive'
import AudioCardSettings from './audiocardsettings'

interface PlayerCardParam {
    audioEntryPair: AudioEntryPair
    isPaused: boolean
    user: string
    togglePaused: () => void
}
const PlayerCard = (param: PlayerCardParam) => {
    const [settingMode, setSettingMode] = useState(false)
    const [cardHeight, setCardHeight] = useState(0)
    const { pausedIds, setPausedIds } = useContext(PausedIdsContext)

    return (
        <View
            style={[
                styles.card,
                {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                },
            ]}
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout
                if (height > cardHeight) {
                    setCardHeight(height)
                }
            }}
        >
            <View>
                <Text>
                    Actually, player information should be shown here. Retrieve
                    from audio player?
                </Text>
                <Text>{param.audioEntryPair.chineseKey}</Text>
            </View>
            {/* <AudioCardSettings
                removeCallback={(englishFile: string, chineseFile: string) => {
                    console.log('FIXME: Currently not implemented')
                    // removeEntry(englishFile, chineseFile)
                }}
                backCallback={() => {
                    setSettingMode(false)
                }}
                minCardHeight={cardHeight}
                englishFile={param.audioEntryPair.englishKey}
                chineseFile={param.audioEntryPair.chineseKey}
            />
            ) */}
        </View>
    )
}

export { PlayerCard }
