import React, { useState } from 'react'
import { useContext } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AudioEntryPair } from '../../backend/audioentry'
import { removeFromArray } from '../../util/util'
import { PausedIdsContext } from '../../../store/contexts/mytestcontext'
import { styles } from '../../style/Stylesheet'
import AudioCardActive from './audiocardactive'
import AudioCardSettings from './audiocardsettings'
import { playAudio } from './util'
import Icon from 'react-native-vector-icons/FontAwesome'

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

    const [isFlagged, setIsFlagged] = useState(false)
    const [isOk, setIsOk] = useState(false)
    const [isWrong, setIsWrong] = useState(false)


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
            <View style={{ flex: 8 }}>
                <TouchableOpacity
                    onPress={() => {
                        console.log(
                            'Playing key',
                            param.audioEntryPair.chineseKey
                        )
                        playAudio(param.audioEntryPair.chineseKey, param.user)
                    }}
                >
                    <Text
                        style={[
                            styles.cardText,
                            { color: 'black' },
                        ]}
                    >
                        {param.audioEntryPair.chinese}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        playAudio(param.audioEntryPair.englishKey, param.user)
                    }}
                >
                    <Text
                        style={[
                            styles.cardText,
                            { color: 'gray' },
                        ]}
                    >
                        {param.audioEntryPair.english}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => {
                        // param.setSettingMode()
                        setIsFlagged(!isFlagged)
                    }}
                >
                    <Icon name="flag" size={25} color={isFlagged ? 'blue' : 'gray'}></Icon>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => {
                        // param.setSettingMode()
                        setIsOk(!isOk)
                    }}
                >
                    <Icon name="check" size={25} color={isOk ? 'green' : 'gray'}></Icon>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => {
                        // param.setSettingMode()
                        setIsWrong(!isWrong)
                    }}
                >
                    <Icon name="times" size={25} color={isWrong ? 'red' : 'gray'}></Icon>
                </TouchableOpacity>
            </View>

            {/* <View>
                <Text>
                    Actually, player information should be shown here. Retrieve
                    from audio player?
                </Text>
                <Text>{param.audioEntryPair.chineseKey}</Text>
            </View> */}
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
