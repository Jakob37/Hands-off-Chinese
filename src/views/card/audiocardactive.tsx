import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
Icon.loadFont()
import { AudioEntryPair } from 'src/backend/audioentry'
import { HocDb } from '../..//backend/database'
import { styles } from '../../style/Stylesheet'
import { playAudio } from './util'

interface AudioCardActiveParam {
    audioEntryPair: AudioEntryPair
    cardTextColor: string
    user: string
    togglePaused: () => void
    setSettingMode: () => void
}

const AudioCardActive = (param: AudioCardActiveParam) => {

    return (
        <>
            <View style={{ flex: 10 }}>
                <TouchableOpacity
                    onPress={() => {
                        console.log('Playing key', param.audioEntryPair.chineseKey)
                        playAudio(param.audioEntryPair.chineseKey, param.user)
                    }}
                >
                    <Text
                        style={[
                            styles.cardText,
                            { color: param.cardTextColor },
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
                            { color: param.cardTextColor },
                        ]}
                    >
                        {param.audioEntryPair.english}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => {
                        param.setSettingMode()
                    }}
                >
                    <Icon name="gear" size={20} color="gray"></Icon>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => {
                        param.togglePaused()
                    }}
                >
                    <Icon name="pause" size={20} color="gray"></Icon>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default AudioCardActive
